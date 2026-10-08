import React, { useState, useEffect, useMemo } from 'react';
import { userApi } from '../api/userApi';
import DeveloperCard from '../components/developers/DeveloperCard';
import DeveloperFilters from '../components/developers/DeveloperFilters';
import { CardSkeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';

export const DiscoverPage = () => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  const fetchDevelopers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userApi.getAllUsers();
      setDevelopers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load developers directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const filteredDevelopers = useMemo(() => {
    return developers.filter((dev) => {
      // 1. Search Query filter (name, username, bio, skills)
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (dev.name && dev.name.toLowerCase().includes(q)) ||
        (dev.username && dev.username.toLowerCase().includes(q)) ||
        (dev.bio && dev.bio.toLowerCase().includes(q)) ||
        (Array.isArray(dev.skills) && dev.skills.some((s) => s.toLowerCase().includes(q)));

      // 2. Skill pill filter
      const matchesSkill =
        !selectedSkill ||
        (Array.isArray(dev.skills) &&
          dev.skills.some((s) => s.toLowerCase() === selectedSkill.toLowerCase()));

      return matchesSearch && matchesSkill;
    });
  }, [developers, searchQuery, selectedSkill]);

  return (
    <div className="main-content" style={{ padding: '3.5rem 0' }}>
      <div className="app-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-label">COMMUNITY DIRECTORY</div>
          <h1 className="section-title">EXPLORE DEVELOPERS</h1>
          <p className="section-description">
            Discover fellow technical builders, inspect their public code repositories, and filter by tech stacks.
          </p>
        </div>

        {/* Filter Controls */}
        <DeveloperFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedSkill={selectedSkill}
          onSkillSelect={setSelectedSkill}
          totalCount={filteredDevelopers.length}
        />

        {/* Content Rendering */}
        {loading ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.5rem'
            }}
          >
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : error ? (
          <div
            style={{
              padding: '2rem',
              backgroundColor: 'var(--error-bg)',
              color: 'var(--error)',
              borderRadius: 'var(--radius-xs)',
              textAlign: 'center'
            }}
          >
            <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Failed to load directory</p>
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</p>
            <button type="button" className="btn btn-outline btn-sm" onClick={fetchDevelopers}>
              Try Again
            </button>
          </div>
        ) : filteredDevelopers.length === 0 ? (
          <EmptyState
            title="No developers matched your filters"
            description="Try changing your search terms or selecting a different technology skill filter."
            actionText="Reset Filters"
            onAction={() => {
              setSearchQuery('');
              setSelectedSkill('');
            }}
          />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {filteredDevelopers.map((dev) => (
              <DeveloperCard key={dev._id} developer={dev} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverPage;
