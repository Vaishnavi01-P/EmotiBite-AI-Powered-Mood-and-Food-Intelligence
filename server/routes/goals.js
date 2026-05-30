const express = require('express');
const Goal = require('../models/Goal');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get user goals
router.get('/', authMiddleware, async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(goals);
    } catch (error) {
        console.error('Error fetching goals:', error);
        res.status(500).json({ message: 'Error fetching goals' });
    }
});

// Create a new goal
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, description, target, targetValue } = req.body;

        const newGoal = new Goal({
            user: req.user._id,
            title,
            description,
            target,
            targetValue: targetValue || 7,
            status: 'in_progress',
            progress: 0
        });

        const savedGoal = await newGoal.save();
        res.status(201).json(savedGoal);
    } catch (error) {
        console.error('Error creating goal:', error);
        res.status(500).json({ message: 'Error creating goal' });
    }
});

// Update a goal
router.patch('/:id', authMiddleware, async (req, res) => {
    try {
        const { title, description, target, targetValue, progress, status } = req.body;

        const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        if (title) goal.title = title;
        if (description) goal.description = description;
        if (target) goal.target = target;
        if (targetValue !== undefined) goal.targetValue = targetValue;
        if (progress !== undefined) goal.progress = progress;
        if (status) goal.status = status;

        const updatedGoal = await goal.save();
        res.json(updatedGoal);
    } catch (error) {
        console.error('Error updating goal:', error);
        res.status(500).json({ message: 'Error updating goal' });
    }
});

// Delete a goal
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const result = await Goal.deleteOne({ _id: req.params.id, user: req.user._id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Goal not found' });
        }
        res.json({ message: 'Goal deleted successfully' });
    } catch (error) {
        console.error('Error deleting goal:', error);
        res.status(500).json({ message: 'Error deleting goal' });
    }
});

module.exports = router;
