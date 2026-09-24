import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { CallSession, CallType, User } from '../types';
import { storage } from '../services/storage';
import { webrtc } from '../services/webrtc';
import { sounds } from '../services/sounds';
import { useAuth } from './AuthContext';

interface CallContextType {
  activeCall: CallSession | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  callDuration: number;
  micLevel: number;
  incomingCall: CallSession | null;
  callerUser: User | null;
  partnerUser: User | null;
  startCall: (targetUserId: string, type: CallType) => Promise<void>;
  acceptCall: () => Promise<void>;
  rejectCall: () => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => Promise<void>;
  switchCamera: () => Promise<void>;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, users } = useAuth();
  const [activeCall, setActiveCall] = useState<CallSession | null>(() => storage.getActiveCall());
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [micLevel, setMicLevel] = useState(0);

  const durationTimerRef = useRef<number | null>(null);
  const micIntervalRef = useRef<number | null>(null);

  // Sync call state across tabs or storage events
  useEffect(() => {
    const unsub = storage.subscribe((event, data) => {
      if (event === 'CALL_STATE_CHANGED') {
        const call = data as CallSession | null;
        setActiveCall(call);
        if (!call) {
          cleanupStreams();
          sounds.stopRingtone();
        }
      }
    });
    return unsub;
  }, []);

  // Ringtone and call duration management
  useEffect(() => {
    if (!activeCall) {
      if (durationTimerRef.current) clearInterval(durationTimerRef.current);
      if (micIntervalRef.current) clearInterval(micIntervalRef.current);
      setCallDuration(0);
      sounds.stopRingtone();
      return;
    }

    if (activeCall.status === 'ringing') {
      if (currentUser && activeCall.receiver_id === currentUser.id) {
        sounds.startIncomingRingtone();
      }
    } else if (activeCall.status === 'connected') {
      sounds.stopRingtone();
      if (!durationTimerRef.current) {
        durationTimerRef.current = window.setInterval(() => {
          setCallDuration((prev) => prev + 1);
        }, 1000);
      }
      // Start audio level monitoring
      if (!micIntervalRef.current) {
        micIntervalRef.current = window.setInterval(() => {
          setMicLevel(webrtc.getAudioLevel());
        }, 120);
      }
    }
  }, [activeCall, currentUser]);

  const cleanupStreams = () => {
    webrtc.stopLocalStream();
    setLocalStream(null);
    setRemoteStream(null);
    setIsMuted(false);
    setIsVideoOff(false);
    setIsScreenSharing(false);
    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
      durationTimerRef.current = null;
    }
    if (micIntervalRef.current) {
      clearInterval(micIntervalRef.current);
      micIntervalRef.current = null;
    }
    setCallDuration(0);
  };

  const incomingCall =
    activeCall && currentUser && activeCall.receiver_id === currentUser.id && activeCall.status === 'ringing'
      ? activeCall
      : null;

  const callerUser = incomingCall ? users.find((u) => u.id === incomingCall.caller_id) || null : null;

  const partnerUserId = activeCall
    ? activeCall.caller_id === currentUser?.id
      ? activeCall.receiver_id
      : activeCall.caller_id
    : null;

  const partnerUser = partnerUserId ? users.find((u) => u.id === partnerUserId) || null : null;

  const startCall = async (targetUserId: string, type: CallType) => {
    if (!currentUser) return;

    try {
      const stream = await webrtc.getMediaStream(type === 'video', true);
      setLocalStream(stream);

      const session: CallSession = {
        id: `call_${Date.now()}`,
        caller_id: currentUser.id,
        receiver_id: targetUserId,
        type,
        status: 'ringing',
        started_at: Date.now(),
      };

      storage.setActiveCall(session);
      setActiveCall(session);

      storage.logAuditEvent(
        currentUser,
        'CALL_INITIATED',
        `Started 1:1 ${type.toUpperCase()} call to target user`,
        'info',
        users.find((u) => u.id === targetUserId)
      );

      // In real-time multi-tab or single-user testing: simulate connection if receiver is automated
      setTimeout(() => {
        const current = storage.getActiveCall();
        if (current && current.status === 'ringing') {
          // If testing alone, automatically accept to demonstrate full call UI & stream
          acceptCall();
        }
      }, 3500);
    } catch (err) {
      console.error('Failed to initiate call:', err);
    }
  };

  const acceptCall = async () => {
    sounds.stopRingtone();
    sounds.playCallConnected();

    const current = storage.getActiveCall();
    if (!current) return;

    try {
      const stream = await webrtc.getMediaStream(current.type === 'video', true);
      setLocalStream(stream);
      // Create remote simulated mirror stream for the visual experience
      setRemoteStream(stream);

      const updated: CallSession = {
        ...current,
        status: 'connected',
        connected_at: Date.now(),
      };
      storage.setActiveCall(updated);
      setActiveCall(updated);

      if (currentUser) {
        storage.logAuditEvent(currentUser, 'CALL_ACCEPTED', `Accepted call session ${updated.id}`);
      }
    } catch (err) {
      console.error('Error accepting call:', err);
    }
  };

  const rejectCall = () => {
    sounds.stopRingtone();
    sounds.playCallEnded();
    const current = storage.getActiveCall();
    if (current && currentUser) {
      storage.logAuditEvent(currentUser, 'CALL_REJECTED', `Declined call ${current.id}`);
    }
    storage.setActiveCall(null);
    cleanupStreams();
  };

  const endCall = () => {
    sounds.stopRingtone();
    sounds.playCallEnded();
    const current = storage.getActiveCall();
    if (current && currentUser) {
      storage.logAuditEvent(
        currentUser,
        'CALL_ENDED',
        `Call session duration: ${callDuration}s`
      );
      // Log call into conversation
      const conv = storage.createOrGetConversation(current.caller_id, current.receiver_id);
      storage.sendMessage({
        conversation_id: conv.id,
        sender_id: current.caller_id,
        receiver_id: current.receiver_id,
        message_type: 'call_log',
        content: `${current.type === 'video' ? '📹 Video call' : '📞 Audio call'} ended • ${Math.floor(callDuration / 60)}m ${callDuration % 60}s`,
      });
    }
    storage.setActiveCall(null);
    cleanupStreams();
  };

  const toggleMute = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    webrtc.toggleMicrophone(!nextState);
  };

  const toggleVideo = () => {
    const nextState = !isVideoOff;
    setIsVideoOff(nextState);
    webrtc.toggleCamera(!nextState);
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      webrtc.stopScreenShare();
      setIsScreenSharing(false);
      // Revert to camera stream
      const camStream = await webrtc.getMediaStream(true, true);
      setLocalStream(camStream);
    } else {
      const screenStream = await webrtc.startScreenShare(() => {
        setIsScreenSharing(false);
      });
      if (screenStream) {
        setIsScreenSharing(true);
        setLocalStream(screenStream);
      }
    }
  };

  const switchCamera = async () => {
    try {
      const nextStream = await webrtc.switchCamera();
      setLocalStream(nextStream);
    } catch {
      //
    }
  };

  return (
    <CallContext.Provider
      value={{
        activeCall,
        localStream,
        remoteStream,
        isMuted,
        isVideoOff,
        isScreenSharing,
        callDuration,
        micLevel,
        incomingCall,
        callerUser,
        partnerUser,
        startCall,
        acceptCall,
        rejectCall,
        endCall,
        toggleMute,
        toggleVideo,
        toggleScreenShare,
        switchCamera,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => {
  const ctx = useContext(CallContext);
  if (!ctx) throw new Error('useCall must be used within a CallProvider');
  return ctx;
};
