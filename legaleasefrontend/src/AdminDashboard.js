import React, { useEffect, useState, useRef } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, ArcElement, BarElement,
  Title, Tooltip, Legend,
} from 'chart.js';
import { FaUserCircle } from 'react-icons/fa';
import './AdminDashboard.css';

ChartJS.register(CategoryScale, LinearScale, ArcElement, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [lightMode, setLightMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetch('http://localhost:5050/admin-documents')
      .then(res => res.json())
      .then(data => setDocuments(data))
      .catch(err => console.error('❌ Admin doc fetch failed:', err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.className = lightMode ? 'light-mode' : 'dark-mode';
  }, [lightMode]);

  const entityCounts = {};
  documents.forEach(doc => {
    (doc.entities || []).forEach(([text, label]) => {
      entityCounts[label] = (entityCounts[label] || 0) + 1;
    });
  });

  const labels = Object.keys(entityCounts);
  const counts = Object.values(entityCounts);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: lightMode ? '#000' : '#fff' },
      }
    },
    scales: {
      x: {
        ticks: { color: lightMode ? '#000' : '#fff' },
        grid: { display: false }
      },
      y: {
        ticks: { color: lightMode ? '#000' : '#fff' },
        grid: { display: false }
      }
    }
  };

  const barData = {
    labels,
    datasets: [{
      label: 'Entity Count',
      data: counts,
      backgroundColor: lightMode ? '#4f46e5' : 'rgba(54, 162, 235, 0.7)',
      borderRadius: 6,
    }],
  };

  const pieData = {
    labels,
    datasets: [{
      data: counts,
      backgroundColor: [
        '#4e79a7', '#f28e2b', '#e15759', '#76b7b2',
        '#59a14f', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab'
      ],
    }],
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/logout';
  };

  return (
    <div className={lightMode ? 'light-mode' : 'dark-mode'}>
      {/* Navbar */}
      <nav className="dashboard-navbar">
        <div className="admin-navbar-title">LegalEase Admin</div>
        <div className="admin-navbar-user" ref={dropdownRef}>
          <FaUserCircle className="user-icon" onClick={() => setShowUserMenu(!showUserMenu)} />
          {showUserMenu && (
            <div className="user-dropdown">
              <div className="dropdown-item" onClick={() => setLightMode(!lightMode)}>
                {lightMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </div>
              <div className="dropdown-item" onClick={handleLogout}>
                🚪 Logout
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="admin-wrapper">
        <h2>Analytics Overview</h2>
        <div className="dashboard-summary">
            <h4>Total Documents Analyzed</h4>
            <div className="dashboard-stat">
                <span>{documents.length}</span>
            </div>
        </div>

        {/* CHARTS */}
        <div className="graphs-row">
          <div className="graph-container">
            <h4>Named Entity Frequency</h4>
            <Bar data={barData} options={chartOptions} />
          </div>
          <div className="graph-container small">
            <h4>Entity Label Distribution</h4>
            <Pie data={pieData} options={chartOptions} />
          </div>
        </div>

        {/* FILTER */}
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Filter by title or entity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="admin-doc-table">
          <h4 style={{ marginTop: '20px' }}>Recent Document Summaries</h4>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Timestamp</th>
                <th>Summary</th>
                <th>Entities</th>
              </tr>
            </thead>
            <tbody>
              {documents
                .filter(doc =>
                  doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  doc.entities.some(([text, label]) =>
                    label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    text.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                )
                .map(doc => (
                  <tr key={doc.id}>
                    <td>{doc.title}</td>
                    <td>{doc.timestamp}</td>
                    <td style={{ maxWidth: '300px' }}>{doc.summary}</td>
                    <td>
                      <ul style={{ paddingLeft: '15px', margin: 0 }}>
                        {doc.entities.map(([text, label], idx) => (
                          <li key={idx}><strong>{text}</strong> <em>({label})</em></li>
                        ))}
                      </ul>
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
