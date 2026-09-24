import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { Story } from '../../types';

interface StoryReelProps {
  onSelectStory: (story: Story) => void;
  onOpenCreateStory: () => void;
}

export const StoryReel: React.FC<StoryReelProps> = ({ onSelectStory, onOpenCreateStory }) => {
  const { stories } = useChat();
  const { currentUser, users } = useAuth();

  // Find user's own active story
  const myStory = currentUser ? stories.find((s) => s.user_id === currentUser.id) : null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '12px 16px',
        overflowX: 'auto',
        borderBottom: '1px solid var(--border-subtle)',
        backgroundColor: 'rgba(9, 10, 15, 0.6)',
      }}
    >
      {/* Current User Story / Add Story */}
      <div
        onClick={() => {
          if (myStory) {
            onSelectStory(myStory);
          } else {
            onOpenCreateStory();
          }
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <div style={{ position: 'relative' }}>
          <div className={`avatar-ring ${myStory ? '' : 'avatar-ring-viewed'}`}>
            <img
              src={currentUser?.profile_image}
              alt="My Story"
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--bg-surface-1)',
              }}
            />
          </div>
          {!myStory && (
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: 'var(--red-electric)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--bg-surface-1)',
                boxShadow: '0 0 10px var(--red-glow)',
              }}
            >
              <Plus size={13} strokeWidth={3} />
            </div>
          )}
        </div>
        <span
          style={{
            fontSize: '0.72rem',
            color: 'var(--text-secondary)',
            maxWidth: '64px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {myStory ? 'Your story' : 'Add story'}
        </span>
      </div>

      {/* Friends Stories */}
      {stories
        .filter((s) => s.user_id !== currentUser?.id)
        .map((story) => {
          const author = users.find((u) => u.id === story.user_id);
          const hasViewed = currentUser ? story.viewers.includes(currentUser.id) : false;

          return (
            <div
              key={story.id}
              onClick={() => onSelectStory(story)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <div className={`avatar-ring ${hasViewed ? 'avatar-ring-viewed' : ''}`}>
                <img
                  src={author?.profile_image || story.media_url}
                  alt={author?.username || 'Story'}
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid var(--bg-surface-1)',
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: '0.72rem',
                  color: hasViewed ? 'var(--text-muted)' : 'var(--text-primary)',
                  fontWeight: hasViewed ? 400 : 600,
                  maxWidth: '64px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {author?.username || 'user'}
              </span>
            </div>
          );
        })}
    </div>
  );
};
