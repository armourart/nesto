export type UserRole = 'OWNER' | 'SUPER_ADMIN' | 'ADMIN' | 'USER';
export type UserStatus = 'online' | 'offline' | 'away' | 'in_call';

export interface User {
  id: string;
  username: string;
  username_normalized: string;
  display_name: string;
  email: string;
  profile_image: string;
  bio?: string;
  role: UserRole;
  status: UserStatus;
  created_at: number;
  last_active_at: number;
  verified?: boolean;
  blocked_users?: string[];
  is_suspended?: boolean;
}

export type MessageType = 'text' | 'image' | 'call_log';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  message_type: MessageType;
  content: string;
  media_url?: string;
  created_at: number;
  delivered_at?: number;
  read_at?: number;
  deleted_for_everyone?: boolean;
  deleted_for?: string[];
  reactions?: Record<string, string>; // emoji -> count or user -> emoji
}

export interface Conversation {
  id: string;
  participants: string[]; // user IDs
  last_message?: Message;
  updated_at: number;
  unread_count: Record<string, number>; // userId -> count
  typing: Record<string, boolean>; // userId -> boolean
}

export type CallType = 'audio' | 'video';
export type CallStatus = 'ringing' | 'connected' | 'ended' | 'rejected' | 'missed';

export interface CallSession {
  id: string;
  caller_id: string;
  receiver_id: string;
  type: CallType;
  status: CallStatus;
  started_at: number;
  connected_at?: number;
  ended_at?: number;
  is_screen_sharing?: boolean;
  caller_audio_muted?: boolean;
  caller_video_disabled?: boolean;
  receiver_audio_muted?: boolean;
  receiver_video_disabled?: boolean;
}

export interface Story {
  id: string;
  user_id: string;
  media_url: string;
  caption?: string;
  created_at: number;
  expires_at: number;
  viewers: string[];
}

export interface NotificationItem {
  id: string;
  user_id: string;
  type: 'message' | 'call' | 'system';
  title: string;
  body: string;
  avatar?: string;
  link_conversation_id?: string;
  created_at: number;
  read: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: number;
  actor_id: string;
  actor_username: string;
  action: string;
  target_id?: string;
  target_username?: string;
  details: string;
  severity: 'info' | 'warn' | 'security' | 'danger';
}

export interface UserSettings {
  privacy: {
    whoCanMessage: 'everyone' | 'contacts';
    whoCanCall: 'everyone' | 'contacts';
    showOnlineStatus: boolean;
    readReceipts: boolean;
  };
  notifications: {
    sounds: boolean;
    inApp: boolean;
    calls: boolean;
  };
  media: {
    preferredCamera?: string;
    preferredMic?: string;
    noiseSuppression: boolean;
  };
}

export interface DiagnosticMetrics {
  micLevel: number; // 0 - 100
  cameraActive: boolean;
  cameraResolution?: string;
  cameraFps?: number;
  screenShareActive: boolean;
  webrtcLatencyMs: number;
  packetLossPercent: number;
}
