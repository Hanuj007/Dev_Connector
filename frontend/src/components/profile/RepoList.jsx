import React, { useState } from 'react';
import { githubApi } from '../../api/githubApi';
import { useToast } from '../common/Toast';
import EmptyState from '../common/EmptyState';

export const RepoList = ({ repos = [], isSelf = false, onReposSynced }) => {
  const { addToast } = useToast();
  const [syncing, setSyncing] = useState(false);

  const handleSyncRepos = async () => {
    try {
      setSyncing(true);
      const synced = await githubApi.syncUserRepos();
      addToast('GitHub repositories successfully synced to Dev-Connector!', 'success');
      if (onReposSynced) onReposSynced(synced);
    } catch (err) {
      addToast(err.message || 'Failed to sync repositories', 'error');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div style={{ marginBottom: '3rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            GitHub Repositories
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Open-source codebases and active engineering projects
          </p>
        </div>

        {isSelf && (
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={handleSyncRepos}
            disabled={syncing}
          >
            {syncing ? 'Syncing...' : '↻ Sync GitHub Repos'}
          </button>
        )}
      </div>

      {repos.length === 0 ? (
        <EmptyState
          title="No repositories found"
          description={
            isSelf
              ? 'Make sure you added your GitHub username in Edit Profile, then click Sync GitHub Repos above.'
              : 'This developer has not connected public GitHub repositories yet.'
          }
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {repos.map((repo) => (
            <div
              key={repo._id || repo.repoId || repo.id || repo.name}
              className="editorial-card animate-fade-in"
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '1.05rem', wordBreak: 'break-word' }}>
                  <a
                    href={repo.htmlUrl || repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', color: 'var(--text-primary)' }}
                  >
                    {repo.name} ↗
                  </a>
                </h4>
              </div>

              <p
                style={{
                  fontSize: '0.86rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                  marginBottom: '1.25rem',
                  flex: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {repo.description || 'No description provided.'}
              </p>

              <div
                style={{
                  borderTop: '1px solid var(--border-hairline)',
                  paddingTop: '0.85rem',
                  marginTop: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  color: 'var(--text-secondary)'
                }}
              >
                {repo.language && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--accent)'
                      }}
                    />
                    {repo.language}
                  </span>
                )}
                <span>★ {repo.stars !== undefined ? repo.stars : repo.stargazers_count || 0}</span>
                <span>⑂ {repo.forks !== undefined ? repo.forks : repo.forks_count || 0}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RepoList;
