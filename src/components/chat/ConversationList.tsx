import React, { useState } from 'react';
import { Conversation, User } from '../../types';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { StoryReel } from './StoryReel';
import { Search, Check, CheckCheck, Plus } from 'lucide-react';

interface ConversationListProps {
  onSelectStory: (story: any) => void;
  onOpenCreateStory: () => void;
  onOpenNewChat: () => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  onSelectStory,
  onOpenCreateStory,
  onOpenNewChat,
}) => {
  const { conversations, activeConversation, setActiveConversationId } = useChat();
  const { currentUser, users } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter((conv) => {
    if (!currentUser) return false;
    const partnerId = conv.participants.find((p) => p !== currentUser.id);
    const partner = users.find((u) => u.id === partnerId);
    if (!partner) return false;
    const q = searchQuery.toLowerCase();
    return (
      partner.display_name.toLowerCase().includes(q) ||
      partner.username.toLowerCase().includes(q) ||
      (conv.last_message && conv.last_message.content.toLowerCase().includes(q))
    );
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--bg-surface-1)',
        borderRight: '1px solid var(--border-subtle)',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
          Messages
        </h2>
        <button
          onClick={onOpenNewChat}
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: 'rgba(20, 123, 255, 0.15)',
            border: '1px solid var(--border-focus)',
            color: 'var(--blue-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          title="New Direct Message"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Stories Carousel */}
      <StoryReel onSelectStory={onSelectStory} onOpenCreateStory={onOpenCreateStory} />

      {/* Search Input */}
      <div style={{ padding: '12px 16px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--bg-surface-2)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '8px 12px',
          }}
        >
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '0.86rem',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Conversations Scroll Area */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filteredConversations.length === 0 ? (
          <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            No conversations found. Start a new chat above!
          </div>
        ) : (
          filteredConversations.map((conv) => {
            if (!currentUser) return null;
            const partnerId = conv.participants.find((p) => p !== currentUser.id);
            const partner = users.find((u) => u.id === partnerId);
            if (!partner) return null;

            const isSelected = activeConversation?.id === conv.id;
            const unreadCount = conv.unread_count[currentUser.id] || 0;
            const isTyping = partnerId ? Boolean(conv.typing && conv.typing[partnerId]) : false;
            const isSender = conv.last_message?.sender_id === currentUser.id;

            // Formatted time
            const lastTime = conv.last_message
              ? new Date(conv.last_message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : '';

            return (
              <div
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? 'rgba(20, 123, 255, 0.12)' : 'transparent',
                  borderLeft: isSelected ? '3px solid var(--blue-electric)' : '3px solid transparent',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {/* Avatar with status */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img
                    src={partner.profile_image}
                    alt={partner.display_name}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span
                    className={`status-dot-${partner.status}`}
                    style={{ position: 'absolute', bottom: 1, right: 1 }}
                  />
                </div>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', overflow: 'hidden' }}>
                      <span
                        style={{
                          fontSize: '0.9rem',
                          fontWeight: unreadCount > 0 ? 700 : 600,
                          color: '#fff',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                        }}
                      >
                        {partner.display_name}
                      </span>
                      {partner.role === 'OWNER' && (
                        <span
                          style={{
                            fontSize: '0.6rem',
                            fontWeight: 700,
                            padding: '1px 4px',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(255, 23, 68, 0.25)',
                            color: 'var(--red-electric)',
                          }}
                        >
                          OWNER
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: unreadCount > 0 ? 'var(--blue-cyan)' : 'var(--text-muted)' }}>
                      {lastTime}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: isTyping ? 'var(--blue-cyan)' : unreadCount > 0 ? 'var(--text-primary)' : 'var(--text-muted)',
                        fontWeight: unreadCount > 0 ? 600 : 400,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {isSender && conv.last_message && (
                        <span>
                          {conv.last_message.read_at ? (
                            <CheckCheck size={14} color="var(--blue-cyan)" />
                          ) : (
                            <Check size={14} color="var(--text-muted)" />
                          )}
                        </span>
                      )}

                      {isTyping ? (
                        <span style={{ fontStyle: 'italic', fontWeight: 600 }}>typing...</span>
                      ) : (
                        <span>
                          {conv.last_message
                            ? conv.last_message.message_type === 'image'
                              ? '📷 Photo'
                              : conv.last_message.content
                            : 'Started conversation'}
                        </span>
                      )}
                    </div>

                    {unreadCount > 0 && (
                      <span
                        style={{
                          backgroundColor: 'var(--blue-electric)',
                          color: '#fff',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          minWidth: '18px',
                          height: '18px',
                          borderRadius: '9px',
                          padding: '0 5px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 0 10px var(--blue-glow)',
                          flexShrink: 0,
                        }}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
