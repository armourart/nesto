import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { storage } from '../../services/storage';
import { NotificationItem } from '../../types';
import { Bell, MessageSquare, Phone, ShieldCheck, CheckCheck } from 'lucide-react';

interface NotificationsDrawerProps {
  onOpenConversation: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({ onOpenConversation }) => {
  const { currentUser } = useAuth();
  const { openOrCreateConversationWith } = useChat();
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    currentUser ? storage.getNotifications(currentUser.id) : []
  );

  useEffect(() => {
    if (!currentUser) return;
    setNotifications(storage.getNotifications(currentUser.id));
    const unsub = storage.subscribe((event) => {
      if (['NOTIFICATION_ADDED', 'NOTIFICATIONS_READ'].includes(event)) {
        setNotifications(storage.getNotifications(currentUser.id));
      }
    });
    return unsub;
  }, [currentUser]);

  if (!currentUser) return null;

  const handleMarkAllRead = () => {
    storage.markNotificationsRead(currentUser.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleItemClick = (item: NotificationItem) => {
    if (item.link_conversation_id) {
      onOpenConversation();
    }
  };

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
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bell size={22} color="var(--blue-cyan)" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
              Notifications
            </h2>
          </div>

          {notifications.some((n) => !n.read) && (
            <button
              onClick={handleMarkAllRead}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            >
              <CheckCheck size={16} />
              <span>Mark all read</span>
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="glass-card" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Bell size={36} color="var(--border-subtle)" style={{ marginBottom: '12px' }} />
            <p style={{ fontSize: '0.92rem' }}>You're all caught up! No unread notifications.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {notifications.map((item) => {
              const isCall = item.type === 'call';
              const isMsg = item.type === 'message';

              return (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="glass-card"
                  style={{
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    cursor: 'pointer',
                    borderLeft: item.read ? '1px solid var(--border-subtle)' : '3px solid var(--blue-electric)',
                    backgroundColor: item.read ? 'var(--bg-surface-2)' : 'rgba(20, 123, 255, 0.08)',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: isCall ? 'rgba(255, 23, 68, 0.2)' : 'rgba(20, 123, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {isCall ? (
                      <Phone size={18} color="var(--red-electric)" />
                    ) : isMsg ? (
                      <MessageSquare size={18} color="var(--blue-cyan)" />
                    ) : (
                      <ShieldCheck size={18} color="#10b981" />
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
                        {item.title}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {item.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
