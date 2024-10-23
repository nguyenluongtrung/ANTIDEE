const express = require('express');
const { createTopic, getAllTopics } = require('../controllers/topicController');

const router = express.Router();

router
	.route('/')
	.post(createTopic)
	.get(getAllTopics);

module.exports = router;
