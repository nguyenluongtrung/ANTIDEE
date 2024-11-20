const DomesticHelperFeedback = require('../models/domesticHelper_FeedbackModel');

const getAllFeedbacks = async (req, res) => {
	try {
		const feedbacks = await DomesticHelperFeedback.find({}).populate(
			'jobPostId reply.userId'
		);
		res.status(200).json({
			success: true,
			data: { feedbacks },
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
};

const createFeedback = async (req, res) => {
	try {
		const feedback = await DomesticHelperFeedback.create(req.body);
		res.status(201).json({
			success: true,
			data: { feedback },
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			error: error.message,
		});
	}
};

const replyToFeedback = async (req, res) => {
	const feedback = await DomesticHelperFeedback.findById(req.params.feedbackId);

	if (!feedback) {
		return res.status(404).json({
			success: false,
			error: 'Feedback not found',
		});
	}
	feedback.reply.push(req.body);
	await feedback.save();

	res.status(200).json({
		success: true,
		data: {
			feedback,
		},
	});
};

const getFeedbackById = async (req, res) => {
	try {
		const feedback = await DomesticHelperFeedback.findById(
			req.params.feedbackId
		);
		if (!feedback) {
			return res.status(404).json({
				success: false,
				error: 'Feedback not found',
			});
		}
		res.status(200).json({
			success: true,
			data: feedback,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
};

const getFeedbackDetail = async (req, res) => {
	try {
		const feedback = await DomesticHelperFeedback.findOne({
			jobPostId: req.params.jobPostId,
			feedbackFrom:
				req.params.feedbackFrom == 'customer'
					? 'Khách hàng'
					: 'Người giúp việc',
		});
		if (!feedback) {
			return res.status(404).json({
				success: false,
				error: 'Feedback not found',
			});
		}
		res.status(200).json({
			success: true,
			data: {
				feedback,
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
};

const deleteFeedback = async (req, res) => {
	try {
		const feedback = await DomesticHelperFeedback.findByIdAndDelete(
			req.params.feedbackId
		);

		if (!feedback) {
			return res.status(404).json({
				success: false,
				error: 'Feedback not found',
			});
		}
		res.status(200).json({
			success: true,
			data: {
				id: req.params.feedbackId,
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
};

//delete reply

const deleteReply = async (req, res) => {
	const feedback = await DomesticHelperFeedback.findById(req.params.feedbackId);

	if (!feedback) {
		res.status(404);
		throw new Error('Feedback not found!');
	}
	feedback.reply = feedback.reply.filter(
		(replies) => replies._id.toString() !== req.params.replyId
	);
	await feedback.save();

	res.status(200).json({
		status: 'success',
		data: {
			feedback,
		},
	});
};

//update reply

const updateReply = async (req, res) => {
	const feedback = await DomesticHelperFeedback.findById(req.params.feedbackId);
	if (!feedback) {
		res.status(404);
		throw new Error('Feedback not found!');
	}

	feedback.reply.map((replies) =>
		replies._id.toString() === req.params.replyId
			? (replies.content = req.body.content)
			: replies
	);
	await feedback.save();

	res.status(200).json({
		status: 'success',
		data: {
			feedback,
		},
	});
};

module.exports = {
	getAllFeedbacks,
	createFeedback,
	deleteFeedback,
	getFeedbackById,
	replyToFeedback,
	deleteReply,
	updateReply,
	getFeedbackDetail,
};
