import React, { useState, useEffect } from 'react';
import { testService, goalService } from '../services/storage';
import { FaDownload, FaFilePdf } from 'react-icons/fa';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import './Reports.css';

function Reports() {
  const [tests, setTests] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [subjectAnalytics, setSubjectAnalytics] = useState([]);
  const [goals, setGoals] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [testsRes, analyticsRes, subjectRes, goalsRes] = await Promise.all([
        testService.getAll(),
        testService.getAnalytics(),
        testService.getSubjectAnalytics(),
        goalService.get(),
      ]);
      setTests(testsRes.data);
      setAnalytics(analyticsRes.data);
      setSubjectAnalytics(subjectRes.data);
      setGoals(goalsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (tests.length === 0) {
      alert('No data to export');
      return;
    }

    // Test data CSV
    const testHeaders = ['Test Date', 'Total Marks', 'Marks Obtained', 'Percentage', 'Correct', 'Incorrect', 'Skipped'];
    const testRows = tests.map((test) => [
      format(new Date(test.testDate), 'yyyy-MM-dd'),
      test.totalMarks,
      test.marksObtained,
      test.percentage.toFixed(2),
      test.correctQuestions,
      test.incorrectQuestions,
      test.skippedQuestions,
    ]);

    const testCSV = [
      testHeaders.join(','),
      ...testRows.map((row) => row.join(',')),
    ].join('\n');

    // Subject data CSV
    const subjectHeaders = ['Test Date', 'Subject', 'Marks Obtained', 'Total Marks', 'Percentage', 'Weightage'];
    const subjectRows = [];
    tests.forEach((test) => {
      test.subjects.forEach((subject) => {
        subjectRows.push([
          format(new Date(test.testDate), 'yyyy-MM-dd'),
          subject.subjectName,
          subject.marksObtained,
          subject.totalMarks,
          subject.percentage.toFixed(2),
          subject.weightage.toFixed(2),
        ]);
      });
    });

    const subjectCSV = [
      subjectHeaders.join(','),
      ...subjectRows.map((row) => row.join(',')),
    ].join('\n');

    // Download files
    const downloadCSV = (csv, filename) => {
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    };

    downloadCSV(testCSV, 'test_scores.csv');
    downloadCSV(subjectCSV, 'subject_scores.csv');
    alert('Data exported successfully!');
  };

  const generatePDFReport = () => {
    if (!analytics || tests.length === 0) {
      alert('No data available for report');
      return;
    }

    const doc = new jsPDF();
    let yPosition = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    const lineHeight = 7;
    const sectionSpacing = 10;

    // Helper function to add new page if needed
    const checkPageBreak = (requiredSpace = 20) => {
      if (yPosition + requiredSpace > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        yPosition = 20;
        return true;
      }
      return false;
    };

    // Helper function to add text with word wrap
    const addText = (text, fontSize = 12, isBold = false, color = [0, 0, 0]) => {
      checkPageBreak(10);
      doc.setFontSize(fontSize);
      doc.setTextColor(color[0], color[1], color[2]);
      if (isBold) {
        doc.setFont(undefined, 'bold');
      } else {
        doc.setFont(undefined, 'normal');
      }
      
      const lines = doc.splitTextToSize(text, contentWidth);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * (fontSize * 0.4) + 3;
    };

    // Title
    doc.setFontSize(20);
    doc.setTextColor(79, 70, 229);
    doc.setFont(undefined, 'bold');
    doc.text('Performance Report', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont(undefined, 'normal');
    doc.text(`Generated on: ${format(new Date(), 'MMMM dd, yyyy')}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += sectionSpacing;

    // Overall Performance Summary
    addText('OVERALL PERFORMANCE SUMMARY', 14, true, [79, 70, 229]);
    yPosition += 2;
    
    const summaryData = [
      ['Total Tests', analytics.totalTests.toString()],
      ['Average Score', `${analytics.averageScore} / 800`],
      ['Average Percentage', `${analytics.averagePercentage.toFixed(2)}%`],
      ['Best Score', `${analytics.bestScore} / 800`],
      ['Worst Score', `${analytics.worstScore} / 800`],
      ['Latest Score', `${analytics.latestScore} / 800`],
      ['Score Variance', analytics.scoreVariance.toFixed(2)],
      ['Overall Improvement', `${analytics.improvement >= 0 ? '+' : ''}${analytics.improvement.toFixed(2)}%`],
    ];

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    summaryData.forEach(([label, value]) => {
      checkPageBreak();
      doc.setFont(undefined, 'bold');
      doc.text(`${label}:`, margin, yPosition);
      doc.setFont(undefined, 'normal');
      doc.text(value, margin + 80, yPosition);
      yPosition += lineHeight;
    });

    yPosition += sectionSpacing;

    // Test-wise Performance
    addText('TEST-WISE PERFORMANCE', 14, true, [79, 70, 229]);
    yPosition += 2;

    const sortedTests = [...tests].sort((a, b) => new Date(a.testDate) - new Date(b.testDate));
    sortedTests.forEach((test, index) => {
      checkPageBreak(15);
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.text(`Test ${index + 1} - ${format(new Date(test.testDate), 'MMM dd, yyyy')}`, margin, yPosition);
      yPosition += lineHeight;

      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`  Score: ${test.marksObtained} / ${test.totalMarks} (${test.percentage.toFixed(2)}%)`, margin + 5, yPosition);
      yPosition += lineHeight;
      doc.text(`  Correct: ${test.correctQuestions} | Incorrect: ${test.incorrectQuestions} | Skipped: ${test.skippedQuestions}`, margin + 5, yPosition);
      yPosition += lineHeight + 2;
    });

    yPosition += sectionSpacing;

    // Subject-wise Analysis
    addText('SUBJECT-WISE ANALYSIS', 14, true, [79, 70, 229]);
    yPosition += 2;

    subjectAnalytics.forEach((subject) => {
      checkPageBreak(20);
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.text(subject.subjectName, margin, yPosition);
      yPosition += lineHeight;

      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`  Average Score: ${subject.averageScore.toFixed(2)}`, margin + 5, yPosition);
      yPosition += lineHeight;
      doc.text(`  Average Percentage: ${subject.averagePercentage.toFixed(2)}%`, margin + 5, yPosition);
      yPosition += lineHeight;
      doc.text(`  Best Score: ${subject.bestScore}`, margin + 5, yPosition);
      yPosition += lineHeight;
      doc.text(`  Latest Score: ${subject.latestScore}`, margin + 5, yPosition);
      yPosition += lineHeight;
      doc.text(`  Improvement: ${subject.improvement >= 0 ? '+' : ''}${subject.improvement.toFixed(2)}%`, margin + 5, yPosition);
      yPosition += lineHeight;
      doc.text(`  Weightage: ${subject.weightage.toFixed(2)}%`, margin + 5, yPosition);
      yPosition += lineHeight + 2;
    });

    // Goals & Targets
    if (goals && goals.overallTargetScore) {
      yPosition += sectionSpacing;
      addText('GOALS & TARGETS', 14, true, [79, 70, 229]);
      yPosition += 2;

      checkPageBreak(15);
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Overall Target: ${goals.overallTargetScore}`, margin, yPosition);
      yPosition += lineHeight;
      doc.text(`Current Progress: ${((analytics.latestScore / goals.overallTargetScore) * 100).toFixed(1)}%`, margin, yPosition);
      yPosition += lineHeight;

      if (goals.subjectGoals && goals.subjectGoals.length > 0) {
        doc.text('Subject Goals:', margin, yPosition);
        yPosition += lineHeight;
        goals.subjectGoals.forEach((goal) => {
          checkPageBreak();
          doc.text(`  ${goal.subjectName}: ${goal.targetScore}`, margin + 5, yPosition);
          yPosition += lineHeight;
        });
      }
    }

    // Recommendations
    yPosition += sectionSpacing;
    addText('RECOMMENDATIONS', 14, true, [79, 70, 229]);
    yPosition += 2;

    const weakSubjects = subjectAnalytics.filter((s) => s.averagePercentage < 70);
    checkPageBreak(15);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    
    if (weakSubjects.length > 0) {
      weakSubjects.forEach((subject) => {
        checkPageBreak();
        doc.text(`• Focus on improving ${subject.subjectName} (Current: ${subject.averagePercentage.toFixed(1)}%)`, margin, yPosition);
        yPosition += lineHeight;
      });
    } else {
      doc.text('• Keep up the good work! All subjects are performing well.', margin, yPosition);
      yPosition += lineHeight;
    }

    // Footer on last page
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    // Save PDF
    doc.save(`performance_report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    alert('PDF report generated successfully!');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (tests.length === 0) {
    return (
      <div className="empty-state">
        <p>No data available for reports. Add some tests first!</p>
      </div>
    );
  }

  return (
    <div className="reports">
      <h1 className="page-title">Reports & Export</h1>

      <div className="card">
        <h2 className="card-title">Export Options</h2>
        <div className="export-options">
          <button onClick={exportToCSV} className="btn btn-secondary">
            <FaDownload /> Export to CSV
          </button>
          <button onClick={generatePDFReport} className="btn btn-primary">
            <FaFilePdf /> Generate PDF Report
          </button>
        </div>
        <p className="export-info">
          Export your test data to CSV format or generate a comprehensive PDF report with all performance analytics and insights.
        </p>
      </div>

      {analytics && (
        <div className="card">
          <h2 className="card-title">Quick Summary</h2>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Total Tests</span>
              <span className="summary-value">{analytics.totalTests}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Average Score</span>
              <span className="summary-value">{analytics.averageScore}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Best Score</span>
              <span className="summary-value">{analytics.bestScore}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Improvement</span>
              <span className={`summary-value ${analytics.improvement >= 0 ? 'positive' : 'negative'}`}>
                {analytics.improvement >= 0 ? '+' : ''}{analytics.improvement.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;

