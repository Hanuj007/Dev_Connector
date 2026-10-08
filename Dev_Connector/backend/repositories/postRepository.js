const Post = require('../models/Post');

// Post Repository handles all database queries for Posts
const postRepository = {
  // Create a new post
  createPost: async (postData) => {
    const post = new Post(postData);
    const savedPost = await post.save();
    return await savedPost.populate('user', 'name username profileImage');
  },

  // Get all posts sorted by newest first
  findAll: async () => {
    return await Post.find()
      .populate('user', 'name username profileImage')
      .sort({ createdAt: -1 });
  },

  // Find a post by its ID
  findById: async (id) => {
    return await Post.findById(id).populate('user', 'name username profileImage');
  },

  // Update a post by its ID
  updatePost: async (id, updateData) => {
    return await Post.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    }).populate('user', 'name username profileImage');
  },

  // Delete a post by its ID
  deletePost: async (id) => {
    return await Post.findByIdAndDelete(id);
  },

  // Add user to likes array (prevents duplicate likes using $addToSet)
  likePost: async (postId, userId) => {
    return await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId } },
      { new: true }
    ).populate('user', 'name username profileImage');
  },

  // Remove user from likes array
  unlikePost: async (postId, userId) => {
    return await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId } },
      { new: true }
    ).populate('user', 'name username profileImage');
  },

  // Delete all posts created by a specific user (used when user deletes profile)
  deleteByUser: async (userId) => {
    return await Post.deleteMany({ user: userId });
  }
};

module.exports = postRepository;
