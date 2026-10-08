import React from 'react';

export const EmptyState = ({
  icon,
  title = 'No records found',
  description = 'There is nothing to display here right now.',
  actionText,
  onAction
}) => {
  return (
    <div
      style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px dashed var(--border-card)',
        borderRadius: 'var(--radius-sm)',
        margin: '1.5rem 0'
      }}
      className="animate-fade-in"
    >
      {icon && (
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-tertiary)' }}>
          {icon}
        </div>
      )}
      <h3
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.35rem',
          textTransform: 'uppercase',
          letterSpacing: '-0.02em',
          marginBottom: '0.5rem',
          color: 'var(--text-primary)'
        }}
      >
        {title}
      </h3>
      <p style={{ maxWidth: '420px', color: 'var(--text-secondary)', marginBottom: actionText ? '1.5rem' : '0' }}>
        {description}
      </p>
      {actionText && onAction && (
        <button type="button" className="btn btn-primary" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
