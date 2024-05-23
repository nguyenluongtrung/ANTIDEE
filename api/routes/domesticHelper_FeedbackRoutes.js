const express = require('express');
const {protect} = require('../middleware/accountMiddleware');
const{
    getAllFeedbacks,
    createFeedback,
    deleteFeedback,
    getFeedbackById,
    replyToFeedback
} = require('../controllers/domesticHelper_FeedbackController');

const router = express.Router();

router
.route('/')
.get(getAllFeedbacks)
.post(protect, createFeedback)
;

router
.route("/:feedbackId")
.get(protect, getFeedbackById)
.delete(protect, deleteFeedback);

router
.route("/reply/:feedbackId")
.patch(protect, replyToFeedback)
;
module.exports = router;