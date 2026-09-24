import React from 'react';
import { useCall } from '../../context/CallContext';
import { Phone, PhoneOff, Video } from 'lucide-react';

export const IncomingCallModal: React.FC = () => {
  const { incomingCall, callerUser, acceptCall, rejectCall } = useCall();

  if (!incomingCall || !callerUser) {
    return null;
  }

  const isVideo = incomingCall.type === 'video';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 5, 8, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 220,
        padding: '20px',
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '380px',
          padding: '36px 28px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-modal), 0 0 50px var(--red-glow)',
          border: '1px solid rgba(255, 23, 68, 0.4)',
        }}
      >
        {/* Pulsing Avatar */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '20px' }}>
          <div
            className="anim-pulse-ring"
            style={{
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              background: 'var(--grad-nesto)',
              padding: '4px',
            }}
          >
            <img
              src={callerUser.profile_image}
              alt={callerUser.display_name}
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
            />
          </div>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
          Incoming Nesto {isVideo ? 'Video' : 'Audio'} Call...
        </div>

        <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
          {callerUser.display_name}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '32px' }}>
          @{callerUser.username}
        </p>

        {/* Action Buttons: Decline & Accept */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px' }}>
          {/* Decline */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={rejectCall}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 23, 68, 0.2)',
                border: '2px solid var(--red-electric)',
                color: 'var(--red-electric)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--red-electric)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 23, 68, 0.2)';
                e.currentTarget.style.color = 'var(--red-electric)';
              }}
              title="Decline"
            >
              <PhoneOff size={24} />
            </button>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Decline</span>
          </div>

          {/* Accept */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={acceptCall}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                border: 'none',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 0 25px rgba(16, 185, 129, 0.6)',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              title="Accept Call"
            >
              {isVideo ? <Video size={26} /> : <Phone size={26} />}
            </button>
            <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>Accept</span>
          </div>
        </div>
      </div>
    </div>
  );
};
