import React from 'react';
import { Link } from 'react-router-dom';
import Modal from '../common/Modal';

export const FollowModal = ({ isOpen, onClose, title, users = [] }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      {users.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)' }}>
          No developers found.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {users.map((item) => {
            // Backend follow records have user in item.follower or item.following, or flat user
            const dev = item.follower || item.following || item;
            if (!dev || !dev._id) return null;

            return (
              <div
                key={dev._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-hairline)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {dev.profileImage ? (
                    <img
                      src={dev.profileImage}
                      alt={dev.name}
                      style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-xs)', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: 'var(--text-primary)',
                        color: 'var(--text-inverse)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 700,
                        fontSize: '0.9rem'
                      }}
                    >
                      {dev.name ? dev.name.charAt(0).toUpperCase() : 'D'}
                    </div>
                  )}

                  <div>
                    <h4 style={{ fontSize: '0.95rem', margin: 0 }}>{dev.name}</h4>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      @{dev.username || dev.email?.split('@')[0] || 'developer'}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/profile/${dev._id}`}
                  className="btn btn-outline btn-sm"
                  onClick={onClose}
                >
                  View
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
};

export default FollowModal;
