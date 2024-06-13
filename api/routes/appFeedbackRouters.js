const express = require('express');
const {protect} = require('../middleware/accountMiddleware');
const{
    getAllAppFeedbacks,
    createAppFeedback,
    deleteAppFeedback,
    getAppFeedbackById,
    replyToAppFeedback
} = require('../controllers/appFeedbackController');

const router = express.Router();

router
.route('/')
.get(getAllAppFeedbacks)
.post(createAppFeedback)
;

router
.route("/:appFeedbackId")
.get(protect, getAppFeedbackById)
.delete(protect, deleteAppFeedback);

router
.route("/reply/:appFeedbackId")
.patch(protect, replyToAppFeedback)
;
module.exports = router;