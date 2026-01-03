import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { testService } from '../services/storage';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { FaArrowLeft, FaTrash, FaEdit, FaCalendar, FaCheckCircle, FaTimesCircle, FaMinusCircle, FaChevronDown } from 'react-icons/fa';
import { format } from 'date-fns';
import './TestDetail.css';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#ec4899'];

function TestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [allTests, setAllTests] = useState([]);
  const [previousTest, setPreviousTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [legendExpanded, setLegendExpanded] = useState({});

  useEffect(() => {
    fetchTestData();
  }, [id]);

  const fetchTestData = async () => {
    try {
      const [testRes, allTestsRes] = await Promise.all([
        testService.getById(id),
        testService.getAll(),
      ]);
      
      const currentTest = testRes.data;
      setTest(currentTest);
      setAllTests(allTestsRes.data);

      // Find previous test (test before this one chronologically)
      const sortedTests = allTestsRes.data.sort((a, b) => 
        new Date(a.testDate) - new Date(b.testDate)
      );
      const currentIndex = sortedTests.findIndex(t => t._id === id);
      if (currentIndex > 0) {
        setPreviousTest(sortedTests[currentIndex - 1]);
      }
    } catch (error) {
      console.error('Error fetching test data:', error);
      alert('Test not found');
      navigate('/tests');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this test? This action cannot be undone.')) {
      try {
        await testService.delete(id);
        alert('Test deleted successfully!');
        navigate('/tests');
      } catch (error) {
        console.error('Error deleting test:', error);
        alert('Error deleting test');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading test details...</div>;
  }

  if (!test) {
    return (
      <div className="empty-state">
        <p>Test not found</p>
        <button className="btn btn-primary" onClick={() => navigate('/tests')}>
          Back to Tests
        </button>
      </div>
    );
  }

  // Abbreviate long subject names for better display
  const abbreviateSubjectName = (name) => {
    const abbreviations = {
      'Obstetrics & Gynaecology': 'OBG',
      'Community Medicine': 'Comm Med',
      'Forensic Medicine': 'Forensic',
      'Ophthalmology': 'Ophthalmol',
      'Orthopaedics': 'Ortho',
      'Anaesthesia': 'Anaesth',
      'Dermatology': 'Derm',
      'Psychiatry': 'Psych',
      'Paediatrics': 'Paed',
      'Microbiology': 'Micro',
      'Pharmacology': 'Pharma',
      'Biochemistry': 'Biochem',
      'Pathology': 'Path',
      'Physiology': 'Physio',
      'Anatomy': 'Anat',
      'Medicine': 'Med',
      'Surgery': 'Surg',
      'Radiology': 'Radio',
      'ENT': 'ENT',
    };
    return abbreviations[name] || name;
  };

  // Prepare data for charts
  const subjectPieData = test.subjects.map((subject) => ({
    name: subject.subjectName,
    shortName: abbreviateSubjectName(subject.subjectName),
    value: subject.marksObtained,
    percentage: subject.percentage,
  }));

  const subjectBarData = test.subjects.map((subject) => ({
    name: subject.subjectName,
    shortName: abbreviateSubjectName(subject.subjectName),
    'Marks Obtained': subject.marksObtained,
    'Total Marks': subject.totalMarks,
    'Percentage': Math.round(subject.percentage * 100) / 100,
  }));

  const questionBreakdownData = [
    { name: 'Correct', value: test.correctQuestions, color: '#10b981' },
    { name: 'Incorrect', value: test.incorrectQuestions, color: '#ef4444' },
    { name: 'Skipped', value: test.skippedQuestions, color: '#f59e0b' },
  ];

  // Comparison with previous test
  const comparisonData = previousTest ? test.subjects.map((subject) => {
    const prevSubject = previousTest.subjects.find(s => s.subjectName === subject.subjectName);
    const improvement = prevSubject 
      ? ((subject.marksObtained - prevSubject.marksObtained) / prevSubject.marksObtained) * 100
      : 0;
    return {
      name: subject.subjectName,
      'Current': subject.marksObtained,
      'Previous': prevSubject ? prevSubject.marksObtained : 0,
      'Improvement': Math.round(improvement * 100) / 100,
    };
  }) : [];

  const testIndex = allTests
    .sort((a, b) => new Date(a.testDate) - new Date(b.testDate))
    .findIndex(t => t._id === id) + 1;

  return (
    <div className="test-detail">
      <div className="test-detail-header">
        <button className="btn btn-secondary" onClick={() => navigate('/tests')}>
          <FaArrowLeft /> Back to Tests
        </button>
        <div className="header-actions">
          <button className="btn btn-danger" onClick={handleDelete}>
            <FaTrash /> Delete Test
          </button>
        </div>
      </div>

      <div className="test-detail-content">
        {/* Test Overview Card */}
        <div className="card">
          <div className="card-header">
            <h1 className="page-title">Test #{testIndex}</h1>
            <div className="test-date-badge">
              <FaCalendar /> {format(new Date(test.testDate), 'MMMM dd, yyyy')}
            </div>
          </div>

          <div className="test-overview-stats">
            <div className="overview-stat-card primary">
              <div className="stat-icon">
                <FaCheckCircle />
              </div>
              <div className="stat-content">
                <div className="stat-label">Total Score</div>
                <div className="stat-value-large">
                  {test.marksObtained} / {test.totalMarks}
                </div>
                <div className="stat-percentage">{test.percentage.toFixed(2)}%</div>
              </div>
            </div>

            <div className="overview-stat-card success">
              <div className="stat-icon">
                <FaCheckCircle />
              </div>
              <div className="stat-content">
                <div className="stat-label">Correct</div>
                <div className="stat-value-large">{test.correctQuestions}</div>
                <div className="stat-sublabel">out of {test.totalQuestions}</div>
              </div>
            </div>

            <div className="overview-stat-card error">
              <div className="stat-icon">
                <FaTimesCircle />
              </div>
              <div className="stat-content">
                <div className="stat-label">Incorrect</div>
                <div className="stat-value-large">{test.incorrectQuestions}</div>
                <div className="stat-sublabel">-{test.incorrectQuestions} marks</div>
              </div>
            </div>

            <div className="overview-stat-card warning">
              <div className="stat-icon">
                <FaMinusCircle />
              </div>
              <div className="stat-content">
                <div className="stat-label">Skipped</div>
                <div className="stat-value-large">{test.skippedQuestions || 0}</div>
                <div className="stat-sublabel">{test.skippedQuestions || 0} marks</div>
              </div>
            </div>
          </div>
        </div>

        {/* Question Breakdown Chart */}
        <div className="card">
          <h2 className="card-title">Question Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={questionBreakdownData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, value, percent }) => `${name}\n${value} (${(percent * 100).toFixed(1)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {questionBreakdownData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Subject-wise Performance */}
        <div className="card">
          <h2 className="card-title">Subject-wise Performance</h2>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={500}>
              <BarChart 
                data={subjectBarData}
                margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="shortName" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                  tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
                />
                <YAxis />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const fullName = subjectBarData.find(d => d.shortName === label)?.name || label;
                      return (
                        <div className="custom-tooltip">
                          <p style={{ margin: 0, fontWeight: 'bold', marginBottom: '4px' }}>{fullName}</p>
                          {payload.map((entry, index) => (
                            <p key={index} style={{ margin: '2px 0', color: entry.color }}>
                              {entry.name}: {entry.value}
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Bar dataKey="Marks Obtained" fill="#4f46e5">
                  <LabelList dataKey="Marks Obtained" position="top" fill="#4f46e5" fontSize={10} fontWeight="bold" />
                </Bar>
                <Bar dataKey="Total Marks" fill="#e0e0e0">
                  <LabelList dataKey="Total Marks" position="top" fill="#666" fontSize={10} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Subject name legend - Collapsible */}
          <div className="subject-legend">
            <div 
              className="subject-legend-header"
              onClick={() => setLegendExpanded(prev => ({ ...prev, barChart: !prev.barChart }))}
            >
              <p className="subject-legend-title">
                <strong>Subject Names:</strong>
              </p>
              <FaChevronDown className={`subject-legend-toggle ${legendExpanded.barChart ? 'expanded' : ''}`} />
            </div>
            <div className={`subject-legend-content ${legendExpanded.barChart ? 'expanded' : ''}`}>
              <div className="subject-legend-grid">
                {subjectBarData.map((item, index) => (
                  <div key={index} className="subject-legend-item">
                    <span className="legend-short">{item.shortName}:</span>
                    <span className="legend-full">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Subject Contribution Pie Chart */}
        <div className="card">
          <h2 className="card-title">Subject Contribution to Total Score</h2>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={subjectPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ shortName, percentage, value }) => {
                    if (value === 0) return '';
                    return `${shortName}\n${value}m\n${percentage.toFixed(1)}%`;
                  }}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {subjectPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0];
                      const fullName = subjectPieData.find(d => d.value === data.value)?.name || data.name;
                      return (
                        <div className="custom-tooltip">
                          <p style={{ margin: 0, fontWeight: 'bold', marginBottom: '4px' }}>{fullName}</p>
                          <p style={{ margin: '2px 0' }}>Marks: {data.value}</p>
                          <p style={{ margin: '2px 0' }}>Percentage: {data.payload.percentage.toFixed(1)}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Subject name legend - Collapsible */}
          <div className="subject-legend">
            <div 
              className="subject-legend-header"
              onClick={() => setLegendExpanded(prev => ({ ...prev, pieChart: !prev.pieChart }))}
            >
              <p className="subject-legend-title">
                <strong>Subject Names:</strong>
              </p>
              <FaChevronDown className={`subject-legend-toggle ${legendExpanded.pieChart ? 'expanded' : ''}`} />
            </div>
            <div className={`subject-legend-content ${legendExpanded.pieChart ? 'expanded' : ''}`}>
              <div className="subject-legend-grid">
                {subjectPieData.map((item, index) => (
                  <div key={index} className="subject-legend-item">
                    <span className="legend-short">{item.shortName}:</span>
                    <span className="legend-full">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Comparison with Previous Test */}
        {previousTest && (
          <div className="card">
            <h2 className="card-title">
              Comparison with Previous Test (Test #{testIndex - 1})
            </h2>
            <div className="comparison-info">
              <div className="comparison-badge">
                Previous Score: {previousTest.marksObtained} / {previousTest.totalMarks} ({previousTest.percentage.toFixed(2)}%)
              </div>
              <div className="comparison-badge current">
                Current Score: {test.marksObtained} / {test.totalMarks} ({test.percentage.toFixed(2)}%)
              </div>
              <div className={`comparison-badge ${test.marksObtained >= previousTest.marksObtained ? 'positive' : 'negative'}`}>
                Change: {test.marksObtained >= previousTest.marksObtained ? '+' : ''}
                {test.marksObtained - previousTest.marksObtained} marks 
                ({test.marksObtained >= previousTest.marksObtained ? '+' : ''}
                {(test.percentage - previousTest.percentage).toFixed(2)}%)
              </div>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={500}>
                <BarChart 
                  data={comparisonData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="shortName" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                    tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
                  />
                  <YAxis />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const fullName = comparisonData.find(d => d.shortName === label)?.name || label;
                        return (
                          <div className="custom-tooltip">
                            <p style={{ margin: 0, fontWeight: 'bold', marginBottom: '4px' }}>{fullName}</p>
                            {payload.map((entry, index) => (
                              <p key={index} style={{ margin: '2px 0', color: entry.color }}>
                                {entry.name}: {entry.value}
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Previous" fill="#94a3b8">
                    <LabelList dataKey="Previous" position="top" fill="#94a3b8" fontSize={10} fontWeight="bold" />
                  </Bar>
                  <Bar dataKey="Current" fill="#4f46e5">
                    <LabelList dataKey="Current" position="top" fill="#4f46e5" fontSize={10} fontWeight="bold" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Subject name legend - Collapsible */}
            {comparisonData.length > 0 && (
              <div className="subject-legend">
                <div 
                  className="subject-legend-header"
                  onClick={() => setLegendExpanded(prev => ({ ...prev, comparison: !prev.comparison }))}
                >
                  <p className="subject-legend-title">
                    <strong>Subject Names:</strong>
                  </p>
                  <FaChevronDown className={`subject-legend-toggle ${legendExpanded.comparison ? 'expanded' : ''}`} />
                </div>
                <div className={`subject-legend-content ${legendExpanded.comparison ? 'expanded' : ''}`}>
                  <div className="subject-legend-grid">
                    {comparisonData.map((item, index) => (
                      <div key={index} className="subject-legend-item">
                        <span className="legend-short">{item.shortName}:</span>
                        <span className="legend-full">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Detailed Subject Breakdown Table */}
        <div className="card">
          <h2 className="card-title">Detailed Subject Breakdown</h2>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Total Q</th>
                  <th>Correct</th>
                  <th>Incorrect</th>
                  <th>Skipped</th>
                  <th>Marks</th>
                  <th>Total</th>
                  <th>Percentage</th>
                  <th>Weightage</th>
                </tr>
              </thead>
              <tbody>
                {test.subjects.map((subject, index) => (
                  <tr key={index}>
                    <td><strong>{subject.subjectName}</strong></td>
                    <td>{subject.totalQuestions}</td>
                    <td className="positive">{subject.correctQuestions}</td>
                    <td className="negative">{subject.incorrectQuestions}</td>
                    <td>{subject.skippedQuestions}</td>
                    <td><strong>{subject.marksObtained}</strong></td>
                    <td>{subject.totalMarks}</td>
                    <td>{subject.percentage.toFixed(2)}%</td>
                    <td>{subject.weightage.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="card">
          <h2 className="card-title">Performance Insights</h2>
          <div className="insights-grid">
            <div className="insight-item">
              <div className="insight-label">Best Subject</div>
              <div className="insight-value">
                {test.subjects.reduce((best, current) => 
                  current.percentage > best.percentage ? current : best
                ).subjectName}
              </div>
              <div className="insight-detail">
                {Math.max(...test.subjects.map(s => s.percentage)).toFixed(2)}%
              </div>
            </div>
            <div className="insight-item">
              <div className="insight-label">Needs Improvement</div>
              <div className="insight-value">
                {test.subjects.reduce((worst, current) => 
                  current.percentage < worst.percentage ? current : worst
                ).subjectName}
              </div>
              <div className="insight-detail">
                {Math.min(...test.subjects.map(s => s.percentage)).toFixed(2)}%
              </div>
            </div>
            <div className="insight-item">
              <div className="insight-label">Accuracy Rate</div>
              <div className="insight-value">
                {((test.correctQuestions / (test.correctQuestions + test.incorrectQuestions)) * 100).toFixed(2)}%
              </div>
              <div className="insight-detail">
                {test.correctQuestions} correct out of {test.correctQuestions + test.incorrectQuestions} attempted
              </div>
            </div>
            <div className="insight-item">
              <div className="insight-label">Attempt Rate</div>
              <div className="insight-value">
                {(((test.correctQuestions + test.incorrectQuestions) / test.totalQuestions) * 100).toFixed(2)}%
              </div>
              <div className="insight-detail">
                {test.correctQuestions + test.incorrectQuestions} questions attempted out of {test.totalQuestions}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestDetail;

