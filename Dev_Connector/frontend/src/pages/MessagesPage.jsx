import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { userApi } from '../api/userApi';
import { useAuth } from '../context/AuthContext';
import ConversationList from '../components/messages/ConversationList';
import ChatWindow from '../components/messages/ChatWindow';
import { CardSkeleton } from '../components/common/Skeleton';

export const MessagesPage = () => {
  const { user: currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialUserId = searchParams.get('userId');

  const [developers, setDevelopers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const users = await userApi.getAllUsers();
        // Exclude self from conversation list
        const candidates = users.filter((u) => u._id !== currentUser?._id);
        setDevelopers(candidates);

        if (initialUserId) {
          const target = candidates.find((u) => u._id === initialUserId);
          if (target) {
            setActiveUser(target);
          } else {
            // Fetch directly if not in list
            userApi.getUserById(initialUserId).then((u) => setActiveUser(u)).catch(() => {});
          }
        } else if (candidates.length > 0) {
          setActiveUser(candidates[0]);
        }
      } catch (err) {
        console.error('Failed to load messaging candidates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser?._id, initialUserId]);

  const handleSelectUser = (dev) => {
    setActiveUser(dev);
    setSearchParams({ userId: dev._id });
  };

  return (
    <div className="main-content" style={{ padding: '3.5rem 0' }}>
      <div className="app-container">
        <div className="section-header" style={{ marginBottom: '2rem' }}>
          <div className="section-label">DIRECT MESSAGING</div>
          <h1 className="section-title">ENGINEERING CHATS</h1>
          <p className="section-description">
            1-on-1 private technical dialogues and collaboration discussions with fellow developers.
          </p>
        </div>

        {loading ? (
          <CardSkeleton />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(260px, 320px) 1fr',
              gap: '1.5rem',
              alignItems: 'start'
            }}
            className="messages-grid"
          >
            {/* Left Column: Developer Thread List */}
            <div
              className="editorial-card"
              style={{
                padding: '1.25rem',
                maxHeight: '600px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <h3
                style={{
                  fontSize: '0.95rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  fontFamily: 'var(--font-heading)',
                  marginBottom: '1rem',
                  color: 'var(--text-secondary)'
                }}
              >
                Community Developers ({developers.length})
              </h3>
              <ConversationList
                users={developers}
                activeUserId={activeUser?._id}
                onSelectUser={handleSelectUser}
              />
            </div>

            {/* Right Column: Active Conversation */}
            <div>
              <ChatWindow targetUser={activeUser} />
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .messages-grid {
            gridTemplateColumns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MessagesPage;
