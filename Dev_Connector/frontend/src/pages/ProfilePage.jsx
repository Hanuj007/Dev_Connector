import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userApi } from '../api/userApi';
import { followApi } from '../api/followApi';
import { githubApi } from '../api/githubApi';
import { postApi } from '../api/postApi';
import { useAuth } from '../context/AuthContext';
import ProfileHeader from '../components/profile/ProfileHeader';
import RepoList from '../components/profile/RepoList';
import FollowModal from '../components/profile/FollowModal';
import PostCard from '../components/posts/PostCard';
import { CardSkeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';

export const ProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();

  const profileId = id === 'me' ? currentUser?._id : id;

  const [developer, setDeveloper] = useState(null);
  const [repos, setRepos] = useState([]);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowingState, setIsFollowingState] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [followersModalOpen, setFollowersModalOpen] = useState(false);
  const [followingModalOpen, setFollowingModalOpen] = useState(false);

  const fetchProfileData = async () => {
    if (!profileId) return;

    try {
      setLoading(true);
      setError(null);

      // 1. Fetch user profile
      const user = await userApi.getUserById(profileId);
      setDeveloper(user);

      // 2. Fetch followers & following
      const [followersList, followingList] = await Promise.all([
        followApi.getFollowers(profileId).catch(() => []),
        followApi.getFollowing(profileId).catch(() => [])
      ]);
      const validFollowers = Array.isArray(followersList) ? followersList : [];
      setFollowers(validFollowers);
      setFollowing(Array.isArray(followingList) ? followingList : []);

      // 3. Fetch authoritative follow status from DB if logged in and not self
      if (currentUser?._id && String(currentUser._id) !== String(profileId)) {
        try {
          const isF = await followApi.checkFollowStatus(profileId);
          setIsFollowingState(!!isF);
        } catch {
          setIsFollowingState(
            validFollowers.some(
              (f) => String(f.follower?._id || f.follower) === String(currentUser._id)
            )
          );
        }
      } else {
        setIsFollowingState(false);
      }

      // 4. Fetch GitHub Repos if developer has a githubUsername
      if (user.githubUsername) {
        try {
          const userRepos = await githubApi.getGithubRepos(user.githubUsername);
          setRepos(Array.isArray(userRepos) ? userRepos : []);
        } catch (repoErr) {
          console.warn('Could not fetch GitHub repos:', repoErr.message);
        }
      } else {
        setRepos([]);
      }

      // 5. Fetch posts authored by this developer
      try {
        const allPosts = await postApi.getAllPosts();
        const userPosts = allPosts.filter(
          (p) => String(p.user?._id || p.user) === String(profileId)
        );
        setPosts(userPosts);
      } catch (postErr) {
        console.warn('Could not fetch user posts:', postErr.message);
      }
    } catch (err) {
      setError(err.message || 'Developer profile not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [profileId, currentUser?._id]);

  const handleFollowChange = (targetId, nowFollowing) => {
    setIsFollowingState(nowFollowing);
    if (nowFollowing) {
      if (currentUser) {
        setFollowers((prev) => [
          ...prev,
          {
            _id: `temp-${Date.now()}`,
            follower: {
              _id: currentUser._id,
              name: currentUser.name,
              username: currentUser.username,
              profileImage: currentUser.profileImage,
              bio: currentUser.bio
            }
          }
        ]);
      }
    } else {
      setFollowers((prev) =>
        prev.filter((f) => String(f.follower?._id || f.follower) !== String(currentUser?._id))
      );
    }
  };

  const isSelf = currentUser?._id && String(currentUser._id) === String(developer?._id);

  if (loading) {
    return (
      <div className="main-content" style={{ padding: '3.5rem 0' }}>
        <div className="app-container">
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (error || !developer) {
    return (
      <div className="main-content" style={{ padding: '4rem 0' }}>
        <div className="app-container">
          <EmptyState
            title="Developer Not Found"
            description={error || 'The profile you are looking for does not exist or has been removed.'}
            actionText="Back to Discovery"
            onAction={() => (window.location.href = '/discover')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="main-content" style={{ padding: '3.5rem 0' }}>
      <div className="app-container">
        {/* Header Portfolio Showcase */}
        <ProfileHeader
          profileUser={developer}
          followersCount={followers.length}
          followingCount={following.length}
          isFollowingInitial={isFollowingState}
          onOpenFollowers={() => setFollowersModalOpen(true)}
          onOpenFollowing={() => setFollowingModalOpen(true)}
          onFollowChange={handleFollowChange}
        />

        {/* GitHub Repositories Section */}
        <RepoList
          repos={repos}
          isSelf={isSelf}
          onReposSynced={(synced) => setRepos(synced)}
        />

        {/* Authored Technical Posts Section */}
        <div style={{ marginTop: '3.5rem' }}>
          <div className="section-header" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
              Authored Discussions ({posts.length})
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Technical thoughts, questions, and insights shared by {developer.name}
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="editorial-card-muted" style={{ textAlign: 'center', padding: '2.5rem' }}>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                {isSelf
                  ? 'You have not published any discussions yet.'
                  : `${developer.name} has not authored any discussions yet.`}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onPostDeleted={(id) => setPosts((prev) => prev.filter((p) => p._id !== id))}
                />
              ))}
            </div>
          )}
        </div>

        {/* Followers Modal */}
        <FollowModal
          isOpen={followersModalOpen}
          onClose={() => setFollowersModalOpen(false)}
          title={`Followers of ${developer.name}`}
          users={followers}
        />

        {/* Following Modal */}
        <FollowModal
          isOpen={followingModalOpen}
          onClose={() => setFollowingModalOpen(false)}
          title={`Developers followed by ${developer.name}`}
          users={following}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
