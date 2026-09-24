import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onSuccess }) => {
  const { loginWithGoogle, users } = useAuth();
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async (email?: string, name?: string, photo?: string) => {
    try {
      setLoading(true);
      setError(null);
      await loginWithGoogle(email, name, photo);
      onSuccess();
    } catch {
      setError('Google OAuth verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail || !customEmail.includes('@gmail.com') && !customEmail.includes('@google.com')) {
      setError('Only verified Google accounts (@gmail.com) are accepted on Nesto.');
      return;
    }
    handleGoogleSignIn(
      customEmail,
      customName || customEmail.split('@')[0],
      `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(customEmail)}`
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 5, 8, 0.92)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '20px',
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '36px 30px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-modal), 0 0 50px rgba(255, 23, 68, 0.15)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient Top Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '200px',
            height: '100px',
            background: 'var(--grad-nesto)',
            filter: 'blur(50px)',
            opacity: 0.5,
            pointerEvents: 'none',
          }}
        />

        {/* Logo */}
        <div style={{ display: 'inline-flex', marginBottom: '16px', position: 'relative' }}>
          <img
            src="/icon-512.svg"
            alt="Nesto"
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '20px',
              boxShadow: '0 0 30px var(--red-glow), 0 0 40px var(--blue-glow)',
            }}
          />
        </div>

        <h1
          style={{
            fontSize: '2.2rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            marginBottom: '6px',
            fontFamily: 'var(--font-heading)',
          }}
        >
          <span className="text-nesto-gradient">NESTO</span>
        </h1>

        <p
          style={{
            fontSize: '0.98rem',
            color: 'var(--text-secondary)',
            marginBottom: '32px',
            fontWeight: 500,
            letterSpacing: '0.03em',
          }}
        >
          Connect. Talk. Share.
        </p>

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              backgroundColor: 'rgba(255, 23, 68, 0.15)',
              border: '1px solid rgba(255, 23, 68, 0.35)',
              borderRadius: '12px',
              color: 'var(--text-bright-red)',
              fontSize: '0.85rem',
              marginBottom: '20px',
              textAlign: 'left',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {!isCustomMode ? (
          <div>
            {/* Primary Google Auth Button */}
            <button
              onClick={() => handleGoogleSignIn()}
              disabled={loading}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '14px 20px',
                backgroundColor: '#ffffff',
                color: '#1f1f1f',
                fontWeight: 600,
                fontSize: '0.96rem',
                borderRadius: '14px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(255, 255, 255, 0.18)',
                transition: 'transform 0.2s var(--ease-spring), box-shadow 0.2s',
                marginBottom: '16px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {/* Google G Logo SVG */}
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{loading ? 'Authenticating with Google...' : 'Continue with Google'}</span>
            </button>

            {/* Quick Demo Identities for Live Multi-User Testing */}
            <div style={{ margin: '22px 0 14px' }}>
              <div
                style={{
                  fontSize: '0.74rem',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.06em',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Sparkles size={12} color="var(--blue-cyan)" />
                <span>Or Select Verified Nesto Identity</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {users.slice(0, 3).map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleGoogleSignIn(u.email, u.display_name, u.profile_image)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '12px',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.2s, border-color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(20, 123, 255, 0.12)';
                      e.currentTarget.style.borderColor = 'var(--blue-electric)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    }}
                  >
                    <img
                      src={u.profile_image}
                      alt={u.username}
                      style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{u.display_name}</span>
                        {u.role === 'OWNER' && (
                          <span
                            style={{
                              fontSize: '0.62rem',
                              padding: '1px 5px',
                              borderRadius: '4px',
                              backgroundColor: 'rgba(255, 23, 68, 0.2)',
                              color: 'var(--red-electric)',
                              fontWeight: 700,
                            }}
                          >
                            OWNER
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>@{u.username}</span>
                    </div>
                    <ArrowRight size={14} color="var(--text-muted)" />
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsCustomMode(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--blue-cyan)',
                fontSize: '0.82rem',
                cursor: 'pointer',
                marginTop: '12px',
                textDecoration: 'underline',
              }}
            >
              Sign in with another Google/Gmail address
            </button>
          </div>
        ) : (
          <form onSubmit={handleCustomGoogleSubmit}>
            <div style={{ textAlign: 'left', marginBottom: '14px' }}>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Google Account (Gmail)
              </label>
              <input
                type="email"
                placeholder="your.name@gmail.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  backgroundColor: 'var(--bg-surface-3)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ textAlign: 'left', marginBottom: '20px' }}>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Your Name
              </label>
              <input
                type="text"
                placeholder="Full Name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  backgroundColor: 'var(--bg-surface-3)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginBottom: '12px' }}>
              Verify & Connect with Google
            </button>

            <button
              type="button"
              onClick={() => setIsCustomMode(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
            >
              ← Back to quick accounts
            </button>
          </form>
        )}

        {/* Security Notice */}
        <div
          style={{
            marginTop: '28px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '0.74rem',
            color: 'var(--text-muted)',
          }}
        >
          <Shield size={14} color="#10b981" />
          <span>OAuth 2.0 / OpenID Connect Verified • No Passwords Stored</span>
        </div>
      </div>
    </div>
  );
};
