import React, { useState } from 'react';
import Modal from '../common/Modal';
import { postApi } from '../../api/postApi';
import { useToast } from '../common/Toast';

export const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      addToast('Post text cannot be empty', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const newPost = await postApi.createPost(text.trim());
      addToast('Discussion published successfully! Matching affinity updated.', 'success');
      setText('');
      onClose();
      if (onPostCreated) onPostCreated(newPost);
    } catch (err) {
      addToast(err.message || 'Failed to publish post', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Publish Technical Discussion">
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.25rem' }}>
          <label className="form-label">
            Share technical thoughts, architecture decisions, or question
          </label>
          <textarea
            className="form-textarea"
            placeholder="e.g. Exploring concurrency models in Go vs Node.js worker threads... What are your benchmarks on MongoDB index fragmentation?"
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={submitting}
            autoFocus
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '0.5rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--text-tertiary)'
            }}
          >
            <span>Mentioning tech (e.g. React, Node.js) builds your matching engine affinity</span>
            <span>{text.length} chars</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={submitting || !text.trim()}
          >
            {submitting ? 'Publishing...' : 'Publish Post'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreatePostModal;
