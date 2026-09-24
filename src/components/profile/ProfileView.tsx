import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storage';
import { 
  User, 
  Shield, 
  Bell, 
  Phone, 
  Lock, 
  LogOut, 
  Check, 
  Edit3, 
  Save, 
  Camera,
  CheckCircle2,
  Sliders,
  X
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { currentUser, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.display_name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [profileImage, setProfileImage] = useState(currentUser?.profile_image || '');

  // Privacy & Preferences
  const [settings, setSettings] = useState(() =>
    currentUser ? storage.getUserSettings(currentUser.id) : null
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!currentUser) return null;

  const handleSaveProfile = () => {
    updateProfile({
      display_name: displayName.trim() || currentUser.display_name,
      bio: bio.trim(),
      profile_image: profileImage || currentUser.profile_image,
    });
    if (settings) {
      storage.saveUserSettings(currentUser.id, settings);
    }
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const toggleSetting = (category: 'privacy' | 'notifications' | 'media', key: string) => {
    if (!settings) return;
    const currentVal = (settings as any)[category][key];
    const updated = {
      ...settings,
      [category]: {
        ...(settings as any)[category],
        [key]: !currentVal,
      },
    };
    setSettings(updated);
    storage.saveUserSettings(currentUser.id, updated);
  };

  return (
    <div
      style={{
        flex: 1,
        height: '100%',
        overflowY: 'auto',
        backgroundColor: 'var(--bg-black)',
        padding: '28px 24px',
      }}
    >
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        {/* Profile Header Card */}
        <div
          className="glass-card"
          style={{
            padding: '32px 28px',
            marginBottom: '24px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Ambient Glow */}
          <div
            style={{
              position: 'absolute',
              top: '-40px',
              right: '-40px',
              width: '180px',
              height: '180px',
              background: currentUser.role === 'OWNER' ? 'var(--red-glow)' : 'var(--blue-glow)',
              filter: 'blur(50px)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={profileImage || currentUser.profile_image}
                alt={currentUser.display_name}
                style={{
                  width: '92px',
                  height: '92px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid var(--border-subtle)',
                  boxShadow: '0 0 25px rgba(0, 0, 0, 0.6)',
                }}
              />
              {currentUser.role === 'OWNER' && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: 'var(--red-electric)',
                    color: '#fff',
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '999px',
                    border: '2px solid var(--bg-surface-1)',
                  }}
                >
                  OWNER
                </div>
              )}
            </div>

            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>
                  {currentUser.display_name}
                </h2>
                {currentUser.verified && <CheckCircle2 size={18} color="var(--blue-cyan)" />}
              </div>

              <div style={{ fontSize: '0.88rem', color: 'var(--blue-cyan)', fontWeight: 600, marginBottom: '8px' }}>
                @{currentUser.username}
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                {currentUser.bio || 'No bio configured yet.'}
              </p>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              {isEditing ? <X size={16} /> : <Edit3 size={16} />}
              <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>

          {/* Edit Form */}
          {isEditing && (
            <div
              style={{
                marginTop: '24px',
                paddingTop: '20px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: 'var(--bg-surface-3)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    color: '#fff',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: 'var(--bg-surface-3)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    color: '#fff',
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  value={profileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                  placeholder="https://..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: 'var(--bg-surface-3)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    color: '#fff',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ textAlign: 'right', marginTop: '6px' }}>
                <button onClick={handleSaveProfile} className="btn-primary" style={{ padding: '10px 24px' }}>
                  <Save size={16} />
                  <span>Save Profile</span>
                </button>
              </div>
            </div>
          )}

          {savedSuccess && (
            <div
              style={{
                marginTop: '16px',
                padding: '10px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
                color: '#10b981',
                fontSize: '0.84rem',
                textAlign: 'center',
              }}
            >
              ✓ Profile settings saved successfully!
            </div>
          )}
        </div>

        {/* Account Details */}
        <div className="glass-card" style={{ padding: '24px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18} color="var(--blue-cyan)" />
            <span>Account & Authentication</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>Google Account</span>
              <span style={{ fontSize: '0.86rem', color: '#fff', fontWeight: 600 }}>{currentUser.email}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>Unique Username</span>
              <span style={{ fontSize: '0.86rem', color: 'var(--blue-cyan)', fontWeight: 600 }}>@{currentUser.username}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>Role</span>
              <span style={{ fontSize: '0.86rem', color: currentUser.role === 'OWNER' ? 'var(--red-electric)' : '#fff', fontWeight: 700 }}>
                {currentUser.role}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
              <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>Member Since</span>
              <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                {new Date(currentUser.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Privacy Toggles */}
        {settings && (
          <div className="glass-card" style={{ padding: '24px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={18} color="var(--blue-cyan)" />
              <span>Privacy Controls</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Show Online Status</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Allow contacts to see when you are active</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.privacy.showOnlineStatus}
                  onChange={() => toggleSetting('privacy', 'showOnlineStatus')}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--blue-electric)' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Send Read Receipts</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Show double blue checkmarks when messages are viewed</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.privacy.readReceipts}
                  onChange={() => toggleSetting('privacy', 'readReceipts')}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--blue-electric)' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Notifications & Calls */}
        {settings && (
          <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={18} color="var(--red-electric)" />
              <span>Calls & Media</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Web Audio Noise Suppression</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Filter ambient background room noise during calls</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.media.noiseSuppression}
                  onChange={() => toggleSetting('media', 'noiseSuppression')}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--red-electric)' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Sound Effects & Chimes</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Synthesized audio feedback on send, receive, and ringtone</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.sounds}
                  onChange={() => toggleSetting('notifications', 'sounds')}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--blue-electric)' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Sign Out */}
        <button
          onClick={logout}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '14px',
            backgroundColor: 'rgba(255, 23, 68, 0.15)',
            border: '1px solid rgba(255, 23, 68, 0.3)',
            color: 'var(--red-electric)',
            fontWeight: 700,
            fontSize: '0.92rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 23, 68, 0.25)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 23, 68, 0.15)')}
        >
          <LogOut size={18} />
          <span>Sign Out of Nesto</span>
        </button>
      </div>
    </div>
  );
};
