const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/emergency/trigger
// @desc    Trigger emergency response
// @access  Private
router.post('/trigger', authenticateToken, (req, res) => {
  res.json({
    message: 'Emergency trigger endpoint - to be implemented',
    victimId: req.user.id
  });
});

module.exports = router;

