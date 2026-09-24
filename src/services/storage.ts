import { User, Message, Conversation, CallSession, Story, AuditLog, NotificationItem, UserSettings } from '../types';

const STORAGE_KEYS = {
  CURRENT_USER: 'nesto_current_user',
  USERS: 'nesto_users',
  CONVERSATIONS: 'nesto_conversations',
  MESSAGES: 'nesto_messages',
  STORIES: 'nesto_stories',
  NOTIFICATIONS: 'nesto_notifications',
  AUDIT_LOGS: 'nesto_audit_logs',
  SETTINGS: 'nesto_settings',
  ACTIVE_CALL: 'nesto_active_call',
};

export const RESERVED_USERNAMES = [
  '4xwiiiin',
  'admin',
  'administrator',
  'owner',
  'nesto',
  'support',
  'root',
  'system',
];

const INITIAL_USERS: User[] = [
  {
    id: 'user_owner_4xwiiiin',
    username: '4xwiiiin',
    username_normalized: '4xwiiiin',
    display_name: '4xwiiiin (Owner)',
    email: 'creator.nesto@gmail.com',
    profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    bio: 'Founder & Architect of Nesto. Building next-generation real-time social tech.',
    role: 'OWNER',
    status: 'online',
    created_at: Date.now() - 1000 * 60 * 60 * 24 * 90,
    last_active_at: Date.now(),
    verified: true,
  },
  {
    id: 'user_elena_v',
    username: 'elena_v',
    username_normalized: 'elena_v',
    display_name: 'Elena Vance',
    email: 'elena.vance.ui@gmail.com',
    profile_image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    bio: 'Creative director & aesthetic dreamer ✨ Designing high-frequency interfaces.',
    role: 'USER',
    status: 'online',
    created_at: Date.now() - 1000 * 60 * 60 * 24 * 30,
    last_active_at: Date.now() - 1000 * 60 * 2,
    verified: true,
  },
  {
    id: 'user_cyber_marcus',
    username: 'cyber_marcus',
    username_normalized: 'cyber_marcus',
    display_name: 'Marcus Chen',
    email: 'marcus.chen.dev@gmail.com',
    profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    bio: 'WebRTC, WebGPU & low latency systems. Let us build the future of voice & video.',
    role: 'USER',
    status: 'online',
    created_at: Date.now() - 1000 * 60 * 60 * 24 * 45,
    last_active_at: Date.now(),
    verified: false,
  },
  {
    id: 'user_maya_sol',
    username: 'maya_sol',
    username_normalized: 'maya_sol',
    display_name: 'Maya Rodriguez',
    email: 'maya.rodriguez.photo@gmail.com',
    profile_image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    bio: 'Visual artist & travel photographer 📷 Neon shadows and vibrant stories.',
    role: 'USER',
    status: 'away',
    created_at: Date.now() - 1000 * 60 * 60 * 24 * 20,
    last_active_at: Date.now() - 1000 * 60 * 25,
    verified: true,
  },
  {
    id: 'user_alex_zero',
    username: 'alex_zero',
    username_normalized: 'alex_zero',
    display_name: 'Alex Mercer',
    email: 'alex.mercer.sound@gmail.com',
    profile_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    bio: 'Electronic music producer & synth explorer ⚡ Dropping ambient frequencies.',
    role: 'USER',
    status: 'offline',
    created_at: Date.now() - 1000 * 60 * 60 * 24 * 15,
    last_active_at: Date.now() - 1000 * 60 * 60 * 4,
    verified: false,
  }
];

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_elena_owner',
    participants: ['user_owner_4xwiiiin', 'user_elena_v'],
    updated_at: Date.now() - 1000 * 60 * 12,
    unread_count: { user_owner_4xwiiiin: 1, user_elena_v: 0 },
    typing: {},
  },
  {
    id: 'conv_marcus_owner',
    participants: ['user_owner_4xwiiiin', 'user_cyber_marcus'],
    updated_at: Date.now() - 1000 * 60 * 35,
    unread_count: { user_owner_4xwiiiin: 0, user_cyber_marcus: 0 },
    typing: {},
  },
  {
    id: 'conv_maya_owner',
    participants: ['user_owner_4xwiiiin', 'user_maya_sol'],
    updated_at: Date.now() - 1000 * 60 * 120,
    unread_count: { user_owner_4xwiiiin: 0, user_maya_sol: 0 },
    typing: {},
  }
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg_1',
    conversation_id: 'conv_elena_owner',
    sender_id: 'user_elena_v',
    receiver_id: 'user_owner_4xwiiiin',
    message_type: 'text',
    content: 'Hey! The new deep crimson and electric blue interface for Nesto looks absolutely stellar 🔥',
    created_at: Date.now() - 1000 * 60 * 45,
    delivered_at: Date.now() - 1000 * 60 * 44,
    read_at: Date.now() - 1000 * 60 * 40,
    reactions: { '🔥': '2', '⚡': '1' }
  },
  {
    id: 'msg_2',
    conversation_id: 'conv_elena_owner',
    sender_id: 'user_owner_4xwiiiin',
    receiver_id: 'user_elena_v',
    message_type: 'text',
    content: 'Thank you Elena! Tested the WebRTC audio & video pipeline with screen sharing—crystal clear 60fps latency.',
    created_at: Date.now() - 1000 * 60 * 30,
    delivered_at: Date.now() - 1000 * 60 * 29,
    read_at: Date.now() - 1000 * 60 * 25,
  },
  {
    id: 'msg_3',
    conversation_id: 'conv_elena_owner',
    sender_id: 'user_elena_v',
    receiver_id: 'user_owner_4xwiiiin',
    message_type: 'text',
    content: 'Check out the new design banner mockups I just exported for our landing moments:',
    created_at: Date.now() - 1000 * 60 * 15,
    delivered_at: Date.now() - 1000 * 60 * 14,
    read_at: Date.now() - 1000 * 60 * 13,
  },
  {
    id: 'msg_4',
    conversation_id: 'conv_elena_owner',
    sender_id: 'user_elena_v',
    receiver_id: 'user_owner_4xwiiiin',
    message_type: 'image',
    content: 'High-frequency gradient design concept',
    media_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    created_at: Date.now() - 1000 * 60 * 12,
    delivered_at: Date.now() - 1000 * 60 * 11,
  },
  {
    id: 'msg_5',
    conversation_id: 'conv_marcus_owner',
    sender_id: 'user_cyber_marcus',
    receiver_id: 'user_owner_4xwiiiin',
    message_type: 'text',
    content: 'All STUN and TURN fallback relays are verified and responsive. Ready for peer connection calls!',
    created_at: Date.now() - 1000 * 60 * 35,
    delivered_at: Date.now() - 1000 * 60 * 34,
    read_at: Date.now() - 1000 * 60 * 30,
  }
];

const INITIAL_STORIES: Story[] = [
  {
    id: 'story_elena_1',
    user_id: 'user_elena_v',
    media_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    caption: 'Neon night coding session 💻⚡',
    created_at: Date.now() - 1000 * 60 * 180,
    expires_at: Date.now() + 1000 * 60 * 60 * 20,
    viewers: ['user_owner_4xwiiiin']
  },
  {
    id: 'story_maya_1',
    user_id: 'user_maya_sol',
    media_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    caption: 'Sunset frequencies in Tokyo 🌆',
    created_at: Date.now() - 1000 * 60 * 240,
    expires_at: Date.now() + 1000 * 60 * 60 * 18,
    viewers: []
  },
  {
    id: 'story_marcus_1',
    user_id: 'user_cyber_marcus',
    media_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    caption: 'Building real-time WebRTC matrix',
    created_at: Date.now() - 1000 * 60 * 60,
    expires_at: Date.now() + 1000 * 60 * 60 * 23,
    viewers: ['user_owner_4xwiiiin']
  }
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit_init_1',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3,
    actor_id: 'user_owner_4xwiiiin',
    actor_username: '4xwiiiin',
    action: 'SYSTEM_BOOTSTRAP',
    details: 'Nesto Core Security & Architecture deployed with OWNER privilege lock.',
    severity: 'security'
  },
  {
    id: 'audit_init_2',
    timestamp: Date.now() - 1000 * 60 * 60 * 12,
    actor_id: 'user_owner_4xwiiiin',
    actor_username: '4xwiiiin',
    action: 'POLICY_VERIFY',
    details: 'Username reservation for 4xwiiiin enforced with case-insensitive collision defense.',
    severity: 'info'
  }
];

class StorageService {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<(event: string, data?: unknown) => void> = new Set();

  constructor() {
    this.initStorage();
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel('nesto_realtime_sync');
      this.channel.onmessage = (e) => {
        const { event, data } = e.data || {};
        this.notifyListeners(event, data, false);
      };
    }
  }

  private initStorage() {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CONVERSATIONS)) {
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(INITIAL_CONVERSATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(INITIAL_MESSAGES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.STORIES)) {
      localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(INITIAL_STORIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      // Default to owner on first launch so user experiences full platform capabilities
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
    }
  }

  subscribe(listener: (event: string, data?: unknown) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(event: string, data?: unknown, broadcast = true) {
    this.listeners.forEach((fn) => fn(event, data));
    if (broadcast && this.channel) {
      try {
        this.channel.postMessage({ event, data });
      } catch {
        // Cross-window channel error
      }
    }
  }

  // --- Users ---
  getUsers(): User[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  }

  getUserById(id: string): User | undefined {
    return this.getUsers().find((u) => u.id === id);
  }

  getUserByUsername(username: string): User | undefined {
    const normalized = username.trim().toLowerCase();
    return this.getUsers().find((u) => u.username_normalized === normalized);
  }

  saveUser(user: User): void {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // If updating current user, sync it
    const current = this.getCurrentUser();
    if (current && current.id === user.id) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }
    this.notifyListeners('USER_UPDATED', user);
  }

  getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
    this.notifyListeners('CURRENT_USER_CHANGED', user);
  }

  // Username validation
  isUsernameReserved(username: string): boolean {
    const normalized = username.trim().toLowerCase();
    return RESERVED_USERNAMES.includes(normalized);
  }

  isUsernameTaken(username: string, excludeUserId?: string): boolean {
    const normalized = username.trim().toLowerCase();
    const users = this.getUsers();
    return users.some((u) => u.username_normalized === normalized && u.id !== excludeUserId);
  }

  validateUsername(username: string, excludeUserId?: string): { valid: boolean; error?: string } {
    const trimmed = username.trim();
    if (!trimmed) {
      return { valid: false, error: 'Username cannot be empty.' };
    }
    if (trimmed.length < 3) {
      return { valid: false, error: 'Username must be at least 3 characters long.' };
    }
    if (trimmed.length > 20) {
      return { valid: false, error: 'Username cannot exceed 20 characters.' };
    }
    if (!/^[a-zA-Z0-9_.]+$/.test(trimmed)) {
      return { valid: false, error: 'Usernames can only contain letters, numbers, periods, and underscores.' };
    }
    const normalized = trimmed.toLowerCase();
    if (this.isUsernameReserved(normalized)) {
      // If the current user is the owner setting 4xwiiiin, allow
      if (normalized === '4xwiiiin') {
        const current = this.getCurrentUser();
        if (current && current.role === 'OWNER') {
          return { valid: true };
        }
      }
      return { valid: false, error: 'This username is reserved. Please choose another username.' };
    }
    if (this.isUsernameTaken(normalized, excludeUserId)) {
      return { valid: false, error: 'Username already taken.' };
    }
    return { valid: true };
  }

  // --- Conversations & Messages ---
  getConversations(): Conversation[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  getMessages(conversationId?: string): Message[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      const messages: Message[] = data ? JSON.parse(data) : [];
      if (conversationId) {
        return messages.filter((m) => m.conversation_id === conversationId && !m.deleted_for_everyone);
      }
      return messages;
    } catch {
      return [];
    }
  }

  createOrGetConversation(userAId: string, userBId: string): Conversation {
    const convs = this.getConversations();
    let conv = convs.find(
      (c) => c.participants.includes(userAId) && c.participants.includes(userBId) && c.participants.length === 2
    );
    if (!conv) {
      conv = {
        id: `conv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        participants: [userAId, userBId],
        updated_at: Date.now(),
        unread_count: { [userAId]: 0, [userBId]: 0 },
        typing: {},
      };
      convs.unshift(conv);
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(convs));
      this.notifyListeners('CONVERSATION_CREATED', conv);
    }
    return conv;
  }

  sendMessage(message: Omit<Message, 'id' | 'created_at' | 'delivered_at'>): Message {
    const newMsg: Message = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      created_at: Date.now(),
      delivered_at: Date.now(),
    };

    const messages = this.getMessages();
    messages.push(newMsg);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));

    // Update conversation
    const convs = this.getConversations();
    const cIdx = convs.findIndex((c) => c.id === message.conversation_id);
    if (cIdx >= 0) {
      convs[cIdx].last_message = newMsg;
      convs[cIdx].updated_at = newMsg.created_at;
      const receiverUnread = (convs[cIdx].unread_count[message.receiver_id] || 0) + 1;
      convs[cIdx].unread_count[message.receiver_id] = receiverUnread;
      // Move to top
      const [target] = convs.splice(cIdx, 1);
      convs.unshift(target);
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(convs));
    }

    this.notifyListeners('MESSAGE_SENT', newMsg);
    return newMsg;
  }

  markConversationRead(conversationId: string, readerUserId: string): void {
    const convs = this.getConversations();
    const cIdx = convs.findIndex((c) => c.id === conversationId);
    let changed = false;
    if (cIdx >= 0 && convs[cIdx].unread_count[readerUserId] > 0) {
      convs[cIdx].unread_count[readerUserId] = 0;
      changed = true;
    }

    const messages = this.getMessages();
    messages.forEach((m) => {
      if (m.conversation_id === conversationId && m.receiver_id === readerUserId && !m.read_at) {
        m.read_at = Date.now();
        changed = true;
      }
    });

    if (changed) {
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(convs));
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
      this.notifyListeners('CONVERSATION_READ', { conversationId, readerUserId });
    }
  }

  setTyping(conversationId: string, userId: string, isTyping: boolean): void {
    const convs = this.getConversations();
    const c = convs.find((item) => item.id === conversationId);
    if (c) {
      c.typing = c.typing || {};
      c.typing[userId] = isTyping;
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(convs));
      this.notifyListeners('TYPING_CHANGED', { conversationId, userId, isTyping });
    }
  }

  deleteMessage(messageId: string, forEveryone: boolean, userId: string): void {
    const messages = this.getMessages();
    const msg = messages.find((m) => m.id === messageId);
    if (msg) {
      if (forEveryone) {
        msg.deleted_for_everyone = true;
      } else {
        msg.deleted_for = msg.deleted_for || [];
        if (!msg.deleted_for.includes(userId)) {
          msg.deleted_for.push(userId);
        }
      }
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
      this.notifyListeners('MESSAGE_DELETED', { messageId, forEveryone });
    }
  }

  // --- Stories ---
  getStories(): Story[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STORIES);
      const stories: Story[] = data ? JSON.parse(data) : [];
      const now = Date.now();
      return stories.filter((s) => s.expires_at > now);
    } catch {
      return [];
    }
  }

  addStory(userId: string, mediaUrl: string, caption?: string): Story {
    const newStory: Story = {
      id: `story_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      user_id: userId,
      media_url: mediaUrl,
      caption,
      created_at: Date.now(),
      expires_at: Date.now() + 1000 * 60 * 60 * 24, // 24h
      viewers: [],
    };
    const stories = this.getStories();
    stories.unshift(newStory);
    localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(stories));
    this.notifyListeners('STORY_ADDED', newStory);
    return newStory;
  }

  viewStory(storyId: string, viewerUserId: string): void {
    const stories = this.getStories();
    const story = stories.find((s) => s.id === storyId);
    if (story && !story.viewers.includes(viewerUserId)) {
      story.viewers.push(viewerUserId);
      localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(stories));
      this.notifyListeners('STORY_VIEWED', { storyId, viewerUserId });
    }
  }

  // --- WebRTC / Calling Sessions ---
  getActiveCall(): CallSession | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_CALL);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  setActiveCall(call: CallSession | null): void {
    if (call) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_CALL, JSON.stringify(call));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_CALL);
    }
    this.notifyListeners('CALL_STATE_CHANGED', call);
  }

  // --- Audit Logs (Owner only) ---
  getAuditLogs(): AuditLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  logAuditEvent(actor: User, action: string, details: string, severity: AuditLog['severity'] = 'info', target?: User): void {
    const newLog: AuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: Date.now(),
      actor_id: actor.id,
      actor_username: actor.username,
      action,
      target_id: target?.id,
      target_username: target?.username,
      details,
      severity,
    };
    const logs = this.getAuditLogs();
    logs.unshift(newLog);
    // Keep last 150
    if (logs.length > 150) logs.pop();
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
    this.notifyListeners('AUDIT_LOG_ADDED', newLog);
  }

  // --- Notifications ---
  getNotifications(userId: string): NotificationItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const items: NotificationItem[] = data ? JSON.parse(data) : [];
      return items.filter((n) => n.user_id === userId);
    } catch {
      return [];
    }
  }

  addNotification(item: Omit<NotificationItem, 'id' | 'created_at' | 'read'>): void {
    const newItem: NotificationItem = {
      ...item,
      id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      created_at: Date.now(),
      read: false,
    };
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const items: NotificationItem[] = data ? JSON.parse(data) : [];
      items.unshift(newItem);
      if (items.length > 50) items.pop();
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(items));
      this.notifyListeners('NOTIFICATION_ADDED', newItem);
    } catch {
      //
    }
  }

  markNotificationsRead(userId: string): void {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const items: NotificationItem[] = data ? JSON.parse(data) : [];
      items.forEach((n) => {
        if (n.user_id === userId) n.read = true;
      });
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(items));
      this.notifyListeners('NOTIFICATIONS_READ', userId);
    } catch {
      //
    }
  }

  // --- User Settings ---
  getUserSettings(userId: string): UserSettings {
    const defaultSettings: UserSettings = {
      privacy: {
        whoCanMessage: 'everyone',
        whoCanCall: 'everyone',
        showOnlineStatus: true,
        readReceipts: true,
      },
      notifications: {
        sounds: true,
        inApp: true,
        calls: true,
      },
      media: {
        noiseSuppression: true,
      },
    };
    try {
      const data = localStorage.getItem(`${STORAGE_KEYS.SETTINGS}_${userId}`);
      return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  }

  saveUserSettings(userId: string, settings: UserSettings): void {
    localStorage.setItem(`${STORAGE_KEYS.SETTINGS}_${userId}`, JSON.stringify(settings));
    this.notifyListeners('SETTINGS_SAVED', { userId, settings });
  }
}

export const storage = new StorageService();
