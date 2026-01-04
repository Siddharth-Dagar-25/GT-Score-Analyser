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
import { FaArrowUp, FaArrowDown, FaChartLine, FaAward, FaExclamationTriangle, FaChevronDown } from 'react-icons/fa';
import './Dashboard.css';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [subjectAnalytics, setSubjectAnalytics] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [legendExpanded, setLegendExpanded] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [tableSortOrder, setTableSortOrder] = useState('default'); // Sort for table

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        <div className="chart-container score-trend-container">
          <ResponsiveContainer width="100%" height={450}>
            <LineChart data={scoreTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={2} name="Score">
                <LabelList dataKey="score" position="top" fill="#4f46e5" fontSize={11} fontWeight="bold" />
              </Line>
              <Line type="monotone" dataKey="percentage" stroke="#10b981" strokeWidth={2} name="Percentage">
                <LabelList dataKey="percentage" position="top" fill="#10b981" fontSize={11} fontWeight="bold" />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject Comparison */}
      <div className="card">
        <h2 className="card-title">Subject-wise Score Comparison</h2>
        {isMobile ? (() => {
          const maxValue = Math.max(...subjectComparisonData.map(d => Math.max(d['Average Score'], d['Best Score'], d['Latest Score'])));
          return (
            <div className="mobile-chart-view">
              <div className="mobile-chart-legend">
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: '#4f46e5' }}></span>
                  <span>Average Score</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: '#10b981' }}></span>
                  <span>Best Score</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: '#f59e0b' }}></span>
                  <span>Latest Score</span>
                </div>
              </div>
              <div className="mobile-subject-list">
                {subjectComparisonData.map((item, index) => (
                  <div key={index} className="mobile-subject-card">
                    <div className="mobile-subject-header">
                      <h3 className="mobile-subject-name">{item.name}</h3>
                      <span className="mobile-subject-short">{item.shortName}</span>
                    </div>
                    <div className="mobile-score-bars">
                      <div className="mobile-score-item">
                        <div className="mobile-score-label">Average</div>
                        <div className="mobile-score-bar-container">
                          <div 
                            className="mobile-score-bar" 
                            style={{ 
                              width: `${(item['Average Score'] / maxValue) * 100}%`,
                              backgroundColor: '#4f46e5'
                            }}
                          ></div>
                          <span className="mobile-score-value">{item['Average Score']}</span>
                        </div>
                      </div>
                      <div className="mobile-score-item">
                        <div className="mobile-score-label">Best</div>
                        <div className="mobile-score-bar-container">
                          <div 
                            className="mobile-score-bar" 
                            style={{ 
                              width: `${(item['Best Score'] / maxValue) * 100}%`,
                              backgroundColor: '#10b981'
                            }}
                          ></div>
                          <span className="mobile-score-value">{item['Best Score']}</span>
                        </div>
                      </div>
                      <div className="mobile-score-item">
                        <div className="mobile-score-label">Latest</div>
                        <div className="mobile-score-bar-container">
                          <div 
                            className="mobile-score-bar" 
                            style={{ 
                              width: `${(item['Latest Score'] / maxValue) * 100}%`,
                              backgroundColor: '#f59e0b'
                            }}
                          ></div>
                          <span className="mobile-score-value">{item['Latest Score']}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })() : (
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={500}>
              <BarChart 
                data={subjectComparisonData}
                margin={{ top: 20, right: 10, left: 0, bottom: 100 }}
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
        )}
        {/* Subject name legend - Collapsible */}
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
              {subjectComparisonData.map((item, index) => (
                <div key={index} className="subject-legend-item">
                  <span className="legend-short">{item.shortName}:</span>
                  <span className="legend-full">{item.name}</span>
                </div>
              ))}
            </div>
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
                outerRadius={140}
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
          {/* Subject name legend - Collapsible */}
          <div className="subject-legend">
            <div 
              className="subject-legend-header"
              onClick={() => setLegendExpanded(prev => ({ ...prev, contribution: !prev.contribution }))}
            >
              <p className="subject-legend-title">
                <strong>Subject Names:</strong>
              </p>
              <FaChevronDown className={`subject-legend-toggle ${legendExpanded.contribution ? 'expanded' : ''}`} />
            </div>
            <div className={`subject-legend-content ${legendExpanded.contribution ? 'expanded' : ''}`}>
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
      </div>

      {/* Radar Chart */}
      <div className="card">
        <h2 className="card-title">Subject Performance Radar</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
              <PolarGrid />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={({ payload, x, y, cx, cy }) => {
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
                  const shortName = abbreviateSubjectName(payload.value);
                  // Calculate distance from center and add gap for labels
                  const dx = x - cx;
                  const dy = y - cy;
                  const radius = Math.sqrt(dx * dx + dy * dy);
                  const angle = Math.atan2(dy, dx);
                  const labelRadius = radius + 12; // Add 12px gap between chart and labels
                  const labelX = cx + labelRadius * Math.cos(angle);
                  const labelY = cy + labelRadius * Math.sin(angle);
                  return (
                    <text
                      x={labelX}
                      y={labelY}
                      fill="var(--text-secondary)"
                      fontSize={11}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {shortName}
                    </text>
                  );
                }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
              />
              <Radar name="Performance" dataKey="score" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0];
                    const subjectName = data.payload?.subject || data.name || 'Unknown';
                    return (
                      <div className="custom-tooltip">
                        <p style={{ margin: 0, fontWeight: 'bold', marginBottom: '4px' }}>
                          {subjectName}
                        </p>
                        <p style={{ margin: '2px 0' }}>Score: {data.value}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
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
        <div className="card-header-with-sort">
          <h2 className="card-title">Subject-wise Analysis</h2>
          <div className="sort-controls">
            <label htmlFor="table-sort" className="sort-label">Sort by:</label>
            <select
              id="table-sort"
              className="sort-select"
              value={tableSortOrder}
              onChange={(e) => setTableSortOrder(e.target.value)}
            >
              <option value="default">Default Order</option>
              <option value="strong-to-weak">Strong to Weak (High % to Low %)</option>
              <option value="weak-to-strong">Weak to Strong (Low % to High %)</option>
              <option value="high-weightage-to-low">High Weightage to Low Weightage</option>
              <option value="low-weightage-to-high">Low Weightage to High Weightage</option>
            </select>
          </div>
        </div>
        <div className="subject-table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Avg Ques</th>
                <th>Avg Correct</th>
                <th>Avg Incorrect</th>
                <th>Avg Skipped</th>
                <th>Avg Score</th>
                <th>Avg %</th>
                <th>Best Score</th>
                <th>Latest Score</th>
                <th>Improvement</th>
                <th>Weightage</th>
              </tr>
            </thead>
            <tbody>
              {[...subjectAnalytics].sort((a, b) => {
                if (tableSortOrder === 'strong-to-weak') {
                  return b.averagePercentage - a.averagePercentage; // Descending by percentage
                } else if (tableSortOrder === 'weak-to-strong') {
                  return a.averagePercentage - b.averagePercentage; // Ascending by percentage
                } else if (tableSortOrder === 'high-weightage-to-low') {
                  return b.weightage - a.weightage; // Descending by weightage
                } else if (tableSortOrder === 'low-weightage-to-high') {
                  return a.weightage - b.weightage; // Ascending by weightage
                }
                return 0; // Default order (original)
              }).map((subject) => (
                <tr key={subject.subjectName}>
                  <td><strong>{subject.subjectName}</strong></td>
                  <td>{Math.round(subject.averageTotalQuestions)}</td>
                  <td className="positive">{Math.round(subject.averageCorrectQuestions)}</td>
                  <td className="negative">{Math.round(subject.averageIncorrectQuestions)}</td>
                  <td>{Math.round(subject.averageSkippedQuestions)}</td>
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

