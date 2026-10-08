import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { postApi } from '../../api/postApi';
import { useToast } from '../common/Toast';

export const PostCard = ({ post, onPostDeleted }) => {
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const author = post.user || {};
  const isOwner = user?._id && String(author._id) === String(user._id);

  const initialLiked = Array.isArray(post.likes) && post.likes.some(
    (likeId) => String(likeId?._id || likeId) === String(user?._id)
  );

  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeLoading, setLikeLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      addToast('Please sign in to like discussions', 'info');
      return;
    }

    try {
      setLikeLoading(true);
      if (isLiked) {
        const updatedLikes = await postApi.unlikePost(post._id);
        setIsLiked(false);
        setLikesCount(updatedLikes.length);
      } else {
        const updatedLikes = await postApi.likePost(post._id);
        setIsLiked(true);
        setLikesCount(updatedLikes.length);
      }
    } catch (err) {
      addToast(err.message || 'Action failed', 'error');
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this discussion post?')) return;
    try {
      setDeleting(true);
      await postApi.deletePost(post._id);
      addToast('Post deleted', 'info');
      if (onPostDeleted) onPostDeleted(post._id);
    } catch (err) {
      addToast(err.message || 'Failed to delete post', 'error');
      setDeleting(false);
    }
  };

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : '';

  return (
    <article
      className="editorial-card animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '1.25rem',
        padding: '1.75rem'
      }}
    >
      {/* Post Author Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.25rem'
        }}
      >
        <Link
          to={`/profile/${author._id}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', textDecoration: 'none' }}
        >
          {author.profileImage ? (
            <img
              src={author.profileImage}
              alt={author.name}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-xs)',
                objectFit: 'cover',
                border: '1px solid var(--border-hairline)'
              }}
            />
          ) : (
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-card)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '1.15rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {author.name ? author.name.charAt(0).toUpperCase() : 'D'}
            </div>
          )}

          <div>
            <h4 style={{ fontSize: '1.05rem', margin: 0 }}>{author.name || 'Developer'}</h4>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--text-tertiary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span>@{author.username || 'user'}</span>
              {formattedDate && <span>• {formattedDate}</span>}
            </div>
          </div>
        </Link>

        {/* Delete button if Owner */}
        {isOwner && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--text-tertiary)',
              cursor: 'pointer',
              padding: '0.3rem 0.5rem',
              borderRadius: 'var(--radius-xs)',
              transition: 'color var(--transition-fast)'
            }}
            title="Delete this post"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        )}
      </div>

      {/* Post Text */}
      <div
        style={{
          fontSize: '1rem',
          color: 'var(--text-primary)',
          lineHeight: 1.65,
          marginBottom: '1.5rem',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}
      >
        {post.text}
      </div>

      {/* Action Footer */}
      <div
        style={{
          borderTop: '1px solid var(--border-hairline)',
          paddingTop: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.82rem'
        }}
      >
        <button
          type="button"
          onClick={handleToggleLike}
          disabled={likeLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-xs)',
            backgroundColor: isLiked ? 'var(--accent-subtle)' : 'var(--bg-secondary)',
            color: isLiked ? 'var(--accent)' : 'var(--text-secondary)',
            border: `1px solid ${isLiked ? 'var(--accent-border)' : 'var(--border-hairline)'}`,
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            fontWeight: isLiked ? 700 : 500
          }}
        >
          <span>{isLiked ? '♥ Liked' : '♡ Like'}</span>
          <span>({likesCount})</span>
        </button>

        <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
          Technical Discussion
        </span>
      </div>
    </article>
  );
};

export default PostCard;
