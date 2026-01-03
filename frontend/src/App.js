import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import AddTest from './components/AddTest';
import TestList from './components/TestList';
import TestDetail from './components/TestDetail';
import Goals from './components/Goals';
import Reports from './components/Reports';
import Settings from './components/Settings';
import About from './components/About';
import { FaChartLine, FaPlus, FaList, FaBullseye, FaFileDownload, FaMoon, FaSun, FaCog, FaBars, FaTimes, FaInfoCircle } from 'react-icons/fa';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Router>
      <div className="app">
        <Navbar toggleTheme={toggleTheme} theme={theme} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-test" element={<AddTest />} />
            <Route path="/tests" element={<TestList />} />
            <Route path="/tests/:id" element={<TestDetail />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Navbar({ toggleTheme, theme }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { path: '/', icon: FaChartLine, label: 'Dashboard' },
    { path: '/add-test', icon: FaPlus, label: 'Add Test' },
    { path: '/tests', icon: FaList, label: 'Tests' },
    { path: '/goals', icon: FaBullseye, label: 'Goals' },
    { path: '/reports', icon: FaFileDownload, label: 'Reports' },
    { path: '/settings', icon: FaCog, label: 'Settings' },
    { path: '/about', icon: FaInfoCircle, label: 'About' },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
            <FaChartLine /> Score Analyser
          </Link>
          <div className="navbar-links">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={isActive(link.path) ? 'active' : ''}
                >
                  <Icon /> {link.label}
                </Link>
              );
            })}
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'light' ? <FaMoon /> : <FaSun />}
            </button>
          </div>
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={closeMobileMenu}
      />

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <span style={{ fontWeight: 'bold', color: 'var(--accent-color)' }}>Menu</span>
          <button className="mobile-menu-close" onClick={closeMobileMenu} aria-label="Close menu">
            <FaTimes />
          </button>
        </div>
        <div className="mobile-menu-links">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={isActive(link.path) ? 'active' : ''}
                onClick={closeMobileMenu}
              >
                <Icon /> {link.label}
              </Link>
            );
          })}
          <button
            className="mobile-menu-links"
            onClick={() => {
              toggleTheme();
              closeMobileMenu();
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              padding: '1rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '1rem',
              minHeight: '48px',
              marginBottom: '0.25rem',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            {theme === 'light' ? <FaMoon /> : <FaSun />} {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>
      </div>
    </>
  );
}

export default App;

