const express = require('express');
const Item = require('../models/Item');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { keyword, category, location, type, sort } = req.query;
    const query = {};
    if (keyword) query.$or = [{ title: { $regex: keyword, $options: 'i' } }, { description: { $regex: keyword, $options: 'i' } }];
    if (category) query.category = category;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (type) query.type = type;
    let sortOption = { createdAt: -1 };
    if (sort === 'date_asc') sortOption = { date: 1 };
    if (sort === 'date_desc') sortOption = { date: -1 };
    const items = await Item.find(query).sort(sortOption).populate('reportedBy', 'name email');
    res.json(items);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/check/duplicate', async (req, res) => {
  try {
    const { title, category } = req.query;
    const count = await Item.countDocuments({ title: { $regex: `^${title}$`, $options: 'i' }, category });
    res.json({ duplicate: count > 0, count });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('reportedBy', 'name email');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const { title, category, description, location, date, type, imageUrl } = req.body;
    if (!title || !category || !description || !location || !date || !type) return res.status(400).json({ message: 'Missing required fields' });
    const item = await Item.create({ title, category, description, location, date, type, imageUrl: imageUrl || '', reportedBy: req.user.id });
    res.status(201).json(item);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.reportedBy.toString() !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });
    Object.assign(item, req.body);
    const updated = await item.save();
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.reportedBy.toString() !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });
    await item.deleteOne();
    res.json({ message: 'Item deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
