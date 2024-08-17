const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
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
	dislikes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Account',
		},
	],
});

const forumPostSchema = mongoose.Schema(
	{
		
		content: {
			type: String,
			required: true,
		},
		images: [
			{
				type: String,
			}
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
		dislikes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Account',
			},
		],
		hidden:{
			type:Boolean,
		}
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('ForumPost', forumPostSchema);
