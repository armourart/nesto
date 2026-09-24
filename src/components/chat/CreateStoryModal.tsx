import React, { useState } from 'react';
import { X, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateStoryModal: React.FC<CreateStoryModalProps> = ({ isOpen, onClose }) => {
  const { addStory } = useChat();
  const [mediaUrl, setMediaUrl] = useState('');
  const [caption, setCaption] = useState('');

  if (!isOpen) return null;

  const PRESET_STORIES = [
    {
      title: 'Neon Tokyo Matrix',
      url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Cyberpunk Skyline',
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Deep Synth Wave',
      url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Sunset Pulse',
      url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&auto=format&fit=crop&q=80',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = mediaUrl || PRESET_STORIES[0].url;
    addStory(finalUrl, caption.trim() || undefined);
    setMediaUrl('');
    setCaption('');
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 5, 8, 0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 130,
        padding: '20px',
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '28px',
          boxShadow: 'var(--shadow-modal), 0 0 35px var(--red-glow)',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="var(--red-electric)" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Share a Nesto Moment</h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Preset image selector */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              Choose a Photo or Paste Image URL
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '12px' }}>
              {PRESET_STORIES.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => setMediaUrl(preset.url)}
                  style={{
                    height: '70px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: (mediaUrl === preset.url || (!mediaUrl && idx === 0))
                      ? '2px solid var(--blue-cyan)'
                      : '1px solid var(--border-subtle)',
                    position: 'relative',
                  }}
                >
                  <img
                    src={preset.url}
                    alt={preset.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ImageIcon size={18} color="var(--text-muted)" />
              <input
                type="url"
                placeholder="Or paste external image URL..."
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  backgroundColor: 'var(--bg-surface-3)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '22px' }}>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Caption
            </label>
            <input
              type="text"
              placeholder="What's happening right now? ⚡"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                backgroundColor: 'var(--bg-surface-3)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Publish to Nesto Stories (24h)
          </button>
        </form>
      </div>
    </div>
  );
};
