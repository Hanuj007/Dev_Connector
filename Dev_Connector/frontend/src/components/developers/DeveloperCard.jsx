import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TechPill from '../common/TechPill';
import { useAuth } from '../../context/AuthContext';
import { followApi } from '../../api/followApi';
import { useToast } from '../common/Toast';

export const DeveloperCard = ({ developer, isFollowingInitial = false, onFollowChange }) => {
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [isFollowing, setIsFollowing] = useState(isFollowingInitial);
  const [followLoading, setFollowLoading] = useState(false);

  const isSelf = user?._id === developer._id;

  const handleToggleFollow = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      addToast('Please sign in to follow developers', 'info');
      return;
    }

    try {
      setFollowLoading(true);
      if (isFollowing) {
        await followApi.unfollowUser(developer._id);
        setIsFollowing(false);
        addToast(`Unfollowed ${developer.name}`, 'info');
        if (onFollowChange) onFollowChange(developer._id, false);
      } else {
        await followApi.followUser(developer._id);
        setIsFollowing(true);
        addToast(`Now following ${developer.name}`, 'success');
        if (onFollowChange) onFollowChange(developer._id, true);
      }
    } catch (err) {
      addToast(err.message || 'Follow action failed', 'error');
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <div className="editorial-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header with Avatar & Details */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
        <Link
          to={`/profile/${developer._id}`}
          style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none' }}
        >
          {developer.profileImage ? (
            <img
              src={developer.profileImage}
              alt={developer.name}
              style={{
                width: '54px',
                height: '54px',
                borderRadius: 'var(--radius-xs)',
                objectFit: 'cover',
                border: '1px solid var(--border-hairline)'
              }}
            />
          ) : (
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-card)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '1.35rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {developer.name ? developer.name.charAt(0).toUpperCase() : 'D'}
            </div>
          )}

          <div>
            <h3
              style={{
                fontSize: '1.15rem',
                marginBottom: '0.15rem',
                transition: 'color var(--transition-fast)'
              }}
            >
              {developer.name}
            </h3>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)'
              }}
            >
              @{developer.username || developer.email?.split('@')[0] || 'developer'}
            </span>
          </div>
        </Link>

        {/* Follow Button if not self */}
        {!isSelf && (
          <button
            type="button"
            className={`btn btn-sm ${isFollowing ? 'btn-outline' : 'btn-primary'}`}
            onClick={handleToggleFollow}
            disabled={followLoading}
            style={{ minWidth: '85px' }}
          >
            {followLoading ? '...' : isFollowing ? 'Following' : 'Follow'}
          </button>
        )}
      </div>

      {/* Bio */}
      <p
        style={{
          fontSize: '0.9rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          marginBottom: '1.25rem',
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}
      >
        {developer.bio || 'Curating technical architectures and writing code on Dev-Connector.'}
      </p>

      {/* Skills / Tech Stack */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.4rem'
          }}
        >
          {Array.isArray(developer.skills) && developer.skills.length > 0 ? (
            developer.skills.slice(0, 4).map((skill, index) => (
              <TechPill key={index} label={skill} />
            ))
          ) : (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
              No listed skills yet
            </span>
          )}
          {developer.skills && developer.skills.length > 4 && (
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                alignSelf: 'center'
              }}
            >
              +{developer.skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Card Footer with Link */}
      <div
        style={{
          borderTop: '1px solid var(--border-hairline)',
          paddingTop: '1rem',
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Link
          to={`/profile/${developer._id}`}
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.82rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          View Portfolio <span style={{ color: 'var(--accent)' }}>→</span>
        </Link>

        {developer.githubUsername && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--text-tertiary)'
            }}
          >
            gh:{developer.githubUsername}
          </span>
        )}
      </div>
    </div>
  );
};

export default DeveloperCard;
