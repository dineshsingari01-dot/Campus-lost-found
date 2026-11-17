const express = require('express');
const User = require('../models/User');
const Item = require('../models/Item');
const Claim = require('../models/Claim');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalItems = await Item.countDocuments();
    const lost = await Item.countDocuments({ type: 'lost' });
    const found = await Item.countDocuments({ type: 'found' });
    const pendingClaims = await Claim.countDocuments({ status: 'pending' });
    const resolved = await Item.countDocuments({ status: 'resolved' });
    res.json({ totalUsers, totalItems, lost, found, pendingClaims, resolved });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/users', protect, adminOnly, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

module.exports = router;
