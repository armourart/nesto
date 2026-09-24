import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storage';
import { Check, X, Shield, Camera, ArrowRight, UserCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const { currentUser, completeOnboarding } = useAuth();
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState(currentUser?.username || '');
  const [displayName, setDisplayName] = useState(currentUser?.display_name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [profileImage, setProfileImage] = useState(currentUser?.profile_image || '');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !currentUser) return null;

  // Real-time username check
  const check = storage.validateUsername(username, currentUser.id);

  const handleNextStep = () => {
    setError(null);
    if (step === 2) {
      if (!check.valid) {
        setError(check.error || 'Invalid username');
        return;
      }
    }
    if (step === 3) {
      if (!displayName.trim()) {
        setError('Please enter a display name');
        return;
      }
    }
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Finalize
      const res = completeOnboarding(username, displayName, bio, profileImage);
      if (res.success) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ff1744', '#147bff', '#00bfff'],
        });
        onComplete();
      } else {
        setError(res.error || 'Failed to complete profile.');
      }
    }
  };

  const AVATAR_PRESETS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 5, 8, 0.94)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 110,
        padding: '20px',
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '36px 32px',
          boxShadow: 'var(--shadow-modal), 0 0 45px rgba(20, 123, 255, 0.15)',
          position: 'relative',
        }}
      >
        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              style={{
                width: s === step ? '28px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: s === step ? 'var(--blue-cyan)' : s < step ? 'var(--blue-deep)' : 'var(--bg-surface-3)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', marginBottom: '16px' }}>
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '20px',
                  background: 'var(--grad-nesto)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 25px var(--red-glow)',
                }}
              >
                <UserCheck size={32} color="#fff" />
              </div>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
              Welcome to <span className="text-nesto-gradient">Nesto</span>
            </h2>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '28px' }}>
              Your Google identity has been verified. Let’s configure your unique Nesto handle and profile to get you ready.
            </p>
            <div
              style={{
                padding: '14px',
                backgroundColor: 'var(--bg-surface-2)',
                borderRadius: '14px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '28px',
                textAlign: 'left',
              }}
            >
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Connected Google Account
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                {currentUser.email}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Username Selection */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px', fontFamily: 'var(--font-heading)' }}>
              Choose your Nesto Username
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Your unique public handle for messages and calls. Case-insensitive and permanently unique.
            </p>

            <div style={{ marginBottom: '14px', position: 'relative' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'var(--bg-surface-3)',
                  border: `1px solid ${
                    username
                      ? check.valid
                        ? 'rgba(16, 185, 129, 0.6)'
                        : 'rgba(255, 23, 68, 0.6)'
                      : 'var(--border-subtle)'
                  }`,
                  borderRadius: '12px',
                  padding: '12px 14px',
                }}
              >
                <span style={{ color: 'var(--text-muted)', fontWeight: 600, marginRight: '4px' }}>@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
                  placeholder="username"
                  autoFocus
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#fff',
                    fontSize: '1rem',
                    fontWeight: 600,
                    outline: 'none',
                  }}
                />
                {username && (
                  <div>
                    {check.valid ? (
                      <Check size={18} color="#10b981" />
                    ) : (
                      <X size={18} color="var(--red-electric)" />
                    )}
                  </div>
                )}
              </div>

              {username && (
                <div
                  style={{
                    fontSize: '0.78rem',
                    marginTop: '6px',
                    color: check.valid ? '#10b981' : 'var(--text-bright-red)',
                    fontWeight: 500,
                  }}
                >
                  {check.valid ? '✓ Username available' : check.error}
                </div>
              )}
            </div>

            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              * Reserved usernames (e.g. <code style={{ color: 'var(--blue-cyan)' }}>4xwiiiin</code>) cannot be claimed by regular users.
            </div>
          </div>
        )}

        {/* Step 3: Display Name & Avatar */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px', fontFamily: 'var(--font-heading)' }}>
              Profile Details
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Set your public display name and choose a photo.
            </p>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img
                  src={profileImage || currentUser.profile_image}
                  alt="Preview"
                  style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid var(--blue-electric)',
                    boxShadow: '0 0 20px var(--blue-glow)',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
                {AVATAR_PRESETS.map((p, idx) => (
                  <img
                    key={idx}
                    src={p}
                    alt={`Preset ${idx}`}
                    onClick={() => setProfileImage(p)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      border: profileImage === p ? '2px solid var(--blue-cyan)' : '1px solid transparent',
                      opacity: profileImage === p ? 1 : 0.7,
                      transition: 'opacity 0.2s',
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your Name"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: 'var(--bg-surface-3)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '0.92rem',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Bio (Optional)
              </label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="What is your focus?"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: 'var(--bg-surface-3)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '0.92rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>
        )}

        {/* Step 4: Privacy & Enter Nesto */}
        {step === 4 && (
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px', fontFamily: 'var(--font-heading)' }}>
              Privacy & Preferences
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Review your default privacy settings. You can adjust these anytime in Settings.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  backgroundColor: 'var(--bg-surface-2)',
                  borderRadius: '12px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Show Online Status</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Display when you are active</div>
                </div>
                <div style={{ color: '#10b981', fontWeight: 700, fontSize: '0.82rem' }}>ENABLED</div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  backgroundColor: 'var(--bg-surface-2)',
                  borderRadius: '12px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Read Receipts</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Blue double checkmarks</div>
                </div>
                <div style={{ color: 'var(--blue-cyan)', fontWeight: 700, fontSize: '0.82rem' }}>ENABLED</div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  backgroundColor: 'var(--bg-surface-2)',
                  borderRadius: '12px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>WebRTC Audio & Video Calling</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Low latency encrypted P2P</div>
                </div>
                <div style={{ color: 'var(--blue-cyan)', fontWeight: 700, fontSize: '0.82rem' }}>READY</div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div style={{ color: 'var(--text-bright-red)', fontSize: '0.82rem', marginBottom: '14px' }}>
            {error}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="btn-secondary"
              style={{ flex: 1 }}
            >
              Back
            </button>
          )}
          <button
            onClick={handleNextStep}
            className="btn-primary"
            style={{ flex: 2 }}
          >
            <span>{step === 4 ? 'Enter Nesto' : 'Continue'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
