import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { useCall } from '../../context/CallContext';
import { StoryReel } from '../chat/StoryReel';
import { Sparkles, MessageSquare, Phone, ShieldCheck, Flame, Compass } from 'lucide-react';
import { Story } from '../../types';

interface HomeViewProps {
  onSelectStory: (story: Story) => void;
  onOpenCreateStory: () => void;
  onOpenChat: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onSelectStory, onOpenCreateStory, onOpenChat }) => {
  const { currentUser, users } = useAuth();
  const { openOrCreateConversationWith } = useChat();
  const { startCall } = useCall();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const onlineFriends = users.filter((u) => u.id !== currentUser?.id && u.status === 'online');

  const HIGHLIGHT_POSTS = [
    {
      id: 'post_1',
      author: 'Elena Vance',
      author_role: 'Product Designer',
      author_img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
      media: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      caption: 'Exploring high-contrast neon palettes and responsive P2P communication nodes. What do you think of Nesto’s dark aesthetic?',
      likes: '42',
      time: '1 hour ago',
    },
    {
      id: 'post_2',
      author: 'Marcus Chen',
      author_role: 'Web3 & Systems Engineer',
      author_img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      media: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      caption: 'Benchmarked the WebRTC audio & video peer connection. Latency under 15ms with full 60fps screen sharing.',
      likes: '89',
      time: '3 hours ago',
    }
  ];

  return (
    <div
      style={{
        flex: 1,
        height: '100%',
        backgroundColor: 'var(--bg-black)',
        overflowY: 'auto',
        padding: '24px',
      }}
    >
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        {/* Top Header Greeting */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--blue-cyan)', fontSize: '0.84rem', fontWeight: 600, marginBottom: '4px' }}>
            <Sparkles size={16} />
            <span>Nesto Social Core</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
            {getGreeting()},{' '}
            <span className="text-nesto-gradient">
              {currentUser?.display_name || 'Nesto User'}
            </span>
          </h1>
        </div>

        {/* Stories Reel */}
        <div className="glass-card" style={{ padding: '6px', marginBottom: '24px', overflow: 'hidden' }}>
          <StoryReel onSelectStory={onSelectStory} onOpenCreateStory={onOpenCreateStory} />
        </div>

        {/* Online Now Horizontal Scroller */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              Active Online Contacts
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{onlineFriends.length} available</span>
          </div>

          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '6px' }}>
            {onlineFriends.map((friend) => (
              <div
                key={friend.id}
                onClick={() => {
                  openOrCreateConversationWith(friend.id);
                  onOpenChat();
                }}
                className="glass-card"
                style={{
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  minWidth: '170px',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <div style={{ position: 'relative' }}>
                  <img
                    src={friend.profile_image}
                    alt={friend.username}
                    style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span
                    className="status-dot-online"
                    style={{ position: 'absolute', bottom: 0, right: 0 }}
                  />
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {friend.display_name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>@{friend.username}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Highlight Moments Feed */}
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Flame size={18} color="var(--red-electric)" />
          <span>Explore Moments & Creative Feed</span>
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {HIGHLIGHT_POSTS.map((post) => (
            <div key={post.id} className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={post.author_img}
                    alt={post.author}
                    style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff' }}>{post.author}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {post.author_role} • {post.time}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const authorUser = users.find((u) => u.display_name === post.author);
                    if (authorUser) {
                      openOrCreateConversationWith(authorUser.id);
                      onOpenChat();
                    }
                  }}
                  className="btn-secondary"
                  style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                >
                  <MessageSquare size={14} />
                  <span>Chat</span>
                </button>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                {post.caption}
              </p>

              <div style={{ borderRadius: '16px', overflow: 'hidden', maxHeight: '360px', marginBottom: '14px' }}>
                <img
                  src={post.media}
                  alt="Moment highlight"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                <span>🔥 {post.likes} reactions</span>
                <span style={{ color: 'var(--blue-cyan)', fontWeight: 600 }}>Nesto Verified Feed</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
