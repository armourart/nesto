import React, { useState, useEffect } from 'react';
import { Story, User } from '../../types';
import { X, Send, Eye } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';

interface StoryViewerModalProps {
  story: Story | null;
  onClose: () => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({ story, onClose }) => {
  const { viewStory, sendMessage, openOrCreateConversationWith } = useChat();
  const { users, currentUser } = useAuth();
  const [progress, setProgress] = useState(0);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    if (!story) return;
    viewStory(story.id);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          onClose();
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [story]);

  if (!story) return null;

  const author = users.find((u) => u.id === story.user_id);
  const isMine = currentUser?.id === story.user_id;

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !author) return;

    const conv = openOrCreateConversationWith(author.id);
    sendMessage(`Replied to story: "${replyText.trim()}"`);
    setReplyText('');
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.94)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 120,
        padding: '16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          height: '85vh',
          maxHeight: '740px',
          borderRadius: '24px',
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: '#0a0a0f',
          boxShadow: '0 0 50px rgba(0, 0, 0, 0.9), 0 0 20px var(--blue-glow)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Progress Bar */}
        <div style={{ position: 'absolute', top: '12px', left: '16px', right: '16px', zIndex: 30 }}>
          <div
            style={{
              width: '100%',
              height: '3px',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: '#ffffff',
                transition: 'width 0.1s linear',
              }}
            />
          </div>

          {/* Header Info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src={author?.profile_image}
                alt={author?.username}
                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <div style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 600 }}>
                  {author?.display_name || 'Nesto User'}
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.72rem' }}>
                  @{author?.username} • Active Story
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(0, 0, 0, 0.5)',
                border: 'none',
                color: '#fff',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Media Background */}
        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={story.media_url}
            alt="Story content"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Caption */}
          {story.caption && (
            <div
              style={{
                position: 'absolute',
                bottom: isMine ? '60px' : '80px',
                left: '20px',
                right: '20px',
                padding: '12px 16px',
                borderRadius: '16px',
                backgroundColor: 'rgba(0, 0, 0, 0.65)',
                backdropFilter: 'blur(10px)',
                color: '#fff',
                fontSize: '0.92rem',
                fontWeight: 500,
                textAlign: 'center',
              }}
            >
              {story.caption}
            </div>
          )}
        </div>

        {/* Footer / Reply / Viewers */}
        <div
          style={{
            padding: '14px 16px',
            backgroundColor: 'rgba(5, 5, 8, 0.95)',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          {isMine ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <Eye size={18} color="var(--blue-cyan)" />
              <span>{story.viewers.length} viewers watched your story</span>
            </div>
          ) : (
            <form onSubmit={handleSendReply} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder={`Reply to @${author?.username}...`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                style={{
                  flex: 1,
                  backgroundColor: 'var(--bg-surface-3)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '999px',
                  padding: '10px 16px',
                  color: '#fff',
                  fontSize: '0.88rem',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--blue-electric)',
                  border: 'none',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Send size={16} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
