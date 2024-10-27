const express = require('express');
const {
	createTopic,
	getAllTopics,
	getMostPopularTopics,
	getAllForumPostsByTopic,
} = require('../controllers/topicController');

const router = express.Router();

router.route('/').post(createTopic).get(getAllTopics);
router.route('/most-popular-topics').get(getMostPopularTopics);
router.route('/post-by-topic/:topicId').get(getAllForumPostsByTopic)

module.exports = router;
