// Browser-based storage service using localStorage
// Much faster than MongoDB for single-user, small dataset scenarios

const STORAGE_KEYS = {
  TESTS: 'score_analyser_tests',
  GOALS: 'score_analyser_goals',
};

// Helper functions
const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from storage:', error);
    return defaultValue;
  }
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error saving to storage:', error);
    // If storage is full, try to clear old data
    if (error.name === 'QuotaExceededError') {
      alert('Storage is full. Please delete some old tests.');
    }
    return false;
  }
};

// Calculate marks based on exam pattern: +4 for correct, -1 for incorrect
const calculateMarks = (correct, incorrect) => {
  return (correct * 4) - (incorrect * 1);
};

// Generate unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Test Service
export const testService = {
  getAll: async () => {
    const tests = getFromStorage(STORAGE_KEYS.TESTS, []);
    return { data: tests };
  },

  getById: async (id) => {
    const tests = getFromStorage(STORAGE_KEYS.TESTS, []);
    const test = tests.find(t => t._id === id);
    if (!test) {
      throw new Error('Test not found');
    }
    return { data: test };
  },

  create: async (testData) => {
    const tests = getFromStorage(STORAGE_KEYS.TESTS, []);
    
    const {
      testDate,
      totalQuestions,
      correctQuestions,
      incorrectQuestions,
      skippedQuestions,
      subjects,
    } = testData;

    // Calculate total marks
    const totalMarks = totalQuestions * 4;
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

    const newTest = {
      _id: generateId(),
      testDate: testDate ? new Date(testDate).toISOString() : new Date().toISOString(),
      totalMarks,
      marksObtained,
      totalQuestions,
      correctQuestions,
      incorrectQuestions,
      skippedQuestions,
      percentage,
      subjects: processedSubjects,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tests.push(newTest);
    saveToStorage(STORAGE_KEYS.TESTS, tests);
    return { data: newTest };
  },

  update: async (id, testData) => {
    const tests = getFromStorage(STORAGE_KEYS.TESTS, []);
    const index = tests.findIndex(t => t._id === id);
    
    if (index === -1) {
      throw new Error('Test not found');
    }

    const {
      testDate,
      totalQuestions,
      correctQuestions,
      incorrectQuestions,
      skippedQuestions,
      subjects,
    } = testData;

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

    tests[index] = {
      ...tests[index],
      testDate: testDate ? new Date(testDate).toISOString() : new Date().toISOString(),
      totalMarks,
      marksObtained,
      totalQuestions,
      correctQuestions,
      incorrectQuestions,
      skippedQuestions,
      percentage,
      subjects: processedSubjects,
      updatedAt: new Date().toISOString(),
    };

    saveToStorage(STORAGE_KEYS.TESTS, tests);
    return { data: tests[index] };
  },

  delete: async (id) => {
    const tests = getFromStorage(STORAGE_KEYS.TESTS, []);
    const filtered = tests.filter(t => t._id !== id);
    saveToStorage(STORAGE_KEYS.TESTS, filtered);
    return { data: { message: 'Test deleted successfully' } };
  },

  getAnalytics: async () => {
    const tests = getFromStorage(STORAGE_KEYS.TESTS, []);
    
    if (tests.length === 0) {
      return {
        data: {
          totalTests: 0,
          averageScore: 0,
          averagePercentage: 0,
          bestScore: 0,
          worstScore: 0,
          scoreVariance: 0,
          improvement: 0,
          percentile: 0,
          latestScore: 0,
          latestPercentage: 0,
        },
      };
    }

    const sortedTests = [...tests].sort((a, b) => new Date(a.testDate) - new Date(b.testDate));
    const scores = sortedTests.map(t => t.marksObtained);
    const percentages = sortedTests.map(t => t.percentage);
    
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
    const improvement = scores.length > 1 
      ? ((scores[scores.length - 1] - scores[0]) / scores[0]) * 100 
      : 0;

    // Calculate percentile
    const latestTest = sortedTests[sortedTests.length - 1];
    const sortedScores = [...scores].sort((a, b) => b - a);
    const percentile = ((sortedScores.length - sortedScores.indexOf(latestTest.marksObtained)) / sortedScores.length) * 100;

    return {
      data: {
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
      },
    };
  },

  getSubjectAnalytics: async () => {
    const tests = getFromStorage(STORAGE_KEYS.TESTS, []);
    
    if (tests.length === 0) {
      return { data: [] };
    }

    const sortedTests = [...tests].sort((a, b) => new Date(a.testDate) - new Date(b.testDate));
    const subjectMap = {};
    
    sortedTests.forEach((test) => {
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

    return { data: subjectAnalytics };
  },
};

// Goal Service
export const goalService = {
  get: async () => {
    const goal = getFromStorage(STORAGE_KEYS.GOALS, {
      overallTargetScore: 800,
      subjectGoals: [],
    });
    return { data: goal };
  },

  create: async (goalData) => {
    const goal = {
      ...goalData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveToStorage(STORAGE_KEYS.GOALS, goal);
    return { data: goal };
  },
};

// Subject Service
export const subjectService = {
  getAll: async () => {
    const tests = getFromStorage(STORAGE_KEYS.TESTS, []);
    const subjectSet = new Set();
    
    tests.forEach((test) => {
      test.subjects.forEach((subject) => {
        subjectSet.add(subject.subjectName);
      });
    });

    return { data: Array.from(subjectSet) };
  },
};

// Export function to clear all data (for testing/reset)
export const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEYS.TESTS);
  localStorage.removeItem(STORAGE_KEYS.GOALS);
};

// Export function to export data as JSON (backup)
export const exportData = () => {
  const tests = getFromStorage(STORAGE_KEYS.TESTS, []);
  const goals = getFromStorage(STORAGE_KEYS.GOALS, {});
  return { tests, goals };
};

// Export function to import data from JSON (restore)
export const importData = (data) => {
  if (data.tests) {
    saveToStorage(STORAGE_KEYS.TESTS, data.tests);
  }
  if (data.goals) {
    saveToStorage(STORAGE_KEYS.GOALS, data.goals);
  }
};

