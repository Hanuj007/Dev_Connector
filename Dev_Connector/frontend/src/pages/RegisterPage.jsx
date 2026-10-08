import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import SkillsInput from '../components/profile/SkillsInput';

export const RegisterPage = () => {
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    skills: []
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSkillsChange = (newSkills) => {
    setFormData((prev) => ({
      ...prev,
      skills: newSkills
    }));
    if (errorMessage) setErrorMessage('');
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      const res = await register(formData);
      addToast(`Account created! Welcome to Dev-Connector, ${res.user?.name}!`, 'success');
      navigate('/edit-profile', { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        backgroundColor: 'var(--bg-primary)'
      }}
    >
      <div
        className="editorial-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '500px',
          padding: '2.5rem 2rem',
          boxShadow: 'var(--shadow-hover)'
        }}
      >
        <div style={{ marginBottom: '2rem' }}>
          <div className="section-label">JOIN COMMUNITY</div>
          <h2 style={{ fontSize: '1.85rem', marginTop: '0.4rem', textTransform: 'uppercase' }}>
            CREATE PROFILE
          </h2>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
            Build your portfolio, list your technical competencies, and start matching.
          </p>
        </div>

        {errorMessage && (
          <div
            style={{
              padding: '0.85rem 1rem',
              backgroundColor: 'var(--error-bg)',
              color: 'var(--error)',
              border: '1px solid #F5C6C6',
              borderRadius: 'var(--radius-xs)',
              fontSize: '0.86rem',
              marginBottom: '1.5rem',
              fontWeight: 500
            }}
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Full Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-input"
              placeholder="e.g. Alex Morgan"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              placeholder="e.g. alex@developer.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Developer Username (optional)
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className="form-input"
              placeholder="e.g. alexmorgan"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
            />
            <span className="form-helper">Used for your unique profile URL handle</span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password *
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="skills-input">
              Technical Skills (optional)
            </label>
            <SkillsInput
              selectedSkills={formData.skills}
              onChange={handleSkillsChange}
              disabled={loading}
            />
            <span className="form-helper" style={{ marginTop: '0.4rem', display: 'block' }}>
              Select skills to power your developer recommendation matches
            </span>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem', padding: '0.9rem' }}
            disabled={loading}
          >
            {loading ? 'Creating Profile...' : 'Complete Registration →'}
          </button>
        </form>

        <div
          style={{
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-hairline)',
            textAlign: 'center',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)'
          }}
        >
          Already have an account?{' '}
          <Link
            to="/login"
            style={{
              color: 'var(--accent)',
              fontWeight: 700,
              textDecoration: 'none'
            }}
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
