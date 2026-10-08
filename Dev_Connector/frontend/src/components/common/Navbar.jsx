import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinkStyle = ({ isActive }) => ({
    fontFamily: 'var(--font-heading)',
    fontSize: '0.85rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: isActive ? 'var(--accent)' : 'var(--text-primary)',
    position: 'relative',
    padding: '0.4rem 0',
    transition: 'color var(--transition-fast)'
  });

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(251, 249, 245, 0.92)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border-hairline)'
      }}
    >
      <div
        className="app-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '72px'
        }}
      >
        {/* Brand Wordmark */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            textDecoration: 'none'
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              backgroundColor: 'var(--text-primary)',
              color: 'var(--accent)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '1rem',
              borderRadius: 'var(--radius-xs)'
            }}
          >
            D
          </span>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '1.25rem',
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)'
            }}
          >
            DEV—CONNECTOR
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '2.25rem'
          }}
          className="desktop-nav"
        >
          <NavLink to="/discover" style={navLinkStyle}>
            Discover
          </NavLink>

          <NavLink to="/matching" style={navLinkStyle}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              Matching
              <span
                style={{
                  fontSize: '0.65rem',
                  fontFamily: 'var(--font-mono)',
                  backgroundColor: 'var(--accent-subtle)',
                  color: 'var(--accent)',
                  border: '1px solid var(--accent-border)',
                  padding: '0.1rem 0.4rem',
                  borderRadius: 'var(--radius-xs)',
                  fontWeight: 600
                }}
              >
                ENGINE
              </span>
            </span>
          </NavLink>

          <NavLink to="/community" style={navLinkStyle}>
            Community
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink to="/messages" style={navLinkStyle}>
                Messages
              </NavLink>
              <NavLink to="/notifications" style={navLinkStyle}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  Alerts
                  {unreadCount > 0 && (
                    <span
                      style={{
                        backgroundColor: 'var(--accent)',
                        color: '#fff',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '0.1rem 0.45rem',
                        borderRadius: 'var(--radius-full)',
                        lineHeight: 1
                      }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </span>
              </NavLink>
            </>
          )}
        </nav>

        {/* Desktop Actions / Auth CTA */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '1rem'
          }}
          className="desktop-actions"
        >
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link
                to={`/profile/${user?._id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  textDecoration: 'none',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-hairline)',
                  backgroundColor: 'var(--bg-secondary)',
                  transition: 'border-color var(--transition-fast)'
                }}
                title="View your portfolio"
              >
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <span
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--text-primary)',
                      color: 'var(--text-inverse)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700
                    }}
                  >
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                )}
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)'
                  }}
                >
                  {user?.name?.split(' ')[0] || 'Profile'}
                </span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-ghost btn-sm"
                title="Log out of Dev-Connector"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Join Community
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-toggle"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            padding: '0.5rem',
            cursor: 'pointer'
          }}
          aria-label="Toggle navigation menu"
        >
          <span
            style={{
              width: '22px',
              height: '2px',
              backgroundColor: 'var(--text-primary)',
              transition: 'transform var(--transition-fast)'
            }}
          />
          <span
            style={{
              width: '22px',
              height: '2px',
              backgroundColor: 'var(--text-primary)',
              transition: 'opacity var(--transition-fast)'
            }}
          />
          <span
            style={{
              width: '22px',
              height: '2px',
              backgroundColor: 'var(--text-primary)',
              transition: 'transform var(--transition-fast)'
            }}
          />
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="mobile-drawer animate-fade-in"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-hairline)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}
        >
          <NavLink
            to="/discover"
            style={navLinkStyle}
            onClick={() => setMobileMenuOpen(false)}
          >
            Discover Developers
          </NavLink>
          <NavLink
            to="/matching"
            style={navLinkStyle}
            onClick={() => setMobileMenuOpen(false)}
          >
            Matching Engine
          </NavLink>
          <NavLink
            to="/community"
            style={navLinkStyle}
            onClick={() => setMobileMenuOpen(false)}
          >
            Community Discussions
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink
                to="/messages"
                style={navLinkStyle}
                onClick={() => setMobileMenuOpen(false)}
              >
                Direct Messages
              </NavLink>
              <NavLink
                to="/notifications"
                style={navLinkStyle}
                onClick={() => setMobileMenuOpen(false)}
              >
                Notifications {unreadCount > 0 && `(${unreadCount})`}
              </NavLink>
              <NavLink
                to={`/profile/${user?._id}`}
                style={navLinkStyle}
                onClick={() => setMobileMenuOpen(false)}
              >
                My Portfolio Profile
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
                style={{ marginTop: '0.5rem', width: '100%' }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Link
                to="/login"
                className="btn btn-outline"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn btn-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Join Community
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Embedded CSS for responsive navbar toggle */}
      <style>{`
        @media (min-width: 860px) {
          .desktop-nav { display: flex !important; }
          .desktop-actions { display: flex !important; }
          .mobile-toggle { display: none !important; }
          .mobile-drawer { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
