import React from 'react';
import { FaChartLine, FaPlus, FaList, FaBullseye, FaFileDownload, FaCog, FaInfoCircle, FaLightbulb, FaMobileAlt, FaDatabase } from 'react-icons/fa';
import './About.css';

function About() {
  return (
    <div className="about-page">
      <div className="about-container">
        <div className="about-header">
          <FaChartLine className="about-icon" />
          <h1 className="about-title">Score Analyser</h1>
          <p className="about-subtitle">Your Personal Test Performance Tracker</p>
        </div>

        <div className="about-content">
          <section className="about-section">
            <h2 className="section-title">
              <FaInfoCircle className="section-icon" />
              About This App
            </h2>
            <p className="section-text">
              Score Analyser is a comprehensive web application designed to help you track, analyze, and improve your test performance. 
              Built specifically for medical entrance exam preparation, this app allows you to monitor your progress across multiple tests 
              and subjects, identify strengths and weaknesses, and set goals for continuous improvement.
            </p>
            <p className="section-text">
              Whether you're preparing for NEET, AIIMS, or any other competitive exam with a similar pattern, Score Analyser provides 
              detailed insights into your performance, helping you make data-driven decisions to enhance your preparation strategy.
            </p>
          </section>

          <section className="about-section">
            <h2 className="section-title">
              <FaLightbulb className="section-icon" />
              Key Features
            </h2>
            <div className="features-grid">
              <div className="feature-card">
                <FaPlus className="feature-icon" />
                <h3>Test Management</h3>
                <p>Add and manage multiple test attempts with detailed subject-wise breakdown</p>
              </div>
              <div className="feature-card">
                <FaChartLine className="feature-icon" />
                <h3>Visual Analytics</h3>
                <p>Interactive charts and graphs to visualize your performance trends</p>
              </div>
              <div className="feature-card">
                <FaBullseye className="feature-icon" />
                <h3>Goal Tracking</h3>
                <p>Set and track your score goals with progress indicators</p>
              </div>
              <div className="feature-card">
                <FaFileDownload className="feature-icon" />
                <h3>Reports & Export</h3>
                <p>Generate detailed reports and export data in PDF, CSV, or JSON formats</p>
              </div>
              <div className="feature-card">
                <FaMobileAlt className="feature-icon" />
                <h3>Mobile-First Design</h3>
                <p>Optimized for mobile devices with responsive layouts and touch-friendly controls</p>
              </div>
              <div className="feature-card">
                <FaDatabase className="feature-icon" />
                <h3>Local Storage</h3>
                <p>Fast, secure data storage directly in your browser - no server required</p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2 className="section-title">
              <FaLightbulb className="section-icon" />
              How to Use
            </h2>
            <div className="instructions-list">
              <div className="instruction-item">
                <div className="instruction-number">1</div>
                <div className="instruction-content">
                  <h3>Add Your First Test</h3>
                  <p>Go to <strong>Add Test</strong> and enter your test details. Fill in the total questions, correct, incorrect, and skipped questions. 
                  Then add subject-wise breakdown for detailed analysis.</p>
                </div>
              </div>
              <div className="instruction-item">
                <div className="instruction-number">2</div>
                <div className="instruction-content">
                  <h3>View Your Dashboard</h3>
                  <p>The <strong>Dashboard</strong> provides an overview of your overall performance, including trends, best/worst scores, 
                  and visual charts showing your progress over time.</p>
                </div>
              </div>
              <div className="instruction-item">
                <div className="instruction-number">3</div>
                <div className="instruction-content">
                  <h3>Analyze Individual Tests</h3>
                  <p>Click <strong>View</strong> on any test from the <strong>Tests</strong> page to see detailed insights, 
                  subject-wise performance, and comparisons with previous tests.</p>
                </div>
              </div>
              <div className="instruction-item">
                <div className="instruction-number">4</div>
                <div className="instruction-content">
                  <h3>Set Goals</h3>
                  <p>Use the <strong>Goals</strong> page to set target scores for overall performance and individual subjects. 
                  Track your progress towards these goals.</p>
                </div>
              </div>
              <div className="instruction-item">
                <div className="instruction-number">5</div>
                <div className="instruction-content">
                  <h3>Export & Backup</h3>
                  <p>Regularly export your data from <strong>Settings</strong> to keep backups. You can export in JSON, CSV, or PDF formats. 
                  Import your data anytime to restore it.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2 className="section-title">
              <FaInfoCircle className="section-icon" />
              Exam Pattern
            </h2>
            <div className="exam-pattern-card">
              <p className="section-text">
                This app is designed for exams with the following pattern:
              </p>
              <ul className="pattern-list">
                <li><strong>Total Marks:</strong> 800</li>
                <li><strong>Total Questions:</strong> 200 MCQs</li>
                <li><strong>Marking Scheme:</strong> +4 for correct, -1 for incorrect, 0 for unattempted</li>
                <li><strong>Subjects:</strong> 19 preset medical subjects (customizable)</li>
              </ul>
            </div>
          </section>

          <section className="about-section">
            <h2 className="section-title">
              <FaInfoCircle className="section-icon" />
              Tips for Best Results
            </h2>
            <ul className="tips-list">
              <li>Enter test data immediately after taking the exam for accurate tracking</li>
              <li>Use the preset subjects feature to maintain consistency across tests</li>
              <li>Review the dashboard regularly to identify patterns and areas for improvement</li>
              <li>Set realistic goals and track your progress towards them</li>
              <li>Export your data regularly to prevent data loss</li>
              <li>Use the comparison features to see how you're improving over time</li>
            </ul>
          </section>
        </div>

        <div className="about-footer">
          <p className="footer-text">
            Made with <span className="heart">❤️</span> by <strong>Siddharth Dagar</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;

