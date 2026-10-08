import React from 'react';

export const TechPill = ({ label, variant = 'default', onRemove, onClick }) => {
  let className = 'pill';
  if (variant === 'accent') className += ' pill-accent';
  if (variant === 'dark') className += ' pill-dark';

  return (
    <span
      className={className}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(label);
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            marginLeft: '0.2rem',
            lineHeight: 1
          }}
          aria-label={`Remove ${label}`}
        >
          ×
        </button>
      )}
    </span>
  );
};

export default TechPill;
