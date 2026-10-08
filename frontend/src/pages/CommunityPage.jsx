import React, { useState, useEffect } from 'react';
import { postApi } from '../api/postApi';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/posts/PostCard';
import CreatePostModal from '../components/posts/CreatePostModal';
import { CardSkeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import { useToast } from '../components/common/Toast';

export const CommunityPage = () => {
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await postApi.getAllPosts();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load community discussions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostDeleted = (deletedId) => {
    setPosts((prev) => prev.filter((p) => p._id !== deletedId));
  };

  const handleOpenCreate = () => {
    if (!isAuthenticated) {
      addToast('Please sign in to publish a discussion', 'info');
      return;
    }
    setIsCreateOpen(true);
  };

  return (
    <div className="main-content" style={{ padding: '3.5rem 0' }}>
      <div className="app-container" style={{ maxWidth: '820px' }}>
        {/* Section Header */}
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
            <div className="section-label">TECHNICAL DISCUSSIONS</div>
            <h1 className="section-title">COMMUNITY FEED</h1>
            <p className="section-description">
              Technical updates, architecture debates, and thoughts from active community developers.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleOpenCreate}
          >
            + Start Discussion
          </button>
        </div>

        {/* Discussions List */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
            <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Failed to load feed</p>
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</p>
            <button type="button" className="btn btn-outline btn-sm" onClick={fetchPosts}>
              Try Again
            </button>
          </div>
        ) : posts.length === 0 ? (
          <EmptyState
            title="No discussions published yet"
            description="Be the first to share an engineering thought, discuss architecture, or ask a question."
            actionText="Start First Discussion"
            onAction={handleOpenCreate}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onPostDeleted={handlePostDeleted}
              />
            ))}
          </div>
        )}

        {/* Modal for creating post */}
        <CreatePostModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onPostCreated={handlePostCreated}
        />
      </div>
    </div>
  );
};

export default CommunityPage;
