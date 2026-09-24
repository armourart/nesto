import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { useCall } from '../../context/CallContext';
import { Search, X, MessageSquare, Phone, Video, CheckCircle } from 'lucide-react';
import { User } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenConversation: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onOpenConversation }) => {
  const { users, currentUser } = useAuth();
  const { openOrCreateConversationWith } = useChat();
  const { startCall } = useCall();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const filteredUsers = users.filter((u) => {
    if (u.id === currentUser?.id) return false;
    const q = query.toLowerCase().trim();
    if (!q) return true; // show all suggested users
    return (
      u.username.toLowerCase().includes(q) ||
      u.display_name.toLowerCase().includes(q)
    );
  });

  const handleStartChat = (user: User) => {
    openOrCreateConversationWith(user.id);
    onOpenConversation();
    onClose();
  };

  const handleStartCall = (user: User, type: 'audio' | 'video') => {
    startCall(user.id, type);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 5, 8, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        zIndex: 140,
        padding: '80px 20px 20px',
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '540px',
          maxHeight: '75vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-modal), 0 0 35px var(--blue-glow)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <Search size={20} color="var(--blue-cyan)" />
          <input
            type="text"
            placeholder="Search Nesto members by name or @handle..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '1rem',
              outline: 'none',
              fontWeight: 500,
            }}
          />
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Results List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {filteredUsers.length === 0 ? (
            <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No Nesto members found matching "{query}"
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div
                  onClick={() => handleStartChat(user)}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flex: 1 }}
                >
                  <div style={{ position: 'relative' }}>
                    <img
                      src={user.profile_image}
                      alt={user.username}
                      style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <span
                      className={`status-dot-${user.status}`}
                      style={{ position: 'absolute', bottom: 1, right: 1 }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff' }}>
                        {user.display_name}
                      </span>
                      {user.verified && <CheckCircle size={14} color="var(--blue-cyan)" />}
                      {user.role === 'OWNER' && (
                        <span
                          style={{
                            fontSize: '0.62rem',
                            fontWeight: 700,
                            padding: '1px 5px',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(255, 23, 68, 0.25)',
                            color: 'var(--red-electric)',
                          }}
                        >
                          OWNER
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>@{user.username}</span>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => handleStartChat(user)}
                    className="btn-icon"
                    title="Send Message"
                    style={{ width: '36px', height: '36px' }}
                  >
                    <MessageSquare size={16} />
                  </button>

                  <button
                    onClick={() => handleStartCall(user, 'audio')}
                    className="btn-icon"
                    title="Audio Call"
                    style={{ width: '36px', height: '36px' }}
                  >
                    <Phone size={16} />
                  </button>

                  <button
                    onClick={() => handleStartCall(user, 'video')}
                    className="btn-icon"
                    title="Video Call"
                    style={{ width: '36px', height: '36px', backgroundColor: 'rgba(20, 123, 255, 0.15)', borderColor: 'var(--border-focus)' }}
                  >
                    <Video size={16} color="var(--blue-cyan)" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
