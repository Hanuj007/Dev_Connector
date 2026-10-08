import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userApi } from '../api/userApi';
import { useAuth } from '../context/AuthContext';
import DeveloperCard from '../components/developers/DeveloperCard';
import TechPill from '../components/common/TechPill';
import { CardSkeleton } from '../components/common/Skeleton';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const [featuredDevelopers, setFeaturedDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevs = async () => {
      try {
        const users = await userApi.getAllUsers();
        setFeaturedDevelopers(users.slice(0, 3));
      } catch (err) {
        console.error('Error loading featured developers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDevs();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Editorial Hero Section */}
      <section
        style={{
          borderBottom: '1px solid var(--border-hairline)',
          paddingTop: 'clamp(3rem, 6vw, 6rem)',
          paddingBottom: 'clamp(3.5rem, 7vw, 6.5rem)',
          backgroundColor: 'var(--bg-primary)',
          position: 'relative'
        }}
      >
        <div className="app-container">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.75rem',
              maxWidth: '980px'
            }}
          >
            {/* Editorial Category Tag */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--accent)',
                fontWeight: 600
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: 'var(--accent)',
                  borderRadius: '50%'
                }}
              />
              A Platform Engineered for Technical Creators
            </div>

            {/* Massive Bold Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.75rem, 6.5vw, 5.75rem)',
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: '-0.04em',
                textTransform: 'uppercase',
                color: 'var(--text-primary)'
              }}
            >
              WHERE <br />
              DEVELOPERS <br />
              <span style={{ color: 'var(--accent)' }}>CONNECT.</span>
            </h1>

            {/* Editorial Subtitle */}
            <p
              style={{
                fontSize: 'clamp(1.1rem, 1.8vw, 1.35rem)',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                maxWidth: '680px'
              }}
            >
              One place where developers discover, connect, and collaborate. Built with an explainable matching engine that pairs engineers by shared tech stack, GitHub codebases, and real technical discussions.
            </p>

            {/* Primary / Secondary CTAs */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '1rem',
                marginTop: '0.75rem'
              }}
            >
              {isAuthenticated ? (
                <>
                  <Link to="/matching" className="btn btn-primary btn-lg">
                    Launch Matching Engine →
                  </Link>
                  <Link to="/discover" className="btn btn-outline btn-lg">
                    Browse Developers
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg">
                    Create Developer Profile →
                  </Link>
                  <Link to="/discover" className="btn btn-outline btn-lg">
                    Explore Directory
                  </Link>
                </>
              )}
            </div>

            {/* Community Live Metrics Bar */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '2.5rem',
                marginTop: '2.5rem',
                paddingTop: '2rem',
                borderTop: '1px solid var(--border-hairline)',
                fontFamily: 'var(--font-mono)'
              }}
            >
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  100%
                </div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
                  Explainable Matching
                </div>
              </div>

              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  MERN
                </div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
                  Full Stack Architecture
                </div>
              </div>

              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  GitHub
                </div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
                  Repository Sync
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Matching Engine Spotlight Section */}
      <section
        style={{
          padding: '5rem 0',
          borderBottom: '1px solid var(--border-hairline)',
          backgroundColor: 'var(--bg-secondary)'
        }}
      >
        <div className="app-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3.5rem',
              alignItems: 'center'
            }}
          >
            {/* Left: Philosophy */}
            <div>
              <div className="section-label">RECOMMENDATION ALGORITHM</div>
              <h2 className="section-title" style={{ marginTop: '0.5rem', marginBottom: '1.25rem' }}>
                FIND DEVELOPERS WHO THINK LIKE YOU.
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '1.5rem', fontSize: '1.05rem' }}>
                Traditional networks match people by job titles or generic keywords. Dev-Connector’s recommendation engine analyzes multiple technical signals:
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <li style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 800 }}>01.</span>
                  <span><strong>Explicit Skills:</strong> Declared primary languages and frameworks (+10 pts)</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 800 }}>02.</span>
                  <span><strong>GitHub Codebases:</strong> Primary repo languages & descriptions (+15 pts with recency boost)</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 800 }}>03.</span>
                  <span><strong>Discussion Topics:</strong> Technologies debated in authored posts (+10 pts)</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 800 }}>04.</span>
                  <span><strong>Technical Reactions:</strong> Posts you like build your technical affinity (+5 pts)</span>
                </li>
              </ul>

              <div style={{ marginTop: '2rem' }}>
                <Link to="/matching" className="btn btn-accent">
                  Explore Matching Engine →
                </Link>
              </div>
            </div>

            {/* Right: Visual Example Card */}
            <div>
              <div
                className="editorial-card"
                style={{
                  borderLeft: '4px solid var(--accent)',
                  padding: '2rem',
                  boxShadow: 'var(--shadow-hover)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        textTransform: 'uppercase',
                        color: 'var(--accent)',
                        fontWeight: 700,
                        letterSpacing: '0.08em'
                      }}
                    >
                      Sample Match Insight
                    </span>
                    <h3 style={{ fontSize: '1.4rem', marginTop: '0.2rem' }}>Aman Sharma</h3>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      @amansharma
                    </span>
                  </div>

                  <div className="match-score-badge">
                    <span className="score-number">92%</span>
                    <span className="score-label">MATCH</span>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--accent-subtle)',
                    border: '1px solid var(--accent-border)',
                    borderRadius: 'var(--radius-xs)',
                    padding: '0.85rem 1rem',
                    marginBottom: '1.25rem'
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 800 }}>
                    ALGORITHM REASON
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', margin: 0, fontWeight: 500 }}>
                    "You both have strong interests in React, Node.js, and MongoDB."
                  </p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
                    COMMON TECHNOLOGIES
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    <TechPill label="React" variant="accent" />
                    <TechPill label="Node.js" variant="accent" />
                    <TechPill label="MongoDB" variant="accent" />
                    <TechPill label="JavaScript" />
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-hairline)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Weighted Jaccard Similarity: 0.92
                  </span>
                  <Link to="/matching" className="btn btn-outline btn-sm">
                    Test Match
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Community Developers Section */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--bg-primary)' }}>
        <div className="app-container">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '2.5rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <div className="section-label">COMMUNITY DISCOVERY</div>
              <h2 className="section-title">ACTIVE DEVELOPERS</h2>
            </div>
            <Link to="/discover" className="btn btn-outline btn-sm">
              View All Developers →
            </Link>
          </div>

          {loading ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem'
              }}
            >
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : featuredDevelopers.length === 0 ? (
            <div className="editorial-card-muted" style={{ textAlign: 'center', padding: '3rem' }}>
              <p>No developers registered yet. Be the first to join the community!</p>
              <Link to="/register" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Create Account
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {featuredDevelopers.map((dev) => (
                <DeveloperCard key={dev._id} developer={dev} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Editorial Final Callout */}
      <section
        style={{
          padding: '5.5rem 0',
          backgroundColor: 'var(--bg-dark)',
          color: 'var(--text-inverse)'
        }}
      >
        <div className="app-container" style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: 'var(--accent)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontWeight: 700
            }}
          >
            DEV-CONNECTOR NETWORK
          </span>
          <h2
            style={{
              color: 'var(--text-inverse)',
              fontSize: 'clamp(2rem, 4vw, 3.25rem)',
              marginTop: '0.5rem',
              marginBottom: '1.25rem',
              textTransform: 'uppercase'
            }}
          >
            CONNECT. BUILD. CREATE.
          </h2>
          <p
            style={{
              color: 'var(--text-inverse-muted)',
              fontSize: '1.1rem',
              lineHeight: 1.6,
              marginBottom: '2rem'
            }}
          >
            Join other engineers sharing code, discussing technical paradigms, and discovering compatible contributors for real-world projects.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-accent btn-lg">
              Get Started Now →
            </Link>
            <Link
              to="/community"
              className="btn btn-outline btn-lg"
              style={{ color: '#fff', borderColor: '#444' }}
            >
              Read Discussions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
