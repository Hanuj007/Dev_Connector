import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { messageApi } from '../../api/messageApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import Skeleton from '../common/Skeleton';

export const ChatWindow = ({ targetUser }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!targetUser?._id) return;

    let isMounted = true;
    const fetchChat = async () => {
      try {
        setLoading(true);
        const data = await messageApi.getConversation(targetUser._id);
        if (isMounted) {
          setMessages(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          addToast(err.message || 'Failed to load conversation', 'error');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchChat();

    // Polling every 6 seconds for active direct chat updates
    const interval = setInterval(fetchChat, 6000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [targetUser?._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;

    const messageText = inputText.trim();
    setInputText('');

    try {
      setSending(true);
      const newMsg = await messageApi.sendMessage(targetUser._id, messageText);
      setMessages((prev) => [...prev, newMsg]);
    } catch (err) {
      addToast(err.message || 'Failed to send message', 'error');
      setInputText(messageText);
    } finally {
      setSending(false);
    }
  };

  if (!targetUser) {
    return (
      <div
        className="editorial-card-muted"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '450px',
          textAlign: 'center',
          color: 'var(--text-secondary)'
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Select a Conversation</h3>
          <p style={{ fontSize: '0.9rem', maxWidth: '300px' }}>
            Choose a developer from the list or start a chat from their profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="editorial-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '600px',
        padding: 0,
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--border-hairline)',
          backgroundColor: 'var(--bg-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Link
          to={`/profile/${targetUser._id}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}
        >
          {targetUser.profileImage ? (
            <img
              src={targetUser.profileImage}
              alt={targetUser.name}
              style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-xs)', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: 'var(--text-primary)',
                color: 'var(--text-inverse)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {targetUser.name ? targetUser.name.charAt(0).toUpperCase() : 'D'}
            </div>
          )}
          <div>
            <h4 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--text-primary)' }}>
              {targetUser.name}
            </h4>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              @{targetUser.username || 'developer'}
            </span>
          </div>
        </Link>

        <Link to={`/profile/${targetUser._id}`} className="btn btn-outline btn-sm">
          View Profile ↗
        </Link>
      </div>

      {/* Message Feed */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          backgroundColor: 'var(--bg-primary)'
        }}
      >
        {loading && messages.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Skeleton width="45%" height="38px" borderRadius="var(--radius-xs)" />
            <Skeleton width="55%" height="48px" borderRadius="var(--radius-xs)" style={{ alignSelf: 'flex-end' }} />
            <Skeleton width="40%" height="38px" borderRadius="var(--radius-xs)" />
          </div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
            No messages yet. Say hello and introduce your engineering stack!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = String(msg.sender?._id || msg.sender) === String(user?._id);
            const timeStr = msg.createdAt
              ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : '';

            return (
              <div
                key={msg._id}
                style={{
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '75%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isMe ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    backgroundColor: isMe ? 'var(--text-primary)' : 'var(--bg-card)',
                    color: isMe ? 'var(--text-inverse)' : 'var(--text-primary)',
                    border: `1px solid ${isMe ? 'var(--text-primary)' : 'var(--border-card)'}`,
                    borderRadius: 'var(--radius-xs)',
                    padding: '0.75rem 1rem',
                    fontSize: '0.92rem',
                    lineHeight: 1.5,
                    wordBreak: 'break-word',
                    boxShadow: isMe ? 'none' : 'var(--shadow-editorial)'
                  }}
                >
                  {msg.text}
                </div>
                {timeStr && (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      color: 'var(--text-tertiary)',
                      marginTop: '0.25rem',
                      padding: '0 0.2rem'
                    }}
                  >
                    {timeStr}
                  </span>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer */}
      <form
        onSubmit={handleSend}
        style={{
          padding: '1rem',
          borderTop: '1px solid var(--border-hairline)',
          backgroundColor: 'var(--bg-card)',
          display: 'flex',
          gap: '0.75rem'
        }}
      >
        <input
          type="text"
          className="form-input"
          placeholder="Type a direct message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={sending}
          style={{ flex: 1 }}
        />
        <button
          type="submit"
          className="btn btn-primary btn-sm"
          disabled={sending || !inputText.trim()}
          style={{ minWidth: '90px' }}
        >
          {sending ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
