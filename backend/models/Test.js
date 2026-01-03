const mongoose = require('mongoose');

const SubjectScoreSchema = new mongoose.Schema({
  subjectName: {
    type: String,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  correctQuestions: {
    type: Number,
    required: true,
  },
  incorrectQuestions: {
    type: Number,
    required: true,
  },
  skippedQuestions: {
    type: Number,
    required: true,
  },
  marksObtained: {
    type: Number,
    required: true,
  },
  totalMarks: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  weightage: {
    type: Number,
    default: 0,
  },
});

const TestSchema = new mongoose.Schema({
  testDate: {
    type: Date,
    default: Date.now,
  },
  totalMarks: {
    type: Number,
    required: true,
  },
  marksObtained: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  correctQuestions: {
    type: Number,
    required: true,
  },
  incorrectQuestions: {
    type: Number,
    required: true,
  },
  skippedQuestions: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  percentile: {
    type: Number,
    default: 0,
  },
  subjects: [SubjectScoreSchema],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Test', TestSchema);

