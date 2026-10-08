import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TechPill from '../common/TechPill';
import { useAuth } from '../../context/AuthContext';
import { followApi } from '../../api/followApi';
import { useToast } from '../common/Toast';

export const ProfileHeader = ({
  profileUser,
  followersCount = 0,
  followingCount = 0,
  isFollowingInitial = false,
  onOpenFollowers,
  onOpenFollowing
}) => {
  const { user: currentUser, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [isFollowing, setIsFollowing] = useState(isFollowingInitial);
  const [followLoading, setFollowLoading] = useState(false);

  const isSelf = currentUser?._id === profileUser._id;

  const handleToggleFollow = async () => {
    if (!isAuthenticated) {
      addToast('Please sign in to follow developers', 'info');
      navigate('/login');
      return;
    }

    try {
      setFollowLoading(true);
      if (isFollowing) {
        await followApi.unfollowUser(profileUser._id);
        setIsFollowing(false);
        addToast(`Unfollowed ${profileUser.name}`, 'info');
      } else {
        await followApi.followUser(profileUser._id);
        setIsFollowing(true);
        addToast(`Now following ${profileUser.name}`, 'success');
      }
    } catch (err) {
      addToast(err.message || 'Follow action failed', 'error');
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <div
      className="editorial-card"
      style={{
        marginBottom: '2.5rem',
        padding: '2.5rem 2rem',
        borderLeft: isSelf ? '4px solid var(--text-primary)' : '4px solid var(--accent)'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '2rem'
        }}
      >
        {/* Left: Avatar & Identity */}
        <div style={{ display: 'flex', gap: '1.75rem', flex: '1 1 450px' }}>
          {profileUser.profileImage ? (
            <img
              src={profileUser.profileImage}
              alt={profileUser.name}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: 'var(--radius-xs)',
                objectFit: 'cover',
                border: '1px solid var(--border-hairline)',
                flexShrink: 0
              }}
            />
          ) : (
            <div
              style={{
                width: '100px',
                height: '100px',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: 'var(--bg-dark)',
                color: 'var(--text-inverse)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '2.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              {profileUser.name ? profileUser.name.charAt(0).toUpperCase() : 'D'}
            </div>
          )}

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.35rem)', letterSpacing: '-0.03em' }}>
                {profileUser.name}
              </h1>
              {isSelf && (
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-hairline)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: 'var(--radius-xs)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  YOU
                </span>
              )}
            </div>

            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                flexWrap: 'wrap'
              }}
            >
              <span>@{profileUser.username || profileUser.email?.split('@')[0] || 'developer'}</span>
              {profileUser.githubUsername && (
                <a
                  href={`https://github.com/${profileUser.githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--accent)', textDecoration: 'none' }}
                >
                  github.com/{profileUser.githubUsername} ↗
                </a>
              )}
            </div>

            {/* Bio */}
            <p
              style={{
                fontSize: '0.95rem',
                color: 'var(--text-primary)',
                lineHeight: 1.6,
                maxWidth: '620px',
                marginBottom: '1.25rem'
              }}
            >
              {profileUser.bio || 'Curating technical architectures and writing code on Dev-Connector.'}
            </p>

            {/* Skills Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {Array.isArray(profileUser.skills) && profileUser.skills.length > 0 ? (
                profileUser.skills.map((skill, index) => (
                  <TechPill key={index} label={skill} />
                ))
              ) : (
                <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                  No skills listed yet
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Stats & Actions */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            alignItems: 'flex-start'
          }}
        >
          {/* Followers / Following Counter Buttons */}
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <button
              type="button"
              onClick={onOpenFollowers}
              style={{
                cursor: 'pointer',
                textAlign: 'left',
                border: 'none',
                background: 'none'
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)'
                }}
              >
                {followersCount}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  color: 'var(--text-secondary)'
                }}
              >
                Followers
              </div>
            </button>

            <button
              type="button"
              onClick={onOpenFollowing}
              style={{
                cursor: 'pointer',
                textAlign: 'left',
                border: 'none',
                background: 'none'
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)'
                }}
              >
                {followingCount}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  color: 'var(--text-secondary)'
                }}
              >
                Following
              </div>
            </button>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {isSelf ? (
              <Link to="/edit-profile" className="btn btn-outline btn-sm">
                Edit Profile
              </Link>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleToggleFollow}
                  disabled={followLoading}
                  className={`btn btn-sm ${isFollowing ? 'btn-outline' : 'btn-primary'}`}
                  style={{ minWidth: '100px' }}
                >
                  {followLoading ? '...' : isFollowing ? 'Following' : 'Follow'}
                </button>
                <Link
                  to={`/messages?userId=${profileUser._id}`}
                  className="btn btn-outline btn-sm"
                >
                  Direct Message
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
