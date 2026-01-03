const express = require('express');
const router = express.Router();
const Test = require('../models/Test');

// Get all unique subjects
router.get('/', async (req, res) => {
  try {
    const tests = await Test.find();
    const subjectSet = new Set();
    
    tests.forEach((test) => {
      test.subjects.forEach((subject) => {
        subjectSet.add(subject.subjectName);
      });
    });

    res.json(Array.from(subjectSet));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

