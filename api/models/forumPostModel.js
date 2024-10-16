const mongoose = require('mongoose');

const commentSchema = mongoose.Schema(
	{
		content: {
			type: String,
			required: true,
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Account',
		},
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Account',
			},
		],
	},
	{
		timestamps: true,
	}
);

const postRepositorySchema = mongoose.Schema(
	{
		repositoryName: {
			type: String,
			required: true,
		},
		postsList: [
			{
				postId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'ForumPost',
				},
			},
		],
		account: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Account',
		},
	},
	{
		timestamps: true,
	}
);

const forumPostSchema = mongoose.Schema(
	{
		content: {
			type: String,
			required: true,
		},
		images: [
			{
				type: String,
			},
		],
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Account',
		},
		comments: [commentSchema],
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Account',
			},
		],
		hiddenDetails: {
			status: {
				type: Boolean,
				default:'false'
			},
			reasons: [{
				accountId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Account',
				},
				content:{
					type: String,
				},
				update: {
					type: Date,
					default: Date.now,
				},
			}]
		}
	},
	{
		timestamps: true,
	}
);

module.exports = {
	ForumPost: mongoose.model('ForumPost', forumPostSchema),
	PostRepository: mongoose.model('PostRepository', postRepositorySchema),
};
