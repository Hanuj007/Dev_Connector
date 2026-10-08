import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recommendationApi } from '../api/recommendationApi';
import { useAuth } from '../context/AuthContext';
import MatchCard from '../components/matching/MatchCard';
import ProjectMatchCard from '../components/matching/ProjectMatchCard';
import InterestBreakdown from '../components/matching/InterestBreakdown';
import { CardSkeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';

export const MatchingPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState('developers'); // 'developers' | 'projects' | 'profile'

  const [developers, setDevelopers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [interestProfile, setInterestProfile] = useState({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecommendations = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      setError(null);

      // Fetch all three recommendation data streams in parallel
      const [devsData, projectsData, profileData] = await Promise.all([
        recommendationApi.getRecommendedDevelopers({ limit: 12 }),
        recommendationApi.getRecommendedProjects({ limit: 12 }),
        recommendationApi.getUserInterestProfile()
      ]);

      setDevelopers(Array.isArray(devsData) ? devsData : []);
      setProjects(Array.isArray(projectsData) ? projectsData : []);
      setInterestProfile(profileData || {});
    } catch (err) {
      setError(err.message || 'Failed to load matching engine recommendations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [isAuthenticated]);

  return (
    <div className="main-content" style={{ padding: '3.5rem 0' }}>
      <div className="app-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-label">RECOMMENDATION ENGINE</div>
          <h1 className="section-title">MATCH / DISCOVER</h1>
          <p className="section-description">
            Find developers who think like you. Powered by a rule-based algorithm analyzing explicit skills, GitHub repositories, technical discussions, and liked posts.
          </p>
        </div>

        {/* If user is not authenticated, show editorial invitation */}
        {!isAuthenticated ? (
          <div
            className="editorial-card animate-fade-in"
            style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              backgroundColor: 'var(--bg-secondary)',
              borderLeft: '4px solid var(--accent)'
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                color: 'var(--accent)',
                letterSpacing: '0.1em',
                fontWeight: 700,
                marginBottom: '0.75rem'
              }}
            >
              Authentication Required
            </div>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem', textTransform: 'uppercase' }}>
              Personalize Your Recommendations
            </h2>
            <p
              style={{
                maxWidth: '520px',
                margin: '0 auto 2rem',
                color: 'var(--text-secondary)',
                fontSize: '1.05rem',
                lineHeight: 1.6
              }}
            >
              Sign in or create a developer account so our matching engine can compare your technology stack with active community engineers.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/login" className="btn btn-primary btn-lg">
                Sign In to Match →
              </Link>
              <Link to="/register" className="btn btn-outline btn-lg">
                Create Account
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Interactive Tab Navigation */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                borderBottom: '1px solid var(--border-hairline)',
                marginBottom: '2.5rem',
                overflowX: 'auto'
              }}
            >
              <button
                type="button"
                onClick={() => setActiveTab('developers')}
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  padding: '0.85rem 1.25rem',
                  color: activeTab === 'developers' ? 'var(--accent)' : 'var(--text-secondary)',
                  borderBottom: activeTab === 'developers' ? '2px solid var(--accent)' : '2px solid transparent',
                  background: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  whiteSpace: 'nowrap'
                }}
              >
                Developer Matches
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    backgroundColor: activeTab === 'developers' ? 'var(--accent-subtle)' : 'var(--bg-secondary)',
                    padding: '0.1rem 0.45rem',
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  {developers.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('projects')}
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  padding: '0.85rem 1.25rem',
                  color: activeTab === 'projects' ? 'var(--accent)' : 'var(--text-secondary)',
                  borderBottom: activeTab === 'projects' ? '2px solid var(--accent)' : '2px solid transparent',
                  background: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  whiteSpace: 'nowrap'
                }}
              >
                Recommended Projects
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    backgroundColor: activeTab === 'projects' ? 'var(--accent-subtle)' : 'var(--bg-secondary)',
                    padding: '0.1rem 0.45rem',
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  {projects.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  padding: '0.85rem 1.25rem',
                  color: activeTab === 'profile' ? 'var(--accent)' : 'var(--text-secondary)',
                  borderBottom: activeTab === 'profile' ? '2px solid var(--accent)' : '2px solid transparent',
                  background: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  whiteSpace: 'nowrap'
                }}
              >
                My Tech Affinity Profile
              </button>

              <button
                type="button"
                onClick={fetchRecommendations}
                className="btn btn-ghost btn-sm"
                style={{ marginLeft: 'auto', flexShrink: 0 }}
                title="Recalculate matches"
              >
                ↻ Recalculate
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div
                style={{
                  padding: '1.25rem',
                  backgroundColor: 'var(--error-bg)',
                  color: 'var(--error)',
                  borderRadius: 'var(--radius-xs)',
                  marginBottom: '2rem'
                }}
              >
                <p style={{ fontWeight: 600, margin: 0 }}>{error}</p>
              </div>
            )}

            {/* Loading State */}
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
              </div>
            ) : (
              <>
                {/* TAB 1: DEVELOPER MATCHES */}
                {activeTab === 'developers' && (
                  <div>
                    {developers.length === 0 ? (
                      <EmptyState
                        title="No Developer Matches Yet"
                        description="Your technology profile is still building! Add skills to your profile, link your GitHub repos, or author technical posts so the engine can calculate overlapping affinity."
                        actionText="Update Profile Skills"
                        onAction={() => (window.location.href = '/edit-profile')}
                      />
                    ) : (
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                          gap: '1.5rem'
                        }}
                      >
                        {developers.map((match) => (
                          <MatchCard key={match.userId} match={match} />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: RECOMMENDED PROJECTS */}
                {activeTab === 'projects' && (
                  <div>
                    {projects.length === 0 ? (
                      <EmptyState
                        title="No Project Matches Available"
                        description="When community developers sync repositories matching your technology interests, they will appear here ranked by affinity."
                      />
                    ) : (
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                          gap: '1.5rem'
                        }}
                      >
                        {projects.map((proj) => (
                          <ProjectMatchCard key={proj.projectId} project={proj} />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: USER TECH INTEREST PROFILE */}
                {activeTab === 'profile' && (
                  <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <InterestBreakdown profile={interestProfile} />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MatchingPage;
