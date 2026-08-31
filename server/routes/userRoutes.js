const express = require('express');
const router = express.Router();
const { getDevelopers, getUserStats } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/developers', getDevelopers);
router.get('/dashboard-stats', getUserStats);

module.exports = router;
