import React from 'react';
import { Link } from 'react-router-dom';
import TechPill from '../common/TechPill';

export const MatchCard = ({ match }) => {
  const {
    userId,
    name,
    username,
    bio,
    profileImage,
    skills,
    matchScore,
    matchingTechnologies,
    reason
  } = match;

  return (
    <div
      className="editorial-card animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        borderLeft: '4px solid var(--accent)'
      }}
    >
      {/* Top bar with Score Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.25rem'
        }}
      >
        <Link
          to={`/profile/${userId}`}
          style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none' }}
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt={name}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-xs)',
                objectFit: 'cover',
                border: '1px solid var(--border-hairline)'
              }}
            />
          ) : (
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-card)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '1.4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {name ? name.charAt(0).toUpperCase() : 'M'}
            </div>
          )}

          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.15rem' }}>{name}</h3>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)'
              }}
            >
              @{username || 'developer'}
            </span>
          </div>
        </Link>

        {/* Compatibility Match Score Badge */}
        <div className="match-score-badge">
          <span className="score-number">{matchScore}%</span>
          <span className="score-label">Match</span>
        </div>
      </div>

      {/* Explainable Matching Reason from Backend Engine */}
      <div
        style={{
          backgroundColor: 'var(--accent-subtle)',
          border: '1px solid var(--accent-border)',
          borderRadius: 'var(--radius-xs)',
          padding: '0.75rem 1rem',
          marginBottom: '1.25rem'
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--accent)',
            fontWeight: 800,
            marginBottom: '0.2rem'
          }}
        >
          Algorithm Insight
        </div>
        <p
          style={{
            fontSize: '0.86rem',
            color: 'var(--text-primary)',
            lineHeight: 1.45,
            fontWeight: 500,
            margin: 0
          }}
        >
          {reason || 'High stack overlap identified across repositories and activity.'}
        </p>
      </div>

      {/* Bio excerpt */}
      {bio && (
        <p
          style={{
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            marginBottom: '1.25rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {bio}
        </p>
      )}

      {/* Matching Overlap Technologies */}
      <div style={{ marginBottom: '1.5rem', marginTop: 'auto' }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--text-tertiary)',
            marginBottom: '0.5rem'
          }}
        >
          Overlapping Tech Stack
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {Array.isArray(matchingTechnologies) && matchingTechnologies.length > 0 ? (
            matchingTechnologies.map((tech, idx) => (
              <TechPill key={idx} label={tech} variant="accent" />
            ))
          ) : (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
              Shared general affinity
            </span>
          )}
        </div>
      </div>

      {/* Card Action Links */}
      <div
        style={{
          borderTop: '1px solid var(--border-hairline)',
          paddingTop: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        <Link
          to={`/profile/${userId}`}
          className="btn btn-primary btn-sm"
          style={{ flex: 1 }}
        >
          Inspect Profile
        </Link>
        <Link
          to={`/messages?userId=${userId}`}
          className="btn btn-outline btn-sm"
          style={{ flex: 1 }}
        >
          Direct Message
        </Link>
      </div>
    </div>
  );
};

export default MatchCard;
