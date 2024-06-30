const express = require('express');
const router = express.Router();
const webhookHandler = require('../middleware/webhookHandler');

router.post('/', webhookHandler);

module.exports = router;
