import React from 'react';

export const Skeleton = ({ width = '100%', height = '1rem', borderRadius = 'var(--radius-xs)', style }) => {
  return (
    <div
      className="skeleton"
      style={{
        width,
        height,
        borderRadius,
        ...style
      }}
    />
  );
};

export const CardSkeleton = () => {
  return (
    <div className="editorial-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Skeleton width="48px" height="48px" borderRadius="50%" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <Skeleton width="60%" height="1.1rem" />
          <Skeleton width="40%" height="0.8rem" />
        </div>
      </div>
      <Skeleton width="90%" height="0.9rem" />
      <Skeleton width="75%" height="0.9rem" />
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <Skeleton width="60px" height="24px" borderRadius="var(--radius-full)" />
        <Skeleton width="80px" height="24px" borderRadius="var(--radius-full)" />
        <Skeleton width="50px" height="24px" borderRadius="var(--radius-full)" />
      </div>
    </div>
  );
};

export default Skeleton;
