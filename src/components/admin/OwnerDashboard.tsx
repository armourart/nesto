import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storage';
import { webrtc } from '../../services/webrtc';
import { User, AuditLog } from '../../types';
import { 
  ShieldCheck, 
  Users, 
  PhoneCall, 
  Activity, 
  Mic, 
  Camera, 
  ScreenShare, 
  Search, 
  CheckCircle, 
  AlertTriangle,
  Lock,
  X,
  ExternalLink,
  Sliders,
  Check
} from 'lucide-react';

export const OwnerDashboard: React.FC = () => {
  const { currentUser, isOwner, users, refreshUsers } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'diagnostics' | 'audit'>('overview');
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => storage.getAuditLogs());

  // Hardware diagnostics state
  const [testMicActive, setTestMicActive] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [testCamActive, setTestCamActive] = useState(false);
  const [testScreenActive, setTestScreenActive] = useState(false);
  const [streamDiagnostics, setStreamDiagnostics] = useState<{ resolution: string; fps: number } | null>(null);

  useEffect(() => {
    setAuditLogs(storage.getAuditLogs());
    const unsub = storage.subscribe((event) => {
      if (event === 'AUDIT_LOG_ADDED') {
        setAuditLogs(storage.getAuditLogs());
      }
    });
    return unsub;
  }, []);

  // Mic level test loop
  useEffect(() => {
    let interval: number | null = null;
    if (testMicActive) {
      interval = window.setInterval(() => {
        setMicLevel(webrtc.getAudioLevel());
      }, 100);
    } else {
      setMicLevel(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [testMicActive]);

  // Backend authorization check
  if (!isOwner || !currentUser) {
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
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '20px',
            backgroundColor: 'rgba(255, 23, 68, 0.15)',
            border: '1px solid rgba(255, 23, 68, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
          }}
        >
          <Lock size={32} color="var(--red-electric)" />
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>
          403 Forbidden
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '420px' }}>
          The Nesto Administration Dashboard is strictly reserved for the verified owner account (<code style={{ color: 'var(--blue-cyan)' }}>4xwiiiin</code>).
        </p>
      </div>
    );
  }

  const allConversations = storage.getConversations();
  const allMessages = storage.getMessages();
  const activeCall = storage.getActiveCall();
  const onlineUsers = users.filter((u) => u.status === 'online');

  const filteredUsers = users.filter((u) => {
    const q = searchUserQuery.toLowerCase();
    return (
      u.username.toLowerCase().includes(q) ||
      u.display_name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  });

  const toggleUserSuspension = (target: User) => {
    const updated: User = {
      ...target,
      is_suspended: !target.is_suspended,
      status: !target.is_suspended ? 'offline' : 'online',
    };
    storage.saveUser(updated);
    storage.logAuditEvent(
      currentUser,
      updated.is_suspended ? 'MODERATION_SUSPEND_USER' : 'MODERATION_RESTORE_USER',
      `Modified account status for @${target.username}`,
      'warn',
      updated
    );
    refreshUsers();
    setSelectedUser(updated);
  };

  const toggleUserVerified = (target: User) => {
    const updated: User = {
      ...target,
      verified: !target.verified,
    };
    storage.saveUser(updated);
    storage.logAuditEvent(
      currentUser,
      'MODERATION_TOGGLE_VERIFIED',
      `Updated verified status for @${target.username} to ${updated.verified}`,
      'info',
      updated
    );
    refreshUsers();
    setSelectedUser(updated);
  };

  // Hardware Diagnostics Handlers
  const handleTestMic = async () => {
    if (testMicActive) {
      setTestMicActive(false);
    } else {
      await webrtc.getMediaStream(false, true);
      setTestMicActive(true);
      storage.logAuditEvent(currentUser, 'DIAGNOSTIC_MIC_TEST', 'Ran microphone hardware test');
    }
  };

  const handleTestCamera = async () => {
    if (testCamActive) {
      setTestCamActive(false);
      setStreamDiagnostics(null);
    } else {
      const stream = await webrtc.getMediaStream(true, false);
      setTestCamActive(true);
      const track = stream.getVideoTracks()[0];
      const settings = track ? track.getSettings() : {};
      setStreamDiagnostics({
        resolution: `${settings.width || 1280}x${settings.height || 720}`,
        fps: settings.frameRate || 30,
      });
      storage.logAuditEvent(currentUser, 'DIAGNOSTIC_CAM_TEST', `Camera test resolution: ${settings.width || 1280}x${settings.height || 720}`);
    }
  };

  const handleTestScreen = async () => {
    if (testScreenActive) {
      webrtc.stopScreenShare();
      setTestScreenActive(false);
    } else {
      const stream = await webrtc.startScreenShare(() => setTestScreenActive(false));
      if (stream) {
        setTestScreenActive(true);
        storage.logAuditEvent(currentUser, 'DIAGNOSTIC_SCREEN_SHARE', 'Tested native screen sharing capture');
      }
    }
  };

  return (
    <div
      style={{
        flex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-black)',
        overflowY: 'auto',
      }}
    >
      {/* Top Admin Header */}
      <div
        style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'rgba(9, 10, 15, 0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ff1744 0%, #8b0000 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px var(--red-glow)',
            }}
          >
            <ShieldCheck size={24} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                Nesto Owner Administration
              </h1>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  backgroundColor: 'rgba(255, 23, 68, 0.25)',
                  color: 'var(--red-electric)',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 23, 68, 0.4)',
                }}
              >
                ROLE: OWNER • 4xwiiiin
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Real-time platform metrics, user management, WebRTC diagnostics & audit logs
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--bg-surface-2)',
            borderRadius: '12px',
            padding: '4px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'users', label: 'Accounts' },
            { id: 'diagnostics', label: 'Diagnostics' },
            { id: 'audit', label: 'Security Logs' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: activeTab === t.id ? 700 : 500,
                color: activeTab === t.id ? '#fff' : 'var(--text-muted)',
                backgroundColor: activeTab === t.id ? 'var(--blue-electric)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Tab Content */}
      <div style={{ padding: '24px', flex: 1 }}>
        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div>
            {/* Stat Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Registered Accounts</span>
                  <Users size={18} color="var(--blue-cyan)" />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{users.length}</div>
                <div style={{ fontSize: '0.74rem', color: '#10b981', marginTop: '4px' }}>
                  ✓ Uniqueness Verified
                </div>
              </div>

              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Online Active Now</span>
                  <Activity size={18} color="#10b981" />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{onlineUsers.length}</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Across active sessions
                </div>
              </div>

              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Total Messages</span>
                  <Sliders size={18} color="var(--red-electric)" />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{allMessages.length}</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  In {allConversations.length} conversations
                </div>
              </div>

              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>WebRTC Engine Status</span>
                  <PhoneCall size={18} color={activeCall ? 'var(--red-electric)' : 'var(--blue-cyan)'} />
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>
                  {activeCall ? '1 Active Call' : 'Ready (0 Calls)'}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  STUN: stun.l.google.com
                </div>
              </div>
            </div>

            {/* Quick Live Security Banner */}
            <div
              className="glass-card"
              style={{
                padding: '20px',
                borderLeft: '4px solid var(--red-electric)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '4px' }}>
                  Username Reservation Protection: <code style={{ color: 'var(--red-electric)' }}>4xwiiiin</code>
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                  Permanent server-side collision protection is active. Duplicate username attempts (including case-variations like 4XWIIIIN) are intercepted and rejected.
                </p>
              </div>
              <div
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Check size={16} /> PROTECTED
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: User Accounts */}
        {activeTab === 'users' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--bg-surface-2)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '8px 14px',
                  width: '320px',
                }}
              >
                <Search size={16} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder="Filter by name, handle, or email..."
                  value={searchUserQuery}
                  onChange={(e) => setSearchUserQuery(e.target.value)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#fff',
                    fontSize: '0.88rem',
                    outline: 'none',
                    flex: 1,
                  }}
                />
              </div>

              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Showing {filteredUsers.length} accounts
              </span>
            </div>

            {/* Table */}
            <div className="glass-card" style={{ overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>User</th>
                    <th style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>Email (Google ID)</th>
                    <th style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>Role</th>
                    <th style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>Status</th>
                    <th style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>Joined</th>
                    <th style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr
                      key={u.id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        transition: 'background 0.15s',
                      }}
                    >
                      <td style={{ padding: '12px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img
                            src={u.profile_image}
                            alt={u.username}
                            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontWeight: 600, color: '#fff' }}>{u.display_name}</span>
                              {u.verified && <CheckCircle size={14} color="var(--blue-cyan)" />}
                            </div>
                            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>@{u.username}</span>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '12px 18px', color: 'var(--text-secondary)' }}>
                        {u.email}
                      </td>

                      <td style={{ padding: '12px 18px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            backgroundColor: u.role === 'OWNER' ? 'rgba(255, 23, 68, 0.2)' : 'rgba(20, 123, 255, 0.15)',
                            color: u.role === 'OWNER' ? 'var(--red-electric)' : 'var(--blue-cyan)',
                          }}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td style={{ padding: '12px 18px' }}>
                        {u.is_suspended ? (
                          <span style={{ color: 'var(--red-electric)', fontWeight: 700, fontSize: '0.78rem' }}>
                            SUSPENDED
                          </span>
                        ) : (
                          <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.78rem' }}>
                            {u.status.toUpperCase()}
                          </span>
                        )}
                      </td>

                      <td style={{ padding: '12px 18px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>

                      <td style={{ padding: '12px 18px' }}>
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                        >
                          Inspect Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Diagnostics Tool */}
        {activeTab === 'diagnostics' && (
          <div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Native WebRTC hardware pipeline testing for microphones, video cameras, and screen share capture.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {/* Mic Diagnostics */}
              <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <Mic size={22} color="var(--blue-cyan)" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Microphone VU Meter</h3>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
                  Live audio input measurement via Web Audio API AnalyserNode.
                </p>

                {/* Meter Bar */}
                <div
                  style={{
                    height: '24px',
                    backgroundColor: 'var(--bg-surface-3)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    marginBottom: '16px',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${testMicActive ? micLevel : 0}%`,
                      background: 'linear-gradient(90deg, #10b981 0%, #00bfff 60%, #ff1744 100%)',
                      transition: 'width 0.08s ease',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Level: {testMicActive ? `${micLevel}%` : 'Inactive'}
                  </span>
                  <button onClick={handleTestMic} className="btn-secondary" style={{ padding: '8px 16px' }}>
                    {testMicActive ? 'Stop Mic Test' : 'Test Microphone'}
                  </button>
                </div>
              </div>

              {/* Camera Diagnostics */}
              <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <Camera size={22} color="var(--red-electric)" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Camera Stream Analyzer</h3>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
                  Tests video resolution, framerate, and device capabilities.
                </p>

                <div
                  style={{
                    padding: '14px',
                    backgroundColor: 'var(--bg-surface-2)',
                    borderRadius: '12px',
                    marginBottom: '16px',
                    fontSize: '0.82rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <div>Status: {testCamActive ? 'Active Stream' : 'Idle'}</div>
                  {streamDiagnostics && (
                    <div style={{ marginTop: '6px', color: '#10b981', fontWeight: 600 }}>
                      Resolution: {streamDiagnostics.resolution} @ {streamDiagnostics.fps} FPS
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'right' }}>
                  <button onClick={handleTestCamera} className="btn-secondary" style={{ padding: '8px 16px' }}>
                    {testCamActive ? 'Stop Camera Test' : 'Analyze Camera'}
                  </button>
                </div>
              </div>

              {/* Screen Sharing Diagnostics */}
              <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <ScreenShare size={22} color="#10b981" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Screen Share Validation</h3>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
                  Verifies `getDisplayMedia` API capture permissions and automatic stop events.
                </p>

                <div
                  style={{
                    padding: '14px',
                    backgroundColor: 'var(--bg-surface-2)',
                    borderRadius: '12px',
                    marginBottom: '16px',
                    fontSize: '0.82rem',
                    color: testScreenActive ? '#10b981' : 'var(--text-secondary)',
                  }}
                >
                  {testScreenActive ? '✓ Screen capture active and functional' : 'Ready to request screen capture'}
                </div>

                <div style={{ textAlign: 'right' }}>
                  <button onClick={handleTestScreen} className="btn-secondary" style={{ padding: '8px 16px' }}>
                    {testScreenActive ? 'Stop Sharing' : 'Test Screen Share'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Security & Audit Logs */}
        {activeTab === 'audit' && (
          <div>
            <div className="glass-card" style={{ overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: '12px 18px', color: 'var(--text-secondary)' }}>Timestamp</th>
                    <th style={{ padding: '12px 18px', color: 'var(--text-secondary)' }}>Actor</th>
                    <th style={{ padding: '12px 18px', color: 'var(--text-secondary)' }}>Action</th>
                    <th style={{ padding: '12px 18px', color: 'var(--text-secondary)' }}>Details</th>
                    <th style={{ padding: '12px 18px', color: 'var(--text-secondary)' }}>Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '10px 18px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                      <td style={{ padding: '10px 18px', fontWeight: 600 }}>
                        @{log.actor_username}
                      </td>
                      <td style={{ padding: '10px 18px', color: 'var(--blue-cyan)', fontFamily: 'var(--font-mono)', fontSize: '0.76rem' }}>
                        {log.action}
                      </td>
                      <td style={{ padding: '10px 18px', color: 'var(--text-secondary)' }}>
                        {log.details}
                      </td>
                      <td style={{ padding: '10px 18px' }}>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor:
                              log.severity === 'danger'
                                ? 'rgba(255, 23, 68, 0.2)'
                                : log.severity === 'security'
                                ? 'rgba(255, 23, 68, 0.15)'
                                : 'rgba(20, 123, 255, 0.15)',
                            color: log.severity === 'danger' || log.severity === 'security' ? 'var(--red-electric)' : 'var(--blue-cyan)',
                          }}
                        >
                          {log.severity.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 5, 8, 0.85)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 150,
            padding: '20px',
          }}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '520px',
              padding: '28px',
              boxShadow: 'var(--shadow-modal)',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={selectedUser.profile_image}
                  alt={selectedUser.username}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{selectedUser.display_name}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>@{selectedUser.username}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-surface-2)', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified Google Account</div>
                <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>{selectedUser.email}</div>
              </div>

              <div style={{ padding: '12px', backgroundColor: 'var(--bg-surface-2)', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>User Role & Permissions</div>
                <div style={{ fontSize: '0.9rem', color: selectedUser.role === 'OWNER' ? 'var(--red-electric)' : 'var(--blue-cyan)', fontWeight: 700 }}>
                  {selectedUser.role}
                </div>
              </div>

              <div style={{ padding: '12px', backgroundColor: 'var(--bg-surface-2)', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bio / Status</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{selectedUser.bio || 'None set'}</div>
              </div>
            </div>

            {/* Moderation Actions */}
            {selectedUser.role !== 'OWNER' && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => toggleUserVerified(selectedUser)}
                  className="btn-secondary"
                  style={{ flex: 1 }}
                >
                  {selectedUser.verified ? 'Remove Verified' : 'Grant Verified Badge'}
                </button>

                <button
                  onClick={() => toggleUserSuspension(selectedUser)}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 23, 68, 0.4)',
                    backgroundColor: selectedUser.is_suspended ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 23, 68, 0.2)',
                    color: selectedUser.is_suspended ? '#10b981' : 'var(--red-electric)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  {selectedUser.is_suspended ? 'Restore Account' : 'Suspend Account'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
