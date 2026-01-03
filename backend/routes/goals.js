const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');

// Get current goals
router.get('/', async (req, res) => {
  try {
    let goal = await Goal.findOne().sort({ createdAt: -1 });
    if (!goal) {
      // Return default goals if none exist
      goal = {
        overallTargetScore: 800,
        subjectGoals: [],
      };
    }
    res.json(goal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update goals
router.post('/', async (req, res) => {
  try {
    const { overallTargetScore, subjectGoals } = req.body;

    // Check if goal exists
    let goal = await Goal.findOne().sort({ createdAt: -1 });
    
    if (goal) {
      // Update existing goal
      goal.overallTargetScore = overallTargetScore;
      goal.subjectGoals = subjectGoals;
      goal.updatedAt = new Date();
      await goal.save();
    } else {
      // Create new goal
      goal = new Goal({
        overallTargetScore,
        subjectGoals,
      });
      await goal.save();
    }

    res.json(goal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

