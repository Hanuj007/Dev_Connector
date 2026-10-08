import React from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import EmptyState from '../components/common/EmptyState';

export const NotificationsPage = () => {
  const {
    notifications,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications();

  return (
    <div className="main-content" style={{ padding: '3.5rem 0' }}>
      <div className="app-container" style={{ maxWidth: '780px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <div className="section-label">COMMUNITY ALERTS</div>
            <h1 className="section-title">NOTIFICATIONS</h1>
            <p className="section-description">
              Alerts for new followers, discussion likes, and direct messages.
            </p>
          </div>

          {notifications.length > 0 && (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={markAllAsRead}
            >
              Mark All as Read
            </button>
          )}
        </div>

        {loading && notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            Loading alerts...
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState
            title="All Caught Up"
            description="You have no notifications right now. When someone follows you, likes your posts, or sends a message, they will appear here."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {notifications.map((notif) => {
              const sender = notif.sender || {};
              const formattedDate = notif.createdAt
                ? new Date(notif.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : '';

              let typeBadge = 'ALERT';
              if (notif.type === 'follow') typeBadge = 'FOLLOW';
              if (notif.type === 'like') typeBadge = 'LIKE';
              if (notif.type === 'message') typeBadge = 'MESSAGE';

              return (
                <div
                  key={notif._id}
                  className="editorial-card animate-fade-in"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    padding: '1.25rem 1.5rem',
                    backgroundColor: notif.isRead ? 'var(--bg-card)' : 'var(--accent-subtle)',
                    borderLeft: notif.isRead ? '1px solid var(--border-card)' : '4px solid var(--accent)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        padding: '0.2rem 0.5rem',
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: 'var(--text-primary)',
                        color: 'var(--text-inverse)',
                        fontWeight: 700
                      }}
                    >
                      {typeBadge}
                    </span>

                    <div>
                      <p
                        style={{
                          fontSize: '0.92rem',
                          color: 'var(--text-primary)',
                          margin: 0,
                          fontWeight: notif.isRead ? 400 : 600
                        }}
                      >
                        {notif.text}
                      </p>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.72rem',
                          color: 'var(--text-tertiary)',
                          marginTop: '0.2rem'
                        }}
                      >
                        {sender.name && <span>From @{sender.username || sender.name} • </span>}
                        {formattedDate}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {!notif.isRead && (
                      <button
                        type="button"
                        onClick={() => markAsRead(notif._id)}
                        className="btn btn-ghost btn-sm"
                        style={{ fontSize: '0.75rem' }}
                      >
                        Mark Read
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteNotification(notif._id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-tertiary)',
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        padding: '0.3rem',
                        lineHeight: 1
                      }}
                      title="Delete alert"
                    >
                      ×
                    </button>
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

export default NotificationsPage;
