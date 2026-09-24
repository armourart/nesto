import React, { useState } from 'react';
import { 
  MessageSquare, 
  Phone, 
  Bell, 
  User, 
  ShieldCheck, 
  LogOut, 
  Compass, 
  Users, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openSearch: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab, openSearch }) => {
  const { currentUser, isOwner, users, switchUser, logout } = useAuth();
  const { totalUnreadCount } = useChat();
  const [showUserSwitcher, setShowUserSwitcher] = useState(false);

  const navItems = [
    { id: 'chats', label: 'Chats', icon: MessageSquare, badge: totalUnreadCount },
    { id: 'calls', label: 'Calls', icon: Phone },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'notifications', label: 'Alerts', icon: Bell },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  if (isOwner) {
    navItems.push({
      id: 'admin',
      label: 'Admin',
      icon: ShieldCheck,
      badge: 0,
    });
  }

  return (
    <aside
      style={{
        width: '260px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-surface-1)',
        borderRight: '1px solid var(--border-subtle)',
        padding: '20px 16px',
        zIndex: 40,
        position: 'relative',
      }}
      className="desktop-only"
    >
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px', paddingLeft: '4px' }}>
        <img
          src="/favicon.svg"
          alt="Nesto"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            boxShadow: '0 0 16px var(--red-glow)',
          }}
        />
        <div>
          <h1
            style={{
              fontSize: '1.45rem',
              fontWeight: 800,
              letterSpacing: '0.05em',
              fontFamily: 'var(--font-heading)',
              lineHeight: 1.1,
            }}
          >
            <span className="text-nesto-gradient">NESTO</span>
          </h1>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', letterSpacing: '0.06em' }}>
            CONNECT • TALK • SHARE
          </span>
        </div>
      </div>

      {/* User Switcher / Quick Profile Widget */}
      {currentUser && (
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <div
            onClick={() => setShowUserSwitcher(!showUserSwitcher)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              backgroundColor: 'var(--bg-surface-2)',
              borderRadius: '14px',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <img
                  src={currentUser.profile_image}
                  alt={currentUser.display_name}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    border: '2px solid var(--bg-surface-2)',
                  }}
                />
              </div>
              <div style={{ overflow: 'hidden', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                    }}
                  >
                    {currentUser.display_name}
                  </span>
                  {currentUser.role === 'OWNER' && (
                    <span
                      style={{
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        padding: '1px 5px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(255, 23, 68, 0.2)',
                        color: 'var(--red-electric)',
                        border: '1px solid rgba(255, 23, 68, 0.3)',
                      }}
                    >
                      OWNER
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  @{currentUser.username}
                </span>
              </div>
            </div>
            <ChevronDown size={16} color="var(--text-muted)" />
          </div>

          {/* User Switcher Dropdown */}
          {showUserSwitcher && (
            <div
              style={{
                position: 'absolute',
                top: '105%',
                left: 0,
                width: '100%',
                backgroundColor: 'var(--bg-surface-2)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '14px',
                padding: '8px',
                boxShadow: 'var(--shadow-modal)',
                zIndex: 60,
              }}
            >
              <div
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  padding: '6px 8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Users size={12} /> Switch Active Session
              </div>
              {users.map((u) => (
                <div
                  key={u.id}
                  onClick={() => {
                    switchUser(u.id);
                    setShowUserSwitcher(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    backgroundColor: u.id === currentUser.id ? 'rgba(20, 123, 255, 0.15)' : 'transparent',
                    border: u.id === currentUser.id ? '1px solid var(--border-focus)' : '1px solid transparent',
                  }}
                >
                  <img
                    src={u.profile_image}
                    alt={u.username}
                    style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {u.display_name}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>@{u.username}</div>
                  </div>
                  {u.role === 'OWNER' && (
                    <span style={{ fontSize: '0.62rem', color: 'var(--red-electric)', fontWeight: 700 }}>
                      OWNER
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Global Search Button */}
      <button
        onClick={openSearch}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          width: '100%',
          padding: '10px 14px',
          backgroundColor: 'var(--bg-surface-2)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          color: 'var(--text-secondary)',
          fontSize: '0.86rem',
          cursor: 'pointer',
          marginBottom: '20px',
          textAlign: 'left',
          transition: 'border-color 0.2s',
        }}
      >
        <Sparkles size={16} color="var(--blue-cyan)" />
        <span style={{ flex: 1 }}>Search users & handles...</span>
        <kbd
          style={{
            fontSize: '0.7rem',
            padding: '2px 5px',
            borderRadius: '4px',
            backgroundColor: 'var(--bg-surface-3)',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          ⌘K
        </kbd>
      </button>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          const isAdminTab = item.id === 'admin';

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '12px',
                fontSize: '0.92rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                backgroundColor: isActive
                  ? isAdminTab
                    ? 'rgba(255, 23, 68, 0.16)'
                    : 'rgba(20, 123, 255, 0.16)'
                  : 'transparent',
                border: isActive
                  ? isAdminTab
                    ? '1px solid rgba(255, 23, 68, 0.4)'
                    : '1px solid rgba(20, 123, 255, 0.4)'
                  : '1px solid transparent',
                cursor: 'pointer',
                textAlign: 'left',
                position: 'relative',
                transition: 'all 0.18s var(--ease-spring)',
              }}
            >
              <Icon
                size={20}
                color={
                  isActive
                    ? isAdminTab
                      ? 'var(--red-electric)'
                      : 'var(--blue-cyan)'
                    : 'var(--text-muted)'
                }
              />
              <span style={{ flex: 1 }}>{item.label}</span>

              {item.badge !== undefined && item.badge > 0 && (
                <span
                  style={{
                    backgroundColor: 'var(--red-electric)',
                    color: '#fff',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '999px',
                    boxShadow: '0 0 10px var(--red-glow)',
                  }}
                >
                  {item.badge}
                </span>
              )}

              {isAdminTab && (
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    padding: '2px 6px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(255, 23, 68, 0.25)',
                    color: 'var(--red-electric)',
                  }}
                >
                  SECURE
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
        <button
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
            padding: '10px 14px',
            borderRadius: '12px',
            color: 'var(--text-muted)',
            fontSize: '0.88rem',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--red-electric)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
