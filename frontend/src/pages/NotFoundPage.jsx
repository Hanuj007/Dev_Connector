import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5rem 1.5rem',
        textAlign: 'center'
      }}
    >
      <div style={{ maxWidth: '500px' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '1rem',
            color: 'var(--accent)',
            fontWeight: 800
          }}
        >
          ERROR 404
        </span>
        <h1
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            margin: '0.5rem 0 1rem',
            textTransform: 'uppercase'
          }}
        >
          PAGE NOT FOUND
        </h1>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '1.05rem',
            lineHeight: 1.6,
            marginBottom: '2rem'
          }}
        >
          The resource or developer directory route you requested does not exist or has been relocated.
        </p>
        <Link to="/" className="btn btn-primary">
          Return to Platform Home →
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
