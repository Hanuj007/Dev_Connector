import React from 'react';
import TechPill from '../common/TechPill';

const POPULAR_SKILLS = [
  'All',
  'React',
  'Node.js',
  'JavaScript',
  'MongoDB',
  'Python',
  'C++',
  'TypeScript',
  'Express',
  'Docker'
];

export const DeveloperFilters = ({
  searchQuery,
  onSearchChange,
  selectedSkill,
  onSkillSelect,
  totalCount
}) => {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      {/* Search Input Bar */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '1.25rem'
        }}
      >
        <div style={{ flex: '1 1 320px', position: 'relative' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search by name, @username, or technical skills..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              paddingLeft: '1.2rem',
              backgroundColor: 'var(--bg-card)',
              fontSize: '0.95rem'
            }}
          />
        </div>

        {totalCount !== undefined && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)'
            }}
          >
            <span style={{ fontWeight: 600, color: 'var(--text-primary)', marginRight: '0.35rem' }}>
              {totalCount}
            </span>
            developers discovered
          </div>
        )}
      </div>

      {/* Quick Skill Filter Pills */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem'
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--text-tertiary)',
            marginRight: '0.4rem',
            flexShrink: 0
          }}
        >
          Filter:
        </span>
        {POPULAR_SKILLS.map((skill) => {
          const isSelected = selectedSkill === skill || (skill === 'All' && !selectedSkill);
          return (
            <button
              key={skill}
              type="button"
              onClick={() => onSkillSelect(skill === 'All' ? '' : skill)}
              style={{
                background: isSelected ? 'var(--text-primary)' : 'var(--bg-secondary)',
                color: isSelected ? 'var(--text-inverse)' : 'var(--text-primary)',
                border: `1px solid ${isSelected ? 'var(--text-primary)' : 'var(--border-hairline)'}`,
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)'
              }}
            >
              {skill}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DeveloperFilters;
