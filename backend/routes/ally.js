const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/ally/dashboard
// @desc    Get ally dashboard data
// @access  Private
router.get('/dashboard', authenticateToken, (req, res) => {
  res.json({
    message: 'Ally dashboard endpoint - to be implemented',
    allyId: req.user.id
  });
});

module.exports = router;

