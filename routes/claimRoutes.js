const express = require('express');
const Claim = require('../models/Claim');
const Item = require('../models/Item');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { item, message } = req.body;
    if (!item || !message) return res.status(400).json({ message: 'Item and message required' });
    const existingItem = await Item.findById(item);
    if (!existingItem) return res.status(404).json({ message: 'Item not found' });
    const claim = await Claim.create({ item, message, claimant: req.user.id });
    res.status(201).json(claim);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.get('/my', protect, async (req, res) => {
  const claims = await Claim.find({ claimant: req.user.id }).populate('item').populate('claimant', 'name email');
  res.json(claims);
});

router.get('/item/:itemId', protect, async (req, res) => {
  const item = await Item.findById(req.params.itemId);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  if (item.reportedBy.toString() !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });
  const claims = await Claim.find({ item: req.params.itemId }).populate('claimant', 'name email');
  res.json(claims);
});

router.put('/:id', protect, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const claim = await Claim.findById(req.params.id).populate('item');
    if (!claim) return res.status(404).json({ message: 'Claim not found' });
    const item = await Item.findById(claim.item._id);
    if (item.reportedBy.toString() !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });
    claim.status = status;
    await claim.save();
    if (status === 'approved') { item.status = 'claimed'; await item.save(); }
    res.json(claim);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.get('/', protect, adminOnly, async (req, res) => {
  const claims = await Claim.find().populate('item').populate('claimant', 'name email');
  res.json(claims);
});

module.exports = router;
