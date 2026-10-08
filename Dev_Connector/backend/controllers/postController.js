const mongoose = require('mongoose');
const postRepository = require('../repositories/postRepository');
const notificationService = require('../services/notificationService');

// Post Controller handles CRUD operations and like/unlike actions for posts
const postController = {
  // POST /api/posts - Create a new post (Protected)
  createPost: async (req, res, next) => {
    try {
      const { text } = req.body;

      if (!text || text.trim() === '') {
        return res.status(400).json({ message: 'Post content cannot be empty' });
      }

      const post = await postRepository.createPost({
        user: req.user._id,
        text: text.trim()
      });

      return res.status(201).json({
        message: 'Post created successfully',
        post
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/posts - Get all posts sorted by newest first
  getAllPosts: async (req, res, next) => {
    try {
      const posts = await postRepository.findAll();
      return res.status(200).json({
        count: posts.length,
        posts
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/posts/:id - Get a single post by ID
  getPostById: async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Post not found (invalid ID format)' });
      }

      const post = await postRepository.findById(id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      return res.status(200).json({ post });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/posts/:id - Update an existing post (Owner only)
  updatePost: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { text } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Post not found (invalid ID format)' });
      }

      if (!text || text.trim() === '') {
        return res.status(400).json({ message: 'Post text cannot be empty' });
      }

      const post = await postRepository.findById(id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      // Check ownership
      if (String(post.user._id) !== String(req.user._id)) {
        return res.status(403).json({ message: 'Not authorized to edit this post' });
      }

      const updatedPost = await postRepository.updatePost(id, { text: text.trim() });

      return res.status(200).json({
        message: 'Post updated successfully',
        post: updatedPost
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/posts/:id - Delete a post (Owner only)
  deletePost: async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Post not found (invalid ID format)' });
      }

      const post = await postRepository.findById(id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      // Check ownership
      if (String(post.user._id) !== String(req.user._id)) {
        return res.status(403).json({ message: 'Not authorized to delete this post' });
      }

      await postRepository.deletePost(id);

      return res.status(200).json({
        message: 'Post deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/posts/:id/like - Like a post (Protected)
  likePost: async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Post not found (invalid ID format)' });
      }

      const post = await postRepository.findById(id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      // Check if user already liked the post
      const alreadyLiked = post.likes.some(
        (likeId) => String(likeId) === String(userId)
      );

      if (alreadyLiked) {
        return res.status(400).json({ message: 'You have already liked this post' });
      }

      const updatedPost = await postRepository.likePost(id, userId);

      // Create notification for post owner (only if liker is not the post owner)
      await notificationService.notifyLike(req.user, post.user._id);

      return res.status(200).json({
        message: 'Post liked successfully',
        likes: updatedPost.likes
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/posts/:id/unlike - Unlike a post (Protected)
  unlikePost: async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Post not found (invalid ID format)' });
      }

      const post = await postRepository.findById(id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      // Check if user has liked this post
      const isLiked = post.likes.some(
        (likeId) => String(likeId) === String(userId)
      );

      if (!isLiked) {
        return res.status(400).json({ message: 'You have not yet liked this post' });
      }

      const updatedPost = await postRepository.unlikePost(id, userId);

      return res.status(200).json({
        message: 'Post unliked successfully',
        likes: updatedPost.likes
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = postController;
