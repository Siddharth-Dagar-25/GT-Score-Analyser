import React, { useState } from 'react';
import { exportData, importData, clearAllData } from '../services/storage';
import { FaDownload, FaUpload, FaTrash, FaInfoCircle } from 'react-icons/fa';
import './Settings.css';

function Settings() {
  const [importFile, setImportFile] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `score_analyser_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    alert('Data exported successfully!');
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (window.confirm('This will replace all existing data. Are you sure?')) {
          importData(data);
          alert('Data imported successfully! Please refresh the page.');
          window.location.reload();
        }
      } catch (error) {
        alert('Error importing file. Please check the file format.');
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you absolutely sure? This will delete ALL your test data and goals. This cannot be undone!')) {
      clearAllData();
      alert('All data cleared. Refreshing page...');
      window.location.reload();
    }
  };

  const storageInfo = () => {
    const data = exportData();
    const size = new Blob([JSON.stringify(data)]).size;
    const sizeKB = (size / 1024).toFixed(2);
    const sizeMB = (size / (1024 * 1024)).toFixed(2);
    return { size, sizeKB, sizeMB, tests: data.tests?.length || 0 };
  };

  const info = storageInfo();

  return (
    <div className="settings">
      <h1 className="page-title">Settings & Data Management</h1>

      <div className="card">
        <h2 className="card-title">Storage Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Total Tests</span>
            <span className="info-value">{info.tests}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Storage Used</span>
            <span className="info-value">
              {info.sizeMB > 1 ? `${info.sizeMB} MB` : `${info.sizeKB} KB`}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Storage Type</span>
            <span className="info-value">Browser LocalStorage</span>
          </div>
        </div>
        <div className="info-note">
          <FaInfoCircle /> Data is stored locally in your browser. It's fast and works offline!
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Backup & Restore</h2>
        <div className="action-buttons">
          <button onClick={handleExport} className="btn btn-primary">
            <FaDownload /> Export Data (Backup)
          </button>
          <label className="btn btn-secondary">
            <FaUpload /> Import Data (Restore)
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
          </label>
        </div>
        <p className="action-info">
          Export your data as a JSON file for backup. You can restore it later using the Import button.
        </p>
      </div>

      <div className="card danger-zone">
        <h2 className="card-title">Danger Zone</h2>
        <button onClick={handleClearAll} className="btn btn-danger">
          <FaTrash /> Clear All Data
        </button>
        <p className="danger-warning">
          ⚠️ This will permanently delete all your tests and goals. Make sure you have exported your data first!
        </p>
      </div>
    </div>
  );
}

export default Settings;

