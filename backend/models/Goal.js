const mongoose = require('mongoose');

const SubjectGoalSchema = new mongoose.Schema({
  subjectName: {
    type: String,
    required: true,
  },
  targetScore: {
    type: Number,
    required: true,
  },
});

const GoalSchema = new mongoose.Schema({
  overallTargetScore: {
    type: Number,
    required: true,
  },
  subjectGoals: [SubjectGoalSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Goal', GoalSchema);

