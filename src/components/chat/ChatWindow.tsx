import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { useCall } from '../../context/CallContext';
import { 
  Phone, 
  Video, 
  Send, 
  Smile, 
  Image as ImageIcon, 
  Trash2, 
  Check, 
  CheckCheck,
  ChevronLeft,
  Info,
  Sparkles
} from 'lucide-react';

interface ChatWindowProps {
  onBackMobile?: () => void;
  onOpenPartnerProfile?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ onBackMobile, onOpenPartnerProfile }) => {
  const { activeConversation, messages, sendMessage, setTyping, deleteMessage } = useChat();
  const { currentUser, users } = useAuth();
  const { startCall } = useCall();

  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [activeMediaPreview, setActiveMediaPreview] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!activeConversation || !currentUser) {
    return (
      <div
        style={{
          flex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-black)',
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '24px',
            background: 'var(--grad-nesto)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 35px var(--red-glow)',
            marginBottom: '20px',
          }}
        >
          <Sparkles size={40} color="#fff" />
        </div>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>
          Select a Conversation
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '360px' }}>
          Choose a chat from the left or search users to start real-time messaging, audio, and video calling.
        </p>
      </div>
    );
  }

  const partnerId = activeConversation.participants.find((p) => p !== currentUser.id);
  const partner = users.find((u) => u.id === partnerId);
  const isPartnerTyping = partnerId ? activeConversation.typing[partnerId] : false;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    setTyping(true);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = window.setTimeout(() => {
      setTyping(false);
    }, 1500);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage(inputText.trim(), 'text');
    setInputText('');
    setTyping(false);
    setShowEmojiPicker(false);
  };

  const handleSendPresetImage = (url: string) => {
    sendMessage('Shared a photo', 'image', url);
    setShowImagePicker(false);
  };

  const POPULAR_EMOJIS = ['🔥', '⚡', '❤️', '😂', '👍', '✨', '🚀', '💯', '👏', '😍', '👀', '🎉'];

  const SAMPLE_PHOTOS = [
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop&q=80',
  ];

  return (
    <div
      style={{
        flex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-black)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 18px',
          backgroundColor: 'rgba(9, 10, 15, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-subtle)',
          zIndex: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {onBackMobile && (
            <button
              onClick={onBackMobile}
              className="mobile-only"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <ChevronLeft size={24} />
            </button>
          )}

          <div
            onClick={onOpenPartnerProfile}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <div style={{ position: 'relative' }}>
              <img
                src={partner?.profile_image}
                alt={partner?.display_name}
                style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <span
                className={`status-dot-${partner?.status || 'offline'}`}
                style={{ position: 'absolute', bottom: 1, right: 1 }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.94rem', fontWeight: 700, color: '#fff' }}>
                  {partner?.display_name || 'Nesto User'}
                </span>
                {partner?.role === 'OWNER' && (
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
              <span style={{ fontSize: '0.74rem', color: isPartnerTyping ? 'var(--blue-cyan)' : 'var(--text-muted)' }}>
                {isPartnerTyping ? 'typing...' : `@${partner?.username} • ${partner?.status === 'online' ? 'Active now' : 'Offline'}`}
              </span>
            </div>
          </div>
        </div>

        {/* Action Call Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => partner && startCall(partner.id, 'audio')}
            className="btn-icon"
            title="Start Audio Call"
            style={{ width: '38px', height: '38px' }}
          >
            <Phone size={18} />
          </button>

          <button
            onClick={() => partner && startCall(partner.id, 'video')}
            className="btn-icon"
            title="Start Video Call"
            style={{ width: '38px', height: '38px', backgroundColor: 'rgba(20, 123, 255, 0.15)', borderColor: 'var(--border-focus)' }}
          >
            <Video size={18} color="var(--blue-cyan)" />
          </button>

          <button
            onClick={onOpenPartnerProfile}
            className="btn-icon"
            title="User Details"
            style={{ width: '38px', height: '38px' }}
          >
            <Info size={18} />
          </button>
        </div>
      </div>

      {/* Message Stream */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {messages.length === 0 ? (
          <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '0.88rem' }}>No messages yet. Say hello to @{partner?.username}! 👋</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUser.id;
            const time = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            if (msg.message_type === 'call_log') {
              return (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: 'center',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.78rem',
                    color: 'var(--text-secondary)',
                    margin: '6px 0',
                  }}
                >
                  {msg.content}
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                style={{
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '75%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isMe ? 'flex-end' : 'flex-start',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    padding: msg.message_type === 'image' ? '6px' : '10px 16px',
                    borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    backgroundColor: isMe ? '#147BFF' : 'var(--bg-surface-2)',
                    backgroundImage: isMe ? 'linear-gradient(135deg, #147BFF 0%, #0070f3 100%)' : 'none',
                    color: '#ffffff',
                    fontSize: '0.92rem',
                    lineHeight: 1.45,
                    border: isMe ? 'none' : '1px solid var(--border-subtle)',
                    boxShadow: isMe ? '0 4px 15px var(--blue-glow)' : '0 2px 8px rgba(0,0,0,0.4)',
                    position: 'relative',
                    wordBreak: 'break-word',
                  }}
                >
                  {/* Photo content */}
                  {msg.message_type === 'image' && msg.media_url && (
                    <div style={{ borderRadius: '14px', overflow: 'hidden', marginBottom: msg.content ? '6px' : '0' }}>
                      <img
                        src={msg.media_url}
                        alt="Shared media"
                        onClick={() => setActiveMediaPreview(msg.media_url!)}
                        style={{
                          width: '100%',
                          maxHeight: '320px',
                          objectFit: 'cover',
                          display: 'block',
                          cursor: 'pointer',
                        }}
                      />
                    </div>
                  )}

                  {msg.content && <p>{msg.content}</p>}

                  {/* Message Meta Info */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '4px',
                      fontSize: '0.66rem',
                      color: isMe ? 'rgba(255, 255, 255, 0.75)' : 'var(--text-muted)',
                      marginTop: '4px',
                    }}
                  >
                    <span>{time}</span>
                    {isMe && (
                      <span>
                        {msg.read_at ? (
                          <CheckCheck size={13} color="#ffffff" />
                        ) : (
                          <Check size={13} color="rgba(255, 255, 255, 0.8)" />
                        )}
                      </span>
                    )}

                    {isMe && (
                      <button
                        onClick={() => deleteMessage(msg.id, true)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'rgba(255, 255, 255, 0.5)',
                          cursor: 'pointer',
                          marginLeft: '4px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        title="Delete Message"
                      >
                        <Trash2 size={11} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Real-time Typing indicator dots */}
        {isPartnerTyping && (
          <div
            style={{
              alignSelf: 'flex-start',
              padding: '10px 16px',
              borderRadius: '18px 18px 18px 4px',
              backgroundColor: 'var(--bg-surface-2)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginRight: '4px' }}>
              {partner?.display_name} is typing
            </span>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--blue-cyan)', animation: 'pulse-ring 1.2s infinite' }} />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Emoji Picker Popover */}
      {showEmojiPicker && (
        <div
          style={{
            position: 'absolute',
            bottom: '72px',
            left: '20px',
            backgroundColor: 'var(--bg-surface-2)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '10px',
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '8px',
            boxShadow: 'var(--shadow-modal)',
            zIndex: 30,
          }}
        >
          {POPULAR_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                setInputText((prev) => prev + emoji);
                setShowEmojiPicker(false);
              }}
              style={{
                fontSize: '1.25rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '8px',
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Image Picker Popover */}
      {showImagePicker && (
        <div
          style={{
            position: 'absolute',
            bottom: '72px',
            left: '50px',
            backgroundColor: 'var(--bg-surface-2)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '12px',
            boxShadow: 'var(--shadow-modal)',
            zIndex: 30,
            width: '280px',
          }}
        >
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Attach Photo
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {SAMPLE_PHOTOS.map((photo, i) => (
              <img
                key={i}
                src={photo}
                alt="Option"
                onClick={() => handleSendPresetImage(photo)}
                style={{
                  width: '100%',
                  height: '70px',
                  borderRadius: '10px',
                  objectFit: 'cover',
                  cursor: 'pointer',
                  border: '1px solid var(--border-subtle)',
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Message Input Bottom Bar */}
      <form
        onSubmit={handleSend}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 18px',
          backgroundColor: 'rgba(9, 10, 15, 0.95)',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        <button
          type="button"
          onClick={() => {
            setShowEmojiPicker(!showEmojiPicker);
            setShowImagePicker(false);
          }}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          title="Insert Emoji"
        >
          <Smile size={22} />
        </button>

        <button
          type="button"
          onClick={() => {
            setShowImagePicker(!showImagePicker);
            setShowEmojiPicker(false);
          }}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          title="Send Photo"
        >
          <ImageIcon size={22} />
        </button>

        <input
          type="text"
          placeholder="Message @..."
          value={inputText}
          onChange={handleInputChange}
          style={{
            flex: 1,
            backgroundColor: 'var(--bg-surface-3)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '999px',
            padding: '10px 18px',
            color: '#fff',
            fontSize: '0.92rem',
            outline: 'none',
          }}
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: inputText.trim() ? 'var(--blue-electric)' : 'var(--bg-surface-3)',
            color: '#fff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: inputText.trim() ? 'pointer' : 'default',
            boxShadow: inputText.trim() ? '0 0 15px var(--blue-glow)' : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          <Send size={18} />
        </button>
      </form>

      {/* Lightbox Modal */}
      {activeMediaPreview && (
        <div
          onClick={() => setActiveMediaPreview(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <img
            src={activeMediaPreview}
            alt="Preview"
            style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: '16px', objectFit: 'contain' }}
          />
        </div>
      )}
    </div>
  );
};
