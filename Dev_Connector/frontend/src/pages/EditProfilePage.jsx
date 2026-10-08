import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../api/userApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import SkillsInput from '../components/profile/SkillsInput';

export const EditProfilePage = () => {
  const { user, updateUserLocally, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    skills: [],
    githubUsername: '',
    profileImage: ''
  });

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        bio: user.bio || '',
        skills: Array.isArray(user.skills)
          ? user.skills
          : (user.skills ? user.skills.split(',').map((s) => s.trim()).filter(Boolean) : []),
        githubUsername: user.githubUsername || '',
        profileImage: user.profileImage || ''
      });
    }
  }, [user]);

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
    try {
      setSaving(true);
      setErrorMessage('');

      const updatedUser = await userApi.updateProfile({
        name: formData.name,
        username: formData.username,
        bio: formData.bio,
        skills: formData.skills,
        githubUsername: formData.githubUsername,
        profileImage: formData.profileImage
      });

      updateUserLocally(updatedUser);
      addToast('Developer profile updated successfully!', 'success');
      navigate(`/profile/${user._id}`);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.prompt(
      'Warning: This action will permanently delete your account, posts, repositories, and messages. Type DELETE to confirm:'
    );

    if (confirmation === 'DELETE') {
      try {
        await userApi.deleteProfile();
        addToast('Your account has been deleted.', 'info');
        logout();
        navigate('/');
      } catch (err) {
        addToast(err.message || 'Failed to delete account', 'error');
      }
    }
  };

  return (
    <div className="main-content" style={{ padding: '3.5rem 0' }}>
      <div className="app-container" style={{ maxWidth: '680px' }}>
        <div className="section-header" style={{ marginBottom: '2rem' }}>
          <div className="section-label">PORTFOLIO SETTINGS</div>
          <h1 className="section-title">EDIT PROFILE</h1>
          <p className="section-description">
            Update your public profile, declare your core skills, and connect your GitHub account.
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

        <form onSubmit={handleSubmit} className="editorial-card" style={{ padding: '2.5rem 2rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Full Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              disabled={saving}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Username Handle
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className="form-input"
              value={formData.username}
              onChange={handleChange}
              disabled={saving}
            />
            <span className="form-helper">Your unique handle on Dev-Connector</span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="githubUsername">
              GitHub Username
            </label>
            <input
              id="githubUsername"
              name="githubUsername"
              type="text"
              className="form-input"
              placeholder="e.g. torvalds"
              value={formData.githubUsername}
              onChange={handleChange}
              disabled={saving}
            />
            <span className="form-helper">Enables repository syncing and matching engine code analysis</span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="skills-input">
              Technical Skills
            </label>
            <SkillsInput
              selectedSkills={Array.isArray(formData.skills) ? formData.skills : []}
              onChange={handleSkillsChange}
              disabled={saving}
            />
            <span className="form-helper" style={{ marginTop: '0.4rem', display: 'block' }}>
              Select from popular suggestions or type to search. Directly weights your matching engine profile (+10 pts per skill).
            </span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="profileImage">
              Profile Image URL
            </label>
            <input
              id="profileImage"
              name="profileImage"
              type="url"
              className="form-input"
              placeholder="https://..."
              value={formData.profileImage}
              onChange={handleChange}
              disabled={saving}
            />
            <span className="form-helper">Direct URL to your avatar or avatar image</span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="bio">
              Developer Bio & Philosophy
            </label>
            <textarea
              id="bio"
              name="bio"
              className="form-textarea"
              placeholder="Tell other developers about your architectural interests, what you are building, or what tech you love."
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              disabled={saving}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate(-1)}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Profile Changes →'}
            </button>
          </div>
        </form>

        {/* Danger Zone: Delete Profile */}
        <div
          className="editorial-card"
          style={{
            marginTop: '3rem',
            border: '1px solid #F5C6C6',
            backgroundColor: 'var(--bg-secondary)',
            padding: '2rem'
          }}
        >
          <h3 style={{ color: 'var(--error)', fontSize: '1.15rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            Danger Zone
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Deleting your account will cascade remove your developer profile, all authored posts, synced repositories, and message threads. This action is irreversible.
          </p>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={handleDeleteAccount}
            style={{ color: 'var(--error)', borderColor: 'var(--error)' }}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
