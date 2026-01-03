import React, { useState, useEffect } from 'react';
import { testService } from '../services/storage';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LabelList,
} from 'recharts';
import { FaArrowUp, FaArrowDown, FaChartLine, FaAward, FaExclamationTriangle } from 'react-icons/fa';
import './Dashboard.css';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [subjectAnalytics, setSubjectAnalytics] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [analyticsRes, subjectRes, testsRes] = await Promise.all([
        testService.getAnalytics(),
        testService.getSubjectAnalytics(),
        testService.getAll(),
      ]);
      setAnalytics(analyticsRes.data);
      setSubjectAnalytics(subjectRes.data);
      setTests(testsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!analytics || analytics.totalTests === 0) {
    return (
      <div className="empty-state">
        <FaChartLine size={48} />
        <h2>No Test Data Available</h2>
        <p>Add your first test to start tracking your performance!</p>
      </div>
    );
  }

  // Prepare data for charts
  const scoreTrendData = tests
    .sort((a, b) => new Date(a.testDate) - new Date(b.testDate))
    .map((test, index) => ({
      name: `Test ${index + 1}`,
      score: test.marksObtained,
      percentage: Math.round(test.percentage * 100) / 100,
      date: new Date(test.testDate).toLocaleDateString(),
    }));

  // Subject-wise score trend
  const subjectTrendData = subjectAnalytics.map((subject) => ({
    subject: subject.subjectName,
    scores: subject.scores,
  }));

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

  // Subject comparison bar chart
  const subjectComparisonData = subjectAnalytics.map((subject) => ({
    name: subject.subjectName,
    shortName: abbreviateSubjectName(subject.subjectName),
    'Average Score': Math.round(subject.averageScore),
    'Best Score': subject.bestScore,
    'Latest Score': subject.latestScore,
  }));

  // Subject contribution pie chart
  const subjectContributionData = subjectAnalytics.map((subject) => ({
    name: subject.subjectName,
    shortName: abbreviateSubjectName(subject.subjectName),
    value: subject.totalContribution,
    percentage: subject.averagePercentage,
  }));

  // Radar chart data (strength vs weakness)
  const radarData = subjectAnalytics.map((subject) => ({
    subject: subject.subjectName,
    score: Math.round(subject.averagePercentage),
    fullMark: 100,
  }));

  // Insights
  const topSubject = subjectAnalytics.reduce((prev, current) =>
    prev.averagePercentage > current.averagePercentage ? prev : current
  );
  const bottomSubject = subjectAnalytics.reduce((prev, current) =>
    prev.averagePercentage < current.averagePercentage ? prev : current
  );
  const improvingSubjects = subjectAnalytics.filter((s) => s.improvement > 0);
  const decliningSubjects = subjectAnalytics.filter((s) => s.improvement < 0);

  return (
    <div className="dashboard">
      <h1 className="page-title">Performance Dashboard</h1>

      {/* Overall Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Tests</div>
          <div className="stat-value">{analytics.totalTests}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Average Score</div>
          <div className="stat-value">{analytics.averageScore}</div>
          <div className="stat-sublabel">out of 800</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Average Percentage</div>
          <div className="stat-value">{analytics.averagePercentage.toFixed(2)}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Best Score</div>
          <div className="stat-value">{analytics.bestScore}</div>
          <div className="stat-sublabel">
            <FaAward className="icon-success" />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Worst Score</div>
          <div className="stat-value">{analytics.worstScore}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Latest Score</div>
          <div className="stat-value">{analytics.latestScore}</div>
          <div className="stat-sublabel">{analytics.latestPercentage.toFixed(2)}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Score Variance</div>
          <div className="stat-value">{analytics.scoreVariance.toFixed(2)}</div>
          <div className="stat-sublabel">Lower is better</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Overall Improvement</div>
          <div className={`stat-value ${analytics.improvement >= 0 ? 'positive' : 'negative'}`}>
            {analytics.improvement >= 0 ? '+' : ''}{analytics.improvement.toFixed(2)}%
          </div>
          {analytics.improvement >= 0 ? (
            <FaArrowUp className="icon-success" />
          ) : (
            <FaArrowDown className="icon-error" />
          )}
        </div>
      </div>

      {/* Score Trend Chart */}
      <div className="card">
        <h2 className="card-title">Score Trend Over Time</h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={scoreTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={2} name="Score">
              <LabelList dataKey="score" position="top" fill="#4f46e5" fontSize={11} fontWeight="bold" />
            </Line>
            <Line type="monotone" dataKey="percentage" stroke="#10b981" strokeWidth={2} name="Percentage">
              <LabelList dataKey="percentage" position="bottom" fill="#10b981" fontSize={10} />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Subject Comparison */}
      <div className="card">
        <h2 className="card-title">Subject-wise Score Comparison</h2>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={500}>
            <BarChart 
              data={subjectComparisonData}
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
                    const fullName = subjectComparisonData.find(d => d.shortName === label)?.name || label;
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
              <Bar dataKey="Average Score" fill="#4f46e5">
                <LabelList dataKey="Average Score" position="top" fill="#4f46e5" fontSize={10} fontWeight="bold" />
              </Bar>
              <Bar dataKey="Best Score" fill="#10b981">
                <LabelList dataKey="Best Score" position="top" fill="#10b981" fontSize={10} fontWeight="bold" />
              </Bar>
              <Bar dataKey="Latest Score" fill="#f59e0b">
                <LabelList dataKey="Latest Score" position="top" fill="#f59e0b" fontSize={10} fontWeight="bold" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Subject name legend for mobile */}
        <div className="subject-legend">
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            <strong>Subject Names:</strong>
          </p>
          <div className="subject-legend-grid">
            {subjectComparisonData.map((item, index) => (
              <div key={index} className="subject-legend-item">
                <span className="legend-short">{item.shortName}:</span>
                <span className="legend-full">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subject Contribution */}
      <div className="card">
        <h2 className="card-title">Subject Contribution to Total Score</h2>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={subjectContributionData}
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
                {subjectContributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0];
                    const fullName = subjectContributionData.find(d => d.value === data.value)?.name || data.name;
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
        {/* Subject name legend */}
        <div className="subject-legend">
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            <strong>Subject Names:</strong>
          </p>
          <div className="subject-legend-grid">
            {subjectContributionData.map((item, index) => (
              <div key={index} className="subject-legend-item">
                <span className="legend-short">{item.shortName}:</span>
                <span className="legend-full">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="card">
        <h2 className="card-title">Subject Performance Radar</h2>
        <ResponsiveContainer width="100%" height={450}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar name="Performance" dataKey="score" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="card">
        <h2 className="card-title">Performance Insights</h2>
        <div className="insights-grid">
          <div className="insight-card positive">
            <FaAward className="insight-icon" />
            <h3>Top Performing Subject</h3>
            <p className="insight-value">{topSubject?.subjectName}</p>
            <p className="insight-detail">{topSubject?.averagePercentage.toFixed(2)}% average</p>
          </div>
          <div className="insight-card negative">
            <FaExclamationTriangle className="insight-icon" />
            <h3>Needs Attention</h3>
            <p className="insight-value">{bottomSubject?.subjectName}</p>
            <p className="insight-detail">{bottomSubject?.averagePercentage.toFixed(2)}% average</p>
          </div>
          <div className="insight-card positive">
            <FaArrowUp className="insight-icon" />
            <h3>Improving Subjects</h3>
            <p className="insight-value">{improvingSubjects.length}</p>
            <p className="insight-detail">
              {improvingSubjects.map((s) => s.subjectName).join(', ') || 'None'}
            </p>
          </div>
          <div className="insight-card negative">
            <FaArrowDown className="insight-icon" />
            <h3>Declining Subjects</h3>
            <p className="insight-value">{decliningSubjects.length}</p>
            <p className="insight-detail">
              {decliningSubjects.map((s) => s.subjectName).join(', ') || 'None'}
            </p>
          </div>
        </div>
      </div>

      {/* Subject-wise Details */}
      <div className="card">
        <h2 className="card-title">Subject-wise Analysis</h2>
        <div className="subject-table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Average Score</th>
                <th>Average %</th>
                <th>Best Score</th>
                <th>Latest Score</th>
                <th>Improvement</th>
                <th>Weightage</th>
              </tr>
            </thead>
            <tbody>
              {subjectAnalytics.map((subject) => (
                <tr key={subject.subjectName}>
                  <td><strong>{subject.subjectName}</strong></td>
                  <td>{subject.averageScore.toFixed(2)}</td>
                  <td>{subject.averagePercentage.toFixed(2)}%</td>
                  <td>{subject.bestScore}</td>
                  <td>{subject.latestScore}</td>
                  <td className={subject.improvement >= 0 ? 'positive' : 'negative'}>
                    {subject.improvement >= 0 ? '+' : ''}{subject.improvement.toFixed(2)}%
                  </td>
                  <td>{subject.weightage.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

