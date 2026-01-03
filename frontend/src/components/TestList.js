import React, { useState, useEffect } from 'react';
import { testService } from '../services/storage';
import { FaTrash, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import './TestList.css';

function TestList() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await testService.getAll();
      setTests(response.data);
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      try {
        await testService.delete(id);
        fetchTests();
      } catch (error) {
        console.error('Error deleting test:', error);
        alert('Error deleting test');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="test-list">
      <div className="page-header">
        <h1 className="page-title">All Tests</h1>
        <button className="btn btn-primary" onClick={() => navigate('/add-test')}>
          Add New Test
        </button>
      </div>

      {tests.length === 0 ? (
        <div className="empty-state">
          <p>No tests found. Add your first test to get started!</p>
        </div>
      ) : (
        <div className="tests-grid">
          {tests.map((test) => (
            <div key={test._id} className="test-card">
              <div className="test-card-header">
                <h3>Test #{tests.length - tests.indexOf(test)}</h3>
                <span className="test-date">
                  {format(new Date(test.testDate), 'MMM dd, yyyy')}
                </span>
              </div>
              
              <div className="test-card-body">
                <div className="test-stats">
                  <div className="test-stat">
                    <span className="stat-label">Score</span>
                    <span className="stat-value">{test.marksObtained} / {test.totalMarks}</span>
                  </div>
                  <div className="test-stat">
                    <span className="stat-label">Percentage</span>
                    <span className="stat-value">{test.percentage.toFixed(2)}%</span>
                  </div>
                  <div className="test-stat">
                    <span className="stat-label">Correct</span>
                    <span className="stat-value">{test.correctQuestions}</span>
                  </div>
                  <div className="test-stat">
                    <span className="stat-label">Incorrect</span>
                    <span className="stat-value">{test.incorrectQuestions}</span>
                  </div>
                </div>

                <div className="test-subjects">
                  <h4>Subjects ({test.subjects.length})</h4>
                  <div className="subjects-list">
                    {test.subjects.map((subject, index) => (
                      <div key={index} className="subject-item">
                        <span className="subject-name">{subject.subjectName}</span>
                        <span className="subject-score">
                          {subject.marksObtained} / {subject.totalMarks} ({subject.percentage.toFixed(1)}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="test-card-actions">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => navigate(`/tests/${test._id}`)}
                >
                  <FaEye /> View
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(test._id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TestList;

