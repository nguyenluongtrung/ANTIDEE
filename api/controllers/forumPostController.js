const asyncHandler = require('express-async-handler');
const ForumPost = require('../models/forumPostModel');

const createForumPost = asyncHandler(async (req, res) => {});
const deleteForumPost = asyncHandler(async (req, res) => {});
const updateForumPost = asyncHandler(async (req, res) => {});
const getAllForumPosts = asyncHandler(async (req, res) => {});
const getForumPost = asyncHandler(async (req, res) => {});

module.exports = {
	createForumPost,
	deleteForumPost,
	updateForumPost,
	getAllForumPosts,
	getForumPost,
};
