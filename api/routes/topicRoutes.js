const express = require('express');
const {
	createTopic,
	getAllTopics,
	getMostPopularTopics,
} = require('../controllers/topicController');

const router = express.Router();

router.route('/').post(createTopic).get(getAllTopics);
router.route('/most-popular-topics').get(getMostPopularTopics);

module.exports = router;
