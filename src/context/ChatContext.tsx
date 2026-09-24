import React, { createContext, useContext, useState, useEffect } from 'react';
import { Conversation, Message, Story, User } from '../types';
import { storage } from '../services/storage';
import { sounds } from '../services/sounds';
import { useAuth } from './AuthContext';

interface ChatContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  stories: Story[];
  totalUnreadCount: number;
  setActiveConversationId: (id: string | null) => void;
  openOrCreateConversationWith: (userId: string) => Conversation;
  sendMessage: (content: string, type?: 'text' | 'image', mediaUrl?: string) => void;
  setTyping: (isTyping: boolean) => void;
  deleteMessage: (messageId: string, forEveryone: boolean) => void;
  addStory: (mediaUrl: string, caption?: string) => Story;
  viewStory: (storyId: string) => void;
  refreshChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>(() => storage.getConversations());
  const [activeConversationId, setActiveConversationId] = useState<string | null>(() => {
    const list = storage.getConversations();
    return list.length > 0 ? list[0].id : null;
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [stories, setStories] = useState<Story[]>(() => storage.getStories());

  const refreshChat = () => {
    const allConvs = storage.getConversations();
    setConversations(allConvs);
    setStories(storage.getStories());
    if (activeConversationId) {
      setMessages(storage.getMessages(activeConversationId));
    }
  };

  useEffect(() => {
    if (activeConversationId && currentUser) {
      setMessages(storage.getMessages(activeConversationId));
      storage.markConversationRead(activeConversationId, currentUser.id);
    }
  }, [activeConversationId, currentUser]);

  useEffect(() => {
    const unsub = storage.subscribe((event, data) => {
      if (['MESSAGE_SENT', 'CONVERSATION_CREATED', 'CONVERSATION_READ', 'TYPING_CHANGED', 'MESSAGE_DELETED', 'STORY_ADDED'].includes(event)) {
        refreshChat();
        if (event === 'MESSAGE_SENT') {
          const msg = data as Message;
          if (currentUser && msg.receiver_id === currentUser.id) {
            sounds.playMessageReceived();
          }
        }
      }
    });
    return unsub;
  }, [activeConversationId, currentUser]);

  const activeConversation = conversations.find((c) => c.id === activeConversationId) || null;

  // Unread badge count for current user
  const totalUnreadCount = currentUser
    ? conversations.reduce((acc, conv) => acc + (conv.unread_count[currentUser.id] || 0), 0)
    : 0;

  const openOrCreateConversationWith = (partnerUserId: string): Conversation => {
    if (!currentUser) throw new Error('Must be logged in');
    const conv = storage.createOrGetConversation(currentUser.id, partnerUserId);
    setActiveConversationId(conv.id);
    refreshChat();
    return conv;
  };

  const sendMessage = (content: string, type: 'text' | 'image' = 'text', mediaUrl?: string) => {
    if (!currentUser || !activeConversation) return;

    const partnerId = activeConversation.participants.find((p) => p !== currentUser.id);
    if (!partnerId) return;

    sounds.playMessageSent();
    storage.sendMessage({
      conversation_id: activeConversation.id,
      sender_id: currentUser.id,
      receiver_id: partnerId,
      message_type: type,
      content,
      media_url: mediaUrl,
    });

    // Reset typing
    storage.setTyping(activeConversation.id, currentUser.id, false);
    refreshChat();
  };

  const setTyping = (isTyping: boolean) => {
    if (!currentUser || !activeConversation) return;
    storage.setTyping(activeConversation.id, currentUser.id, isTyping);
  };

  const deleteMessage = (messageId: string, forEveryone: boolean) => {
    if (!currentUser) return;
    storage.deleteMessage(messageId, forEveryone, currentUser.id);
    refreshChat();
  };

  const addStory = (mediaUrl: string, caption?: string): Story => {
    if (!currentUser) throw new Error('Must be logged in');
    const story = storage.addStory(currentUser.id, mediaUrl, caption);
    sounds.playBubbleTap();
    refreshChat();
    return story;
  };

  const viewStory = (storyId: string) => {
    if (!currentUser) return;
    storage.viewStory(storyId, currentUser.id);
    refreshChat();
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversation,
        messages,
        stories,
        totalUnreadCount,
        setActiveConversationId,
        openOrCreateConversationWith,
        sendMessage,
        setTyping,
        deleteMessage,
        addStory,
        viewStory,
        refreshChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within a ChatProvider');
  return ctx;
};
