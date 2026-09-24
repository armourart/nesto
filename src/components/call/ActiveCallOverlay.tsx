import React, { useEffect, useRef } from 'react';
import { useCall } from '../../context/CallContext';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  ScreenShare, 
  RefreshCw,
  Maximize2,
  Minimize2,
  ShieldCheck
} from 'lucide-react';

export const ActiveCallOverlay: React.FC = () => {
  const {
    activeCall,
    localStream,
    remoteStream,
    isMuted,
    isVideoOff,
    isScreenSharing,
    callDuration,
    micLevel,
    partnerUser,
    endCall,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
    switchCamera,
  } = useCall();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Bind local stream
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Bind remote stream
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  if (!activeCall || activeCall.status !== 'connected') {
    return null;
  }

  const formatDuration = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isVideoCall = activeCall.type === 'video' || isScreenSharing;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#050508',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Top Floating Status Bar */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          right: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 30,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 16px',
            backgroundColor: 'rgba(9, 10, 15, 0.75)',
            backdropFilter: 'blur(16px)',
            borderRadius: '999px',
            border: '1px solid var(--border-subtle)',
            pointerEvents: 'auto',
          }}
        >
          <img
            src={partnerUser?.profile_image}
            alt={partnerUser?.username}
            style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
              {partnerUser?.display_name || 'Nesto User'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              @{partnerUser?.username}
            </div>
          </div>
        </div>

        {/* Call Timer & Security Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 18px',
            backgroundColor: 'rgba(9, 10, 15, 0.75)',
            backdropFilter: 'blur(16px)',
            borderRadius: '999px',
            border: '1px solid var(--border-subtle)',
            pointerEvents: 'auto',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', animation: 'pulse-ring 1.5s infinite' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              {formatDuration(callDuration)}
            </span>
          </div>
          <span style={{ width: '1px', height: '14px', backgroundColor: 'var(--border-subtle)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--blue-cyan)' }}>
            <ShieldCheck size={14} />
            <span>P2P WebRTC Encrypted</span>
          </div>
        </div>
      </div>

      {/* Main Video / Audio Canvas */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at center, #111422 0%, #050508 100%)',
        }}
      >
        {isVideoCall ? (
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {/* Remote Feed */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: isScreenSharing ? 'contain' : 'cover',
                backgroundColor: '#08080c',
              }}
            />

            {/* Local Video PiP Preview */}
            <div
              style={{
                position: 'absolute',
                bottom: '100px',
                right: '24px',
                width: '180px',
                height: '130px',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '2px solid rgba(20, 123, 255, 0.4)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.8), 0 0 15px var(--blue-glow)',
                backgroundColor: '#050505',
                zIndex: 20,
              }}
            >
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: 'scaleX(-1)', // Mirror effect
                }}
              />
              {isVideoOff && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: '#0d0e14',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.75rem',
                  }}
                >
                  Camera off
                </div>
              )}
            </div>
          </div>
        ) : (
          /* High-Tech Audio Wave Visualizer */
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '24px' }}>
              <div
                style={{
                  width: '140px',
                  height: '140px',
                  borderRadius: '50%',
                  background: 'var(--grad-nesto)',
                  padding: '4px',
                  boxShadow: `0 0 ${20 + micLevel * 0.8}px var(--red-glow), 0 0 ${30 + micLevel}px var(--blue-glow)`,
                  transition: 'box-shadow 0.1s ease',
                }}
              >
                <img
                  src={partnerUser?.profile_image}
                  alt={partnerUser?.username}
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              </div>
            </div>

            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '6px' }}>
              {partnerUser?.display_name}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--blue-cyan)', marginBottom: '24px' }}>
              High-Definition Audio Call Connected
            </p>

            {/* Audio Wave Bars */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', height: '36px' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
                const height = Math.max(6, Math.min(36, (micLevel + i * 5) % 36));
                return (
                  <div
                    key={i}
                    style={{
                      width: '4px',
                      height: `${height}px`,
                      backgroundColor: i % 2 === 0 ? 'var(--blue-cyan)' : 'var(--red-electric)',
                      borderRadius: '2px',
                      transition: 'height 0.1s ease',
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Control Bar */}
      <div
        style={{
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          backgroundColor: 'rgba(5, 5, 8, 0.88)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid var(--border-subtle)',
          zIndex: 30,
        }}
      >
        {/* Mic Toggle */}
        <button
          onClick={toggleMute}
          className="btn-icon"
          style={{
            width: '54px',
            height: '54px',
            backgroundColor: isMuted ? 'rgba(255, 23, 68, 0.2)' : 'var(--bg-surface-3)',
            borderColor: isMuted ? 'var(--red-electric)' : 'var(--border-subtle)',
          }}
          title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
        >
          {isMuted ? <MicOff size={22} color="var(--red-electric)" /> : <Mic size={22} />}
        </button>

        {/* Video Toggle */}
        <button
          onClick={toggleVideo}
          className="btn-icon"
          style={{
            width: '54px',
            height: '54px',
            backgroundColor: isVideoOff ? 'rgba(255, 23, 68, 0.2)' : 'var(--bg-surface-3)',
            borderColor: isVideoOff ? 'var(--red-electric)' : 'var(--border-subtle)',
          }}
          title={isVideoOff ? 'Enable Camera' : 'Disable Camera'}
        >
          {isVideoOff ? <VideoOff size={22} color="var(--red-electric)" /> : <Video size={22} />}
        </button>

        {/* Flip Camera */}
        <button
          onClick={switchCamera}
          className="btn-icon"
          style={{ width: '54px', height: '54px' }}
          title="Switch Camera (Front/Rear)"
        >
          <RefreshCw size={20} />
        </button>

        {/* Screen Share */}
        <button
          onClick={toggleScreenShare}
          className="btn-icon"
          style={{
            width: '54px',
            height: '54px',
            backgroundColor: isScreenSharing ? 'rgba(0, 191, 255, 0.25)' : 'var(--bg-surface-3)',
            borderColor: isScreenSharing ? 'var(--blue-cyan)' : 'var(--border-subtle)',
          }}
          title={isScreenSharing ? 'Stop Screen Share' : 'Share Screen'}
        >
          <ScreenShare size={22} color={isScreenSharing ? 'var(--blue-cyan)' : '#fff'} />
        </button>

        {/* End Call Button */}
        <button
          onClick={endCall}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--red-electric)',
            border: 'none',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 0 25px var(--red-glow)',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          title="End Call"
        >
          <PhoneOff size={24} />
        </button>
      </div>
    </div>
  );
};
