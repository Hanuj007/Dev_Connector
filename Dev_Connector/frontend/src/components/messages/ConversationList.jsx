import React from 'react';

export const ConversationList = ({ users = [], activeUserId, onSelectUser }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
        overflowY: 'auto'
      }}
    >
      {users.length === 0 ? (
        <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
          No developers found.
        </div>
      ) : (
        users.map((dev) => {
          const isActive = dev._id === activeUserId;
          return (
            <button
              key={dev._id}
              type="button"
              onClick={() => onSelectUser(dev)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: isActive ? 'var(--text-primary)' : 'var(--bg-card)',
                color: isActive ? 'var(--text-inverse)' : 'var(--text-primary)',
                border: `1px solid ${isActive ? 'var(--text-primary)' : 'var(--border-hairline)'}`,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--transition-fast)',
                width: '100%'
              }}
            >
              {dev.profileImage ? (
                <img
                  src={dev.profileImage}
                  alt={dev.name}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-xs)',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: isActive ? 'var(--accent)' : 'var(--bg-secondary)',
                    color: isActive ? '#fff' : 'var(--text-primary)',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {dev.name ? dev.name.charAt(0).toUpperCase() : 'D'}
                </div>
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {dev.name}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: isActive ? 'var(--text-inverse-muted)' : 'var(--text-secondary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  @{dev.username || dev.email?.split('@')[0] || 'developer'}
                </div>
              </div>
            </button>
          );
        })
      )}
    </div>
  );
};

export default ConversationList;
