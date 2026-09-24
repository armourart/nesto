import React from 'react';
import { MessageSquare, Phone, User, ShieldCheck, Compass, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setCurrentTab }) => {
  const { isOwner } = useAuth();
  const { totalUnreadCount } = useChat();

  const items = [
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'chats', label: 'Chats', icon: MessageSquare, badge: totalUnreadCount },
    { id: 'calls', label: 'Calls', icon: Phone },
    { id: 'notifications', label: 'Alerts', icon: Bell },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  if (isOwner) {
    items.push({ id: 'admin', label: 'Admin', icon: ShieldCheck, badge: 0 });
  }

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '64px',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        backgroundColor: 'rgba(9, 10, 15, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 50,
      }}
      className="mobile-only"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        const isAdmin = item.id === 'admin';

        return (
          <button
            key={item.id}
            onClick={() => setCurrentTab(item.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              color: isActive ? '#ffffff' : 'var(--text-muted)',
              fontSize: '0.68rem',
              fontWeight: isActive ? 600 : 500,
              cursor: 'pointer',
              position: 'relative',
              padding: '6px 12px',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ position: 'relative' }}>
              <Icon
                size={22}
                color={
                  isActive
                    ? isAdmin
                      ? 'var(--red-electric)'
                      : 'var(--blue-cyan)'
                    : 'var(--text-muted)'
                }
              />
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-8px',
                    backgroundColor: 'var(--red-electric)',
                    color: '#fff',
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </div>
            <span>{item.label}</span>
            {isActive && (
              <span
                style={{
                  position: 'absolute',
                  top: '0',
                  width: '20px',
                  height: '2px',
                  backgroundColor: isAdmin ? 'var(--red-electric)' : 'var(--blue-electric)',
                  borderRadius: '2px',
                  boxShadow: isAdmin ? '0 0 8px var(--red-glow)' : '0 0 8px var(--blue-glow)',
                }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
};
