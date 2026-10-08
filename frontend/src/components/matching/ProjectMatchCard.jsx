import React from 'react';
import TechPill from '../common/TechPill';

export const ProjectMatchCard = ({ project }) => {
  const {
    projectName,
    description,
    language,
    htmlUrl,
    stars,
    forks,
    author,
    matchScore,
    matchingTechnologies,
    reason
  } = project;

  return (
    <div
      className="editorial-card animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: '100%',
        borderLeft: '4px solid var(--text-primary)'
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1rem'
        }}
      >
        <div>
          <h3
            style={{
              fontSize: '1.2rem',
              marginBottom: '0.2rem',
              wordBreak: 'break-word'
            }}
          >
            {projectName}
          </h3>
          {author && (
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)'
              }}
            >
              by @{author.username || author.name || 'creator'}
            </span>
          )}
        </div>

        {/* Match Score Badge */}
        <div className="match-score-badge">
          <span className="score-number">{matchScore}%</span>
          <span className="score-label">Affinity</span>
        </div>
      </div>

      {/* Algorithm Reason */}
      <div
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-hairline)',
          borderRadius: 'var(--radius-xs)',
          padding: '0.65rem 0.85rem',
          marginBottom: '1rem'
        }}
      >
        <p
          style={{
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            margin: 0,
            lineHeight: 1.45
          }}
        >
          {reason || 'Matches your recent activity and primary language.'}
        </p>
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: '0.88rem',
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
        {description || 'Open-source repository created and shared by community developer.'}
      </p>

      {/* Repository Stats Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem',
          color: 'var(--text-secondary)',
          marginBottom: '1.25rem'
        }}
      >
        {language && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent)'
              }}
            />
            {language}
          </span>
        )}
        <span>★ {stars || 0}</span>
        <span>⑂ {forks || 0}</span>
      </div>

      {/* Matching Technologies Tags */}
      <div style={{ marginBottom: '1.5rem', marginTop: 'auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {Array.isArray(matchingTechnologies) &&
            matchingTechnologies.map((tech, idx) => (
              <TechPill key={idx} label={tech} />
            ))}
        </div>
      </div>

      {/* Card Action */}
      <div
        style={{
          borderTop: '1px solid var(--border-hairline)',
          paddingTop: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <a
          href={htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline btn-sm"
          style={{ width: '100%' }}
        >
          View on GitHub ↗
        </a>
      </div>
    </div>
  );
};

export default ProjectMatchCard;
