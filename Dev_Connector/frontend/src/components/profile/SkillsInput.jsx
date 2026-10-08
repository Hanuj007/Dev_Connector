import React, { useState, useRef, useEffect } from 'react';
import { POPULAR_SKILLS, searchSkills } from '../../data/skillsData';

/**
 * LinkedIn-style Skills Selection Component
 * Supports popular suggestions, dynamic typeahead search, selected chips with remove X,
 * keyboard Enter addition, duplicate prevention, and outside-click dismiss.
 */
export const SkillsInput = ({
  selectedSkills = [],
  onChange,
  disabled = false,
  maxSkills = 30
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Filter skills based on current search query
  const suggestions = searchSkills(query, selectedSkills);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset highlight index when suggestions change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [suggestions.length, query]);

  const addSkill = (skillToAdd) => {
    if (!skillToAdd || !skillToAdd.trim() || disabled) return;
    const trimmed = skillToAdd.trim();

    // Check for duplicates (case-insensitive)
    const exists = selectedSkills.some(
      (s) => s.toLowerCase() === trimmed.toLowerCase()
    );

    if (!exists) {
      const nextSkills = [...selectedSkills, trimmed];
      onChange(nextSkills);
    }

    setQuery('');
    setIsOpen(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const removeSkill = (indexToRemove) => {
    if (disabled) return;
    const nextSkills = selectedSkills.filter((_, idx) => idx !== indexToRemove);
    onChange(nextSkills);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (isOpen) {
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isOpen && suggestions.length > 0 && suggestions[highlightedIndex]) {
        addSkill(suggestions[highlightedIndex]);
      } else if (query.trim()) {
        addSkill(query.trim());
      }
    } else if (e.key === 'Backspace' && !query && selectedSkills.length > 0) {
      // Remove last skill on backspace if input is empty
      removeSkill(selectedSkills.length - 1);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Popular skills available to quickly add (excluding already selected)
  const availablePopular = POPULAR_SKILLS.filter(
    (pop) =>
      !selectedSkills.some((s) => s.toLowerCase() === pop.toLowerCase())
  );

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {/* LinkedIn-style Multi-Select Input Box */}
      <div
        onClick={() => {
          if (!disabled && inputRef.current) {
            inputRef.current.focus();
            setIsOpen(true);
          }
        }}
        style={{
          minHeight: '48px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.45rem 0.65rem',
          backgroundColor: disabled ? 'var(--bg-secondary)' : 'var(--bg-card)',
          border: isOpen
            ? '1px solid var(--accent)'
            : '1px solid var(--border-input, var(--border-hairline))',
          borderRadius: 'var(--radius-xs)',
          cursor: disabled ? 'not-allowed' : 'text',
          boxShadow: isOpen ? '0 0 0 2px var(--accent-subtle, rgba(235, 74, 42, 0.15))' : 'none',
          transition: 'all var(--transition-fast)'
        }}
      >
        {/* Selected Skill Chips */}
        {selectedSkills.map((skill, index) => (
          <span
            key={`${skill}-${index}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: 'var(--accent)',
              color: '#ffffff',
              padding: '0.25rem 0.6rem',
              borderRadius: '999px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.02em',
              lineHeight: 1.2,
              userSelect: 'none',
              animation: 'fadeIn 0.15s ease-in'
            }}
          >
            <span>{skill}</span>
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSkill(index);
                }}
                aria-label={`Remove ${skill}`}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '0.95rem',
                  lineHeight: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  opacity: 0.85,
                  transition: 'opacity 0.15s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.85')}
              >
                ×
              </button>
            )}
          </span>
        ))}

        {/* Text Input for Typing & Searching */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          disabled={disabled || selectedSkills.length >= maxSkills}
          placeholder={
            selectedSkills.length === 0
              ? 'Click to choose or type a skill (e.g. React, Python, Java)...'
              : selectedSkills.length >= maxSkills
              ? 'Max skills reached'
              : 'Add another skill...'
          }
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          style={{
            flex: '1 1 140px',
            minWidth: '120px',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: 'var(--text-primary)',
            fontSize: '0.92rem',
            fontFamily: 'inherit',
            padding: '0.25rem 0.2rem'
          }}
        />
      </div>

      {/* Dropdown / Suggestion List */}
      {isOpen && !disabled && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 100,
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-hairline)',
            borderRadius: 'var(--radius-xs)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            maxHeight: '260px',
            overflowY: 'auto'
          }}
        >
          {/* Header label in dropdown */}
          <div
            style={{
              padding: '0.5rem 0.85rem',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-tertiary)',
              borderBottom: '1px solid var(--border-hairline)',
              backgroundColor: 'var(--bg-secondary)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>{query.trim() ? `Search Results for "${query}"` : 'Popular Skill Suggestions'}</span>
            <span style={{ fontSize: '0.68rem' }}>Enter ↵ to add</span>
          </div>

          {suggestions.length > 0 ? (
            suggestions.slice(0, 20).map((skill, index) => {
              const isHighlighted = index === highlightedIndex;
              return (
                <div
                  key={skill}
                  onMouseDown={(e) => {
                    // onMouseDown fires before onBlur
                    e.preventDefault();
                    addSkill(skill);
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  style={{
                    padding: '0.65rem 0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: isHighlighted ? 'var(--accent-subtle, rgba(235, 74, 42, 0.08))' : 'transparent',
                    color: isHighlighted ? 'var(--accent)' : 'var(--text-primary)',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.9rem',
                    fontWeight: isHighlighted ? 600 : 500,
                    borderBottom: '1px solid var(--border-hairline)'
                  }}
                >
                  <span>{skill}</span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: isHighlighted ? 'var(--accent)' : 'var(--text-tertiary)'
                    }}
                  >
                    + Add
                  </span>
                </div>
              );
            })
          ) : query.trim() ? (
            <div
              onMouseDown={(e) => {
                e.preventDefault();
                addSkill(query.trim());
              }}
              style={{
                padding: '0.75rem 0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'var(--accent-subtle, rgba(235, 74, 42, 0.08))',
                color: 'var(--accent)',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.9rem',
                fontWeight: 600
              }}
            >
              <span>Add custom skill: "{query.trim()}"</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>+ Add</span>
            </div>
          ) : (
            <div
              style={{
                padding: '1rem',
                textAlign: 'center',
                color: 'var(--text-tertiary)',
                fontSize: '0.85rem'
              }}
            >
              All popular skills have already been added! Type to search more.
            </div>
          )}
        </div>
      )}

      {/* Quick Select Popular Skills Chips below input (when not actively searching) */}
      {!disabled && availablePopular.length > 0 && (
        <div style={{ marginTop: '0.75rem' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-tertiary)',
              marginBottom: '0.4rem'
            }}
          >
            Popular Suggestions (click to add):
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {availablePopular.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => addSkill(skill)}
                className="skill-pill-suggestion"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-hairline)',
                  borderRadius: '999px',
                  padding: '0.2rem 0.65rem',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.color = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-hairline)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <span>+</span>
                <span>{skill}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsInput;
