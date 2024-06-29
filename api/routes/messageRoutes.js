const express = require('express');
const { createMessage,
     getMessages, 
     getAllMessage} = require('../controllers/messageController');
const { protect } = require('../middleware/accountMiddleware');

const router = express.Router();

router.route("/")
     .get(getAllMessage)
     .post(protect, createMessage);

router.route("/:chatId")
     .get(protect, getMessages);


module.exports = router;

