import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { testService } from '../services/storage';
import { FaPlus, FaTrash, FaSave, FaCheckSquare } from 'react-icons/fa';
import './AddTest.css';

// Preset list of 19 subjects
const PRESET_SUBJECTS = [
  'Anatomy',
  'Physiology',
  'Biochemistry',
  'Pathology',
  'Microbiology',
  'Pharmacology',
  'Forensic Medicine',
  'Community Medicine',
  'Medicine',
  'Surgery',
  'Obstetrics & Gynaecology',
  'Paediatrics',
  'Psychiatry',
  'Dermatology',
  'Ophthalmology',
  'ENT',
  'Orthopaedics',
  'Radiology',
  'Anaesthesia',
];

function AddTest() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    testDate: new Date().toISOString().split('T')[0],
    totalQuestions: 200,
    correctQuestions: 0,
    incorrectQuestions: 0,
    skippedQuestions: 0,
    subjects: [],
  });

  const [subjectForm, setSubjectForm] = useState({
    subjectName: '',
    totalQuestions: 0,
    correctQuestions: 0,
    incorrectQuestions: 0,
    skippedQuestions: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Remove leading zeros for number inputs
    const numValue = value === '' ? '' : parseInt(value) || 0;
    setFormData((prev) => ({
      ...prev,
      [name]: numValue,
    }));
  };

  const handleSubjectInputChange = (e) => {
    const { name, value } = e.target;
    // Remove leading zeros for number inputs
    const numValue = name === 'subjectName' ? value : (value === '' ? '' : parseInt(value) || 0);
    setSubjectForm((prev) => ({
      ...prev,
      [name]: name === 'subjectName' ? value : numValue,
    }));
  };

  const addSubject = () => {
    if (!subjectForm.subjectName.trim()) {
      alert('Please enter a subject name');
      return;
    }

    const total = subjectForm.correctQuestions + subjectForm.incorrectQuestions + subjectForm.skippedQuestions;
    if (total > formData.totalQuestions) {
      alert(`Subject questions (${total}) cannot exceed total questions (${formData.totalQuestions})`);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      subjects: [...prev.subjects, { ...subjectForm }],
    }));

    setSubjectForm({
      subjectName: '',
      totalQuestions: 0,
      correctQuestions: 0,
      incorrectQuestions: 0,
      skippedQuestions: 0,
    });
  };

  const removeSubject = (index) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index),
    }));
  };

  // Add all preset subjects at once (empty fields, user fills in)
  const addAllSubjects = () => {
    const existingSubjects = formData.subjects.map(s => s.subjectName);
    const subjectsToAdd = PRESET_SUBJECTS
      .filter(subject => !existingSubjects.includes(subject))
      .map(subject => ({
        subjectName: subject,
        totalQuestions: 0,
        correctQuestions: 0,
        incorrectQuestions: 0,
        skippedQuestions: 0,
      }));

    if (subjectsToAdd.length === 0) {
      alert('All preset subjects are already added!');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      subjects: [...prev.subjects, ...subjectsToAdd],
    }));

    alert(`Added ${subjectsToAdd.length} subjects. Please fill in the question details for each subject.`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const total = formData.correctQuestions + formData.incorrectQuestions + formData.skippedQuestions;
    if (total !== formData.totalQuestions) {
      alert(`Total questions (${total}) must equal ${formData.totalQuestions}`);
      return;
    }

    const subjectTotal = formData.subjects.reduce((sum, sub) => {
      return sum + sub.correctQuestions + sub.incorrectQuestions + sub.skippedQuestions;
    }, 0);

    if (subjectTotal !== formData.totalQuestions) {
      alert(`Sum of all subject questions (${subjectTotal}) must equal total questions (${formData.totalQuestions})`);
      return;
    }

    if (formData.subjects.length === 0) {
      alert('Please add at least one subject');
      return;
    }

    setLoading(true);
    try {
      await testService.create(formData);
      alert('Test added successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error adding test:', error);
      alert('Error adding test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate marks based on exam pattern
  const calculateMarks = (correct, incorrect) => {
    return (correct * 4) - (incorrect * 1);
  };

  const totalMarks = calculateMarks(formData.correctQuestions, formData.incorrectQuestions);
  const percentage = formData.totalQuestions > 0 
    ? ((totalMarks / (formData.totalQuestions * 4)) * 100).toFixed(2)
    : 0;

  return (
    <div className="add-test">
      <h1 className="page-title">Add New Test</h1>

      <form onSubmit={handleSubmit} className="test-form">
        <div className="card">
          <h2 className="card-title">Test Overview</h2>
          
          <div className="form-group">
            <label className="form-label">Test Date</label>
            <input
              type="date"
              name="testDate"
              value={formData.testDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, testDate: e.target.value }))}
              className="form-input"
              required
            />
          </div>

          <div className="form-row">
              <div className="form-group">
                <label className="form-label">Total Questions</label>
                <input
                  type="number"
                  name="totalQuestions"
                  value={formData.totalQuestions || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  min="1"
                  required
                  placeholder="200"
                />
              </div>

            <div className="form-group">
              <label className="form-label">Correct Questions</label>
              <input
                type="number"
                name="correctQuestions"
                value={formData.correctQuestions || ''}
                onChange={handleInputChange}
                className={`form-input ${((formData.correctQuestions || 0) + (formData.incorrectQuestions || 0) + (formData.skippedQuestions || 0)) > (formData.totalQuestions || 0) && formData.totalQuestions > 0 ? 'input-error' : ''}`}
                min="0"
                max={formData.totalQuestions || 200}
                required
                placeholder="0"
              />
              {((formData.correctQuestions || 0) + (formData.incorrectQuestions || 0) + (formData.skippedQuestions || 0)) > (formData.totalQuestions || 0) && formData.totalQuestions > 0 && (
                <div className="field-error">
                  Sum exceeds total questions ({((formData.correctQuestions || 0) + (formData.incorrectQuestions || 0) + (formData.skippedQuestions || 0))} > {formData.totalQuestions})
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Incorrect Questions</label>
              <input
                type="number"
                name="incorrectQuestions"
                value={formData.incorrectQuestions || ''}
                onChange={handleInputChange}
                className={`form-input ${((formData.correctQuestions || 0) + (formData.incorrectQuestions || 0) + (formData.skippedQuestions || 0)) > (formData.totalQuestions || 0) && formData.totalQuestions > 0 ? 'input-error' : ''}`}
                min="0"
                max={formData.totalQuestions || 200}
                required
                placeholder="0"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Skipped Questions</label>
              <input
                type="number"
                name="skippedQuestions"
                value={formData.skippedQuestions || ''}
                onChange={handleInputChange}
                className={`form-input ${((formData.correctQuestions || 0) + (formData.incorrectQuestions || 0) + (formData.skippedQuestions || 0)) > (formData.totalQuestions || 0) && formData.totalQuestions > 0 ? 'input-error' : ''}`}
                min="0"
                max={formData.totalQuestions || 200}
                required
                placeholder="0"
              />
            </div>
          </div>

          <div className="calculated-marks">
            <div className="mark-item">
              <span className="mark-label">Total Marks:</span>
              <span className="mark-value">{totalMarks} / {formData.totalQuestions * 4}</span>
            </div>
            <div className="mark-item">
              <span className="mark-label">Percentage:</span>
              <span className="mark-value">{percentage}%</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">Subject-wise Breakdown</h2>
          
          {/* Quick Add All Subjects Button */}
          <div className="quick-add-section">
            <button
              type="button"
              onClick={addAllSubjects}
              className="btn btn-secondary"
              disabled={formData.subjects.length >= PRESET_SUBJECTS.length}
            >
              <FaCheckSquare /> Add All 19 Preset Subjects
            </button>
            <p className="quick-add-info">
              Quickly add all preset subjects (Anatomy, Physiology, Biochemistry, etc.) and then fill in the details for each.
            </p>
          </div>
          
          <div className="subject-input-section">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Subject Name</label>
                <input
                  type="text"
                  name="subjectName"
                  value={subjectForm.subjectName}
                  onChange={handleSubjectInputChange}
                  className="form-input"
                  list="preset-subjects"
                  placeholder="Type or select from preset subjects"
                  autoComplete="off"
                />
                <datalist id="preset-subjects">
                  {PRESET_SUBJECTS.map((subject) => (
                    <option key={subject} value={subject} />
                  ))}
                </datalist>
                <small className="form-hint">
                  Start typing to see preset subjects, or type a custom name
                </small>
              </div>

              <div className="form-group">
                <label className="form-label">Total Questions</label>
                <input
                  type="number"
                  name="totalQuestions"
                  value={subjectForm.totalQuestions || ''}
                  onChange={handleSubjectInputChange}
                  className="form-input"
                  min="0"
                  placeholder="0"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Correct</label>
                <input
                  type="number"
                  name="correctQuestions"
                  value={subjectForm.correctQuestions || ''}
                  onChange={handleSubjectInputChange}
                  className={`form-input ${((subjectForm.correctQuestions || 0) + (subjectForm.incorrectQuestions || 0) + (subjectForm.skippedQuestions || 0)) > (subjectForm.totalQuestions || 0) && subjectForm.totalQuestions > 0 ? 'input-error' : ''}`}
                  min="0"
                  placeholder="0"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Incorrect</label>
                <input
                  type="number"
                  name="incorrectQuestions"
                  value={subjectForm.incorrectQuestions || ''}
                  onChange={handleSubjectInputChange}
                  className={`form-input ${((subjectForm.correctQuestions || 0) + (subjectForm.incorrectQuestions || 0) + (subjectForm.skippedQuestions || 0)) > (subjectForm.totalQuestions || 0) && subjectForm.totalQuestions > 0 ? 'input-error' : ''}`}
                  min="0"
                  placeholder="0"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Skipped</label>
                <input
                  type="number"
                  name="skippedQuestions"
                  value={subjectForm.skippedQuestions || ''}
                  onChange={handleSubjectInputChange}
                  className={`form-input ${((subjectForm.correctQuestions || 0) + (subjectForm.incorrectQuestions || 0) + (subjectForm.skippedQuestions || 0)) > (subjectForm.totalQuestions || 0) && subjectForm.totalQuestions > 0 ? 'input-error' : ''}`}
                  min="0"
                  placeholder="0"
                />
                {((subjectForm.correctQuestions || 0) + (subjectForm.incorrectQuestions || 0) + (subjectForm.skippedQuestions || 0)) > (subjectForm.totalQuestions || 0) && subjectForm.totalQuestions > 0 && (
                  <div className="field-error">
                    Sum ({((subjectForm.correctQuestions || 0) + (subjectForm.incorrectQuestions || 0) + (subjectForm.skippedQuestions || 0))}) exceeds total questions ({subjectForm.totalQuestions})
                  </div>
                )}
              </div>

              <div className="form-group">
                <button type="button" onClick={addSubject} className="btn btn-primary">
                  <FaPlus /> Add Subject
                </button>
              </div>
            </div>
          </div>

          {formData.subjects.length > 0 && (
            <div className="subjects-list">
              <h3>Added Subjects ({formData.subjects.length})</h3>
              <p className="table-hint">
                💡 Tip: You can edit the numbers directly in the table cells below!
              </p>
              <div className="subjects-table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Total Q</th>
                      <th>Correct</th>
                      <th>Incorrect</th>
                      <th>Skipped</th>
                      <th>Marks</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.subjects.map((subject, index) => {
                      const marks = calculateMarks(subject.correctQuestions || 0, subject.incorrectQuestions || 0);
                      const handleSubjectFieldChange = (field, value) => {
                        const updatedSubjects = [...formData.subjects];
                        // Remove leading zeros
                        const numValue = value === '' ? '' : parseInt(value) || 0;
                        updatedSubjects[index] = {
                          ...updatedSubjects[index],
                          [field]: numValue,
                        };
                        setFormData(prev => ({
                          ...prev,
                          subjects: updatedSubjects,
                        }));
                      };
                      
                      const subjectTotal = (subject.correctQuestions || 0) + (subject.incorrectQuestions || 0) + (subject.skippedQuestions || 0);
                      const subjectTotalQ = subject.totalQuestions || 0;
                      const hasError = subjectTotalQ > 0 && subjectTotal > subjectTotalQ;
                      const hasOverallError = (formData.totalQuestions || 0) > 0 && subjectTotal > (formData.totalQuestions || 0);
                      
                      return (
                        <tr key={index} className={hasError || hasOverallError ? 'row-error' : ''}>
                          <td><strong>{subject.subjectName}</strong></td>
                          <td>
                            <input
                              type="number"
                              value={subject.totalQuestions || ''}
                              onChange={(e) => handleSubjectFieldChange('totalQuestions', e.target.value)}
                              className={`table-input ${hasError ? 'input-error' : ''}`}
                              min="0"
                              placeholder="0"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={subject.correctQuestions || ''}
                              onChange={(e) => handleSubjectFieldChange('correctQuestions', e.target.value)}
                              className={`table-input ${hasError || hasOverallError ? 'input-error' : ''}`}
                              min="0"
                              placeholder="0"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={subject.incorrectQuestions || ''}
                              onChange={(e) => handleSubjectFieldChange('incorrectQuestions', e.target.value)}
                              className={`table-input ${hasError || hasOverallError ? 'input-error' : ''}`}
                              min="0"
                              placeholder="0"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={subject.skippedQuestions || ''}
                              onChange={(e) => handleSubjectFieldChange('skippedQuestions', e.target.value)}
                              className={`table-input ${hasError || hasOverallError ? 'input-error' : ''}`}
                              min="0"
                              placeholder="0"
                            />
                          </td>
                          <td>
                            <strong className={marks < 0 ? 'negative-marks' : ''}>{marks}</strong>
                            {(hasError || hasOverallError) && (
                              <div className="error-message">
                                {hasError 
                                  ? `Exceeds total (${subjectTotal} > ${subjectTotalQ})`
                                  : `Exceeds overall (${subjectTotal} > ${formData.totalQuestions})`
                                }
                              </div>
                            )}
                          </td>
                          <td>
                            <button
                              type="button"
                              onClick={() => removeSubject(index)}
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
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <FaSave /> {loading ? 'Saving...' : 'Save Test'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddTest;

