import React, { useState, useEffect } from 'react';
import { goalService, testService, subjectService } from '../services/storage';
import { FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import './Goals.css';

function Goals() {
  const [goals, setGoals] = useState({
    overallTargetScore: 800,
    subjectGoals: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [tests, setTests] = useState([]);
  const [subjectForm, setSubjectForm] = useState({
    subjectName: '',
    targetScore: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [goalsRes, subjectsRes, testsRes] = await Promise.all([
        goalService.get(),
        subjectService.getAll(),
        testService.getAll(),
      ]);
      
      if (goalsRes.data.overallTargetScore) {
        setGoals(goalsRes.data);
      }
      setSubjects(subjectsRes.data);
      setTests(testsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOverallTargetChange = (e) => {
    setGoals((prev) => ({
      ...prev,
      overallTargetScore: parseInt(e.target.value) || 0,
    }));
  };

  const handleSubjectFormChange = (e) => {
    const { name, value } = e.target;
    setSubjectForm((prev) => ({
      ...prev,
      [name]: name === 'subjectName' ? value : (parseInt(value) || 0),
    }));
  };

  const addSubjectGoal = () => {
    if (!subjectForm.subjectName || subjectForm.targetScore <= 0) {
      alert('Please enter both subject name and target score');
      return;
    }

    if (goals.subjectGoals.some((g) => g.subjectName === subjectForm.subjectName)) {
      alert('This subject already has a goal set');
      return;
    }

    setGoals((prev) => ({
      ...prev,
      subjectGoals: [...prev.subjectGoals, { ...subjectForm }],
    }));

    setSubjectForm({
      subjectName: '',
      targetScore: 0,
    });
  };

  const removeSubjectGoal = (index) => {
    setGoals((prev) => ({
      ...prev,
      subjectGoals: prev.subjectGoals.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await goalService.create(goals);
      alert('Goals saved successfully!');
    } catch (error) {
      console.error('Error saving goals:', error);
      alert('Error saving goals');
    } finally {
      setSaving(false);
    }
  };

  // Calculate progress
  const calculateProgress = () => {
    if (tests.length === 0) return { overall: 0, subjects: {} };

    const latestTest = tests[tests.length - 1];
    const overallProgress = (latestTest.marksObtained / goals.overallTargetScore) * 100;

    const subjectProgress = {};
    goals.subjectGoals.forEach((goal) => {
      const subject = latestTest.subjects.find((s) => s.subjectName === goal.subjectName);
      if (subject) {
        subjectProgress[goal.subjectName] = (subject.marksObtained / goal.targetScore) * 100;
      }
    });

    return { overall: overallProgress, subjects: subjectProgress };
  };

  const progress = calculateProgress();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="goals">
      <h1 className="page-title">Goals & Targets</h1>

      <div className="card">
        <h2 className="card-title">Overall Target Score</h2>
        <div className="form-group">
          <label className="form-label">Target Score (out of 800)</label>
          <input
            type="number"
            value={goals.overallTargetScore}
            onChange={handleOverallTargetChange}
            className="form-input"
            min="0"
            max="800"
          />
        </div>
        {tests.length > 0 && (
          <div className="progress-section">
            <div className="progress-info">
              <span>Current Progress</span>
              <span>{progress.overall.toFixed(1)}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${Math.min(progress.overall, 100)}%` }}
              />
            </div>
            <div className="progress-detail">
              Latest: {tests[tests.length - 1]?.marksObtained} / {goals.overallTargetScore}
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="card-title">Subject-wise Goals</h2>
        
        <div className="subject-goal-input">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Subject Name</label>
              <select
                name="subjectName"
                value={subjectForm.subjectName}
                onChange={handleSubjectFormChange}
                className="form-input"
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Target Score</label>
              <input
                type="number"
                name="targetScore"
                value={subjectForm.targetScore}
                onChange={handleSubjectFormChange}
                className="form-input"
                min="0"
              />
            </div>
            <div className="form-group">
              <button type="button" onClick={addSubjectGoal} className="btn btn-primary">
                <FaPlus /> Add Goal
              </button>
            </div>
          </div>
        </div>

        {goals.subjectGoals.length > 0 && (
          <div className="subject-goals-list">
            <table className="table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Target Score</th>
                  <th>Latest Score</th>
                  <th>Progress</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {goals.subjectGoals.map((goal, index) => {
                  const latestTest = tests.length > 0 ? tests[tests.length - 1] : null;
                  const subject = latestTest?.subjects.find((s) => s.subjectName === goal.subjectName);
                  const currentProgress = subject
                    ? (subject.marksObtained / goal.targetScore) * 100
                    : 0;

                  return (
                    <tr key={index}>
                      <td><strong>{goal.subjectName}</strong></td>
                      <td>{goal.targetScore}</td>
                      <td>{subject ? subject.marksObtained : 'N/A'}</td>
                      <td>
                        <div className="progress-bar-small">
                          <div
                            className="progress-fill"
                            style={{ width: `${Math.min(currentProgress, 100)}%` }}
                          />
                          <span className="progress-text">{currentProgress.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => removeSubjectGoal(index)}
                          className="btn btn-danger btn-sm"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="form-actions">
        <button
          onClick={handleSave}
          className="btn btn-primary"
          disabled={saving}
        >
          <FaSave /> {saving ? 'Saving...' : 'Save Goals'}
        </button>
      </div>
    </div>
  );
}

export default Goals;

