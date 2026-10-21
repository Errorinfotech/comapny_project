const express = require('express');
const router = express.Router();
const { getClientLinks, updateClientLink, getMyLinks } = require('../controllers/clientLinkController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/me', protect, getMyLinks);
router.get('/', getClientLinks);
router.post('/', protect, adminOnly, updateClientLink);

module.exports = router;
