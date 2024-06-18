const express = require('express');
const { createChat, getChatById, getAllChats,
  } = require('../controllers/chatController');
const { protect } = require('../middleware/accountMiddleware');

const router = express.Router();

router
.route("/")
.get(getAllChats)
.post(protect, createChat)

router.route("/:chatId")
.get(protect,getChatById);
module.exports = router;