const express = require('express');
const router = express.Router();
const Test = require('../models/Test');

// Calculate marks based on exam pattern: +4 for correct, -1 for incorrect
const calculateMarks = (correct, incorrect) => {
  return (correct * 4) - (incorrect * 1);
};

// Get all tests
router.get('/', async (req, res) => {
  try {
    const tests = await Test.find().sort({ testDate: -1 });
    res.json(tests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single test
router.get('/:id', async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }
    res.json(test);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new test
router.post('/', async (req, res) => {
  try {
    const {
      testDate,
      totalQuestions,
      correctQuestions,
      incorrectQuestions,
      skippedQuestions,
      subjects,
    } = req.body;

    // Calculate total marks (assuming 200 questions = 800 marks max)
    const totalMarks = totalQuestions * 4; // Each question worth 4 marks
    const marksObtained = calculateMarks(correctQuestions, incorrectQuestions);
    const percentage = (marksObtained / totalMarks) * 100;

    // Process subjects
    const processedSubjects = subjects.map((subject) => {
      const subjectMarksObtained = calculateMarks(
        subject.correctQuestions,
        subject.incorrectQuestions
      );
      const subjectTotalMarks = subject.totalQuestions * 4;
      const subjectPercentage = (subjectMarksObtained / subjectTotalMarks) * 100;
      
      // Calculate weightage (subject questions / total questions * 100)
      const weightage = (subject.totalQuestions / totalQuestions) * 100;

      return {
        subjectName: subject.subjectName,
        totalQuestions: subject.totalQuestions,
        correctQuestions: subject.correctQuestions,
        incorrectQuestions: subject.incorrectQuestions,
        skippedQuestions: subject.skippedQuestions,
        marksObtained: subjectMarksObtained,
        totalMarks: subjectTotalMarks,
        percentage: subjectPercentage,
        weightage: weightage,
      };
    });

    const test = new Test({
      testDate: testDate ? new Date(testDate) : new Date(),
      totalMarks,
      marksObtained,
      totalQuestions,
      correctQuestions,
      incorrectQuestions,
      skippedQuestions,
      percentage,
      subjects: processedSubjects,
    });

    const savedTest = await test.save();
    res.status(201).json(savedTest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update test
router.put('/:id', async (req, res) => {
  try {
    const {
      testDate,
      totalQuestions,
      correctQuestions,
      incorrectQuestions,
      skippedQuestions,
      subjects,
    } = req.body;

    const totalMarks = totalQuestions * 4;
    const marksObtained = calculateMarks(correctQuestions, incorrectQuestions);
    const percentage = (marksObtained / totalMarks) * 100;

    const processedSubjects = subjects.map((subject) => {
      const subjectMarksObtained = calculateMarks(
        subject.correctQuestions,
        subject.incorrectQuestions
      );
      const subjectTotalMarks = subject.totalQuestions * 4;
      const subjectPercentage = (subjectMarksObtained / subjectTotalMarks) * 100;
      // Calculate weightage (subject questions / total questions * 100)
      const weightage = (subject.totalQuestions / totalQuestions) * 100;

      return {
        subjectName: subject.subjectName,
        totalQuestions: subject.totalQuestions,
        correctQuestions: subject.correctQuestions,
        incorrectQuestions: subject.incorrectQuestions,
        skippedQuestions: subject.skippedQuestions,
        marksObtained: subjectMarksObtained,
        totalMarks: subjectTotalMarks,
        percentage: subjectPercentage,
        weightage: weightage,
      };
    });

    const test = await Test.findByIdAndUpdate(
      req.params.id,
      {
        testDate: testDate ? new Date(testDate) : new Date(),
        totalMarks,
        marksObtained,
        totalQuestions,
        correctQuestions,
        incorrectQuestions,
        skippedQuestions,
        percentage,
        subjects: processedSubjects,
      },
      { new: true }
    );

    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    res.json(test);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete test
router.delete('/:id', async (req, res) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.id);
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }
    res.json({ message: 'Test deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get analytics data
router.get('/analytics/summary', async (req, res) => {
  try {
    const tests = await Test.find().sort({ testDate: 1 });
    
    if (tests.length === 0) {
      return res.json({
        totalTests: 0,
        averageScore: 0,
        bestScore: 0,
        worstScore: 0,
        scoreVariance: 0,
        improvement: 0,
      });
    }

    const scores = tests.map(t => t.marksObtained);
    const percentages = tests.map(t => t.percentage);
    
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const averagePercentage = percentages.reduce((a, b) => a + b, 0) / percentages.length;
    const bestScore = Math.max(...scores);
    const worstScore = Math.min(...scores);
    
    // Calculate variance
    const variance = scores.reduce((acc, score) => {
      return acc + Math.pow(score - averageScore, 2);
    }, 0) / scores.length;
    const scoreVariance = Math.sqrt(variance);

    // Calculate improvement (latest vs first)
    const improvement = tests.length > 1 
      ? ((scores[scores.length - 1] - scores[0]) / scores[0]) * 100 
      : 0;

    // Calculate percentile (assuming based on position in sorted array)
    const latestTest = tests[tests.length - 1];
    const sortedScores = [...scores].sort((a, b) => b - a);
    const percentile = ((sortedScores.length - sortedScores.indexOf(latestTest.marksObtained)) / sortedScores.length) * 100;

    res.json({
      totalTests: tests.length,
      averageScore: Math.round(averageScore * 100) / 100,
      averagePercentage: Math.round(averagePercentage * 100) / 100,
      bestScore,
      worstScore,
      scoreVariance: Math.round(scoreVariance * 100) / 100,
      improvement: Math.round(improvement * 100) / 100,
      percentile: Math.round(percentile * 100) / 100,
      latestScore: latestTest.marksObtained,
      latestPercentage: latestTest.percentage,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get subject-wise analytics
router.get('/analytics/subjects', async (req, res) => {
  try {
    const tests = await Test.find().sort({ testDate: 1 });
    
    if (tests.length === 0) {
      return res.json({});
    }

    const subjectMap = {};
    
    tests.forEach((test) => {
      test.subjects.forEach((subject) => {
        if (!subjectMap[subject.subjectName]) {
          subjectMap[subject.subjectName] = {
            subjectName: subject.subjectName,
            scores: [],
            percentages: [],
            marksObtained: [],
            totalMarks: [],
            weightage: [],
            totalQuestions: [],
            correctQuestions: [],
            incorrectQuestions: [],
            skippedQuestions: [],
          };
        }
        subjectMap[subject.subjectName].scores.push(subject.marksObtained);
        subjectMap[subject.subjectName].percentages.push(subject.percentage);
        subjectMap[subject.subjectName].marksObtained.push(subject.marksObtained);
        subjectMap[subject.subjectName].totalMarks.push(subject.totalMarks);
        subjectMap[subject.subjectName].weightage.push(subject.weightage);
        subjectMap[subject.subjectName].totalQuestions.push(subject.totalQuestions);
        subjectMap[subject.subjectName].correctQuestions.push(subject.correctQuestions);
        subjectMap[subject.subjectName].incorrectQuestions.push(subject.incorrectQuestions);
        subjectMap[subject.subjectName].skippedQuestions.push(subject.skippedQuestions || 0);
      });
    });

    const subjectAnalytics = Object.values(subjectMap).map((subject) => {
      const avgScore = subject.scores.reduce((a, b) => a + b, 0) / subject.scores.length;
      const avgPercentage = subject.percentages.reduce((a, b) => a + b, 0) / subject.percentages.length;
      const bestScore = Math.max(...subject.scores);
      const worstScore = Math.min(...subject.scores);
      const latestScore = subject.scores[subject.scores.length - 1];
      const previousScore = subject.scores.length > 1 ? subject.scores[subject.scores.length - 2] : latestScore;
      const improvement = subject.scores.length > 1 
        ? ((latestScore - previousScore) / previousScore) * 100 
        : 0;
      const avgWeightage = subject.weightage.reduce((a, b) => a + b, 0) / subject.weightage.length;
      const totalContribution = subject.marksObtained.reduce((a, b) => a + b, 0);
      const avgTotalMarks = subject.totalMarks.reduce((a, b) => a + b, 0) / subject.totalMarks.length;
      
      // Calculate average questions
      const avgTotalQuestions = subject.totalQuestions.reduce((a, b) => a + b, 0) / subject.totalQuestions.length;
      const avgCorrectQuestions = subject.correctQuestions.reduce((a, b) => a + b, 0) / subject.correctQuestions.length;
      const avgIncorrectQuestions = subject.incorrectQuestions.reduce((a, b) => a + b, 0) / subject.incorrectQuestions.length;
      const avgSkippedQuestions = subject.skippedQuestions.reduce((a, b) => a + b, 0) / subject.skippedQuestions.length;

      return {
        subjectName: subject.subjectName,
        averageScore: Math.round(avgScore * 100) / 100,
        averagePercentage: Math.round(avgPercentage * 100) / 100,
        bestScore,
        worstScore,
        latestScore,
        improvement: Math.round(improvement * 100) / 100,
        weightage: Math.round(avgWeightage * 100) / 100,
        totalContribution,
        averageTotalMarks: Math.round(avgTotalMarks * 100) / 100,
        averageTotalQuestions: Math.round(avgTotalQuestions * 100) / 100,
        averageCorrectQuestions: Math.round(avgCorrectQuestions * 100) / 100,
        averageIncorrectQuestions: Math.round(avgIncorrectQuestions * 100) / 100,
        averageSkippedQuestions: Math.round(avgSkippedQuestions * 100) / 100,
        scores: subject.scores,
        percentages: subject.percentages,
      };
    });

    res.json(subjectAnalytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

