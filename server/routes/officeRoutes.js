const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getOfficeOverview } = require('../controllers/officeController');

router.use(protect);
router.get('/overview', getOfficeOverview);

module.exports = router;
