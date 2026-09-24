import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCall } from '../../context/CallContext';
import { Phone, Video, PhoneIncoming, PhoneOutgoing, PhoneMissed, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { User } from '../../types';

export const CallsView: React.FC = () => {
  const { users, currentUser } = useAuth();
  const { startCall, activeCall } = useCall();

  const otherUsers = users.filter((u) => u.id !== currentUser?.id);

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <Phone size={24} color="var(--red-electric)" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
            Nesto Voice & Video Calling
          </h2>
        </div>

        {/* Active Call Banner */}
        {activeCall && activeCall.status === 'connected' && (
          <div
            className="glass-card"
            style={{
              padding: '18px 22px',
              backgroundColor: 'rgba(255, 23, 68, 0.15)',
              border: '1px solid rgba(255, 23, 68, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
              boxShadow: '0 0 30px var(--red-glow)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--red-electric)',
                  animation: 'pulse-ring 1.5s infinite',
                }}
              />
              <div>
                <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#fff' }}>
                  Ongoing {activeCall.type.toUpperCase()} Call Active
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  WebRTC P2P stream live
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Dial Contacts */}
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '14px' }}>
          Quick Connect
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
          {otherUsers.map((user) => (
            <div
              key={user.id}
              className="glass-card"
              style={{
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={user.profile_image}
                    alt={user.username}
                    style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span
                    className={`status-dot-${user.status}`}
                    style={{ position: 'absolute', bottom: 1, right: 1 }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.94rem', fontWeight: 700, color: '#fff' }}>
                      {user.display_name}
                    </span>
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
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    @{user.username} • {user.status === 'online' ? 'Available' : 'Offline'}
                  </span>
                </div>
              </div>

              {/* Call triggers */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => startCall(user.id, 'audio')}
                  className="btn-icon"
                  style={{ width: '40px', height: '40px' }}
                  title="Audio Call"
                >
                  <Phone size={18} />
                </button>

                <button
                  onClick={() => startCall(user.id, 'video')}
                  className="btn-icon"
                  style={{ width: '40px', height: '40px', backgroundColor: 'rgba(20, 123, 255, 0.15)', borderColor: 'var(--border-focus)' }}
                  title="Video Call"
                >
                  <Video size={18} color="var(--blue-cyan)" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Call Records */}
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '14px' }}>
          Recent Calls
        </h3>

        <div className="glass-card" style={{ padding: '8px 16px' }}>
          {[
            { name: 'Elena Vance', type: 'video', direction: 'incoming', duration: '14m 20s', time: 'Today, 4:15 PM' },
            { name: 'Marcus Chen', type: 'audio', direction: 'outgoing', duration: '4m 02s', time: 'Yesterday, 8:40 PM' },
            { name: 'Maya Rodriguez', type: 'video', direction: 'missed', duration: 'Missed', time: 'Sep 22, 11:20 AM' },
          ].map((c, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: c.direction === 'missed' ? 'rgba(255, 23, 68, 0.15)' : 'rgba(20, 123, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {c.direction === 'missed' ? (
                    <PhoneMissed size={16} color="var(--red-electric)" />
                  ) : c.direction === 'incoming' ? (
                    <ArrowDownLeft size={16} color="var(--blue-cyan)" />
                  ) : (
                    <ArrowUpRight size={16} color="#10b981" />
                  )}
                </div>

                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: c.direction === 'missed' ? 'var(--text-bright-red)' : '#fff' }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    {c.type === 'video' ? 'Video' : 'Audio'} • {c.duration}
                  </div>
                </div>
              </div>

              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{c.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
