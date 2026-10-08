import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-hairline)',
        marginTop: 'auto',
        padding: '4.5rem 0 3rem'
      }}
    >
      <div className="app-container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '3rem',
            marginBottom: '3.5rem'
          }}
        >
          {/* Column 1: Brand & Manifesto */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                marginBottom: '1.25rem'
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '26px',
                  height: '26px',
                  backgroundColor: 'var(--text-primary)',
                  color: 'var(--accent)',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  borderRadius: 'var(--radius-xs)'
                }}
              >
                D
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: '1.15rem',
                  letterSpacing: '-0.03em',
                  textTransform: 'uppercase'
                }}
              >
                DEV—CONNECTOR
              </span>
            </div>
            <p style={{ maxWidth: '320px', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              A curated network engineered for developers. Discover kindred engineers, compare technical affinities via our matching engine, and collaborate with intention.
            </p>
          </div>

          {/* Column 2: Platform Navigation */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '1.25rem',
                color: 'var(--text-primary)'
              }}
            >
              Platform
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <Link to="/discover" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Developer Directory
                </Link>
              </li>
              <li>
                <Link to="/matching" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Recommendation Engine
                </Link>
              </li>
              <li>
                <Link to="/community" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Community Discussions
                </Link>
              </li>
              <li>
                <Link to="/register" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Create Developer Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Matching Philosophy */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '1.25rem',
                color: 'var(--text-primary)'
              }}
            >
              Technology Affinity
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
              Recommendations are computed using weighted Jaccard similarity across explicit skills, GitHub repositories, authored posts, and technical reactions.
            </p>
            <span
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--accent)',
                backgroundColor: 'var(--accent-subtle)',
                border: '1px solid var(--accent-border)',
                padding: '0.25rem 0.6rem',
                borderRadius: 'var(--radius-xs)'
              }}
            >
              Rule-Based • Explainable • Fair
            </span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-hairline)',
            paddingTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.82rem',
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-mono)'
          }}
        >
          <div>
            © {new Date().getFullYear()} DEV-CONNECTOR. ALL RIGHTS RESERVED.
          </div>
          <div>
            ARCHITECTED WITH MERN & REACT
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
