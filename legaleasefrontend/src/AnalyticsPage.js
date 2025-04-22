import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FaUserCircle } from 'react-icons/fa';
import './AnalyticsPage.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AnalyticsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [lightMode, setLightMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5050/recent-documents')
      .then(res => res.json())
      .then(data => setDocuments(data))
      .catch(err => console.error('❌ Analytics fetch failed:', err));
  }, []);

  const getFrequentEntities = () => {
    const freqMap = {};
    documents.forEach(doc => {
      (doc.entities || []).forEach(([text, label]) => {
        const key = `${text} (${label})`;
        freqMap[key] = (freqMap[key] || 0) + 1;
      });
    });

    return Object.entries(freqMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  };

  const getLabelCounts = () => {
    const labelMap = {};
    documents.forEach(doc => {
      (doc.entities || []).forEach(([, label]) => {
        labelMap[label] = (labelMap[label] || 0) + 1;
      });
    });

    return Object.entries(labelMap).sort((a, b) => b[1] - a[1]);
  };

  const getEntityChartData = () => {
    const entries = getFrequentEntities();
    return {
      labels: entries.map(([key]) => key),
      datasets: [
        {
          label: 'Entity Frequency',
          data: entries.map(([, count]) => count),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    };
  };

  const getLabelChartData = () => {
    const entries = getLabelCounts();
    return {
      labels: entries.map(([label]) => label),
      datasets: [
        {
          label: 'Label Frequency',
          data: entries.map(([, count]) => count),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    };
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/logout';
  };

  return (
    <div className={`dashboard-wrapper ${lightMode ? 'light-mode' : ''}`}>
      {/* NAVBAR */}
      <nav className="dashboard-navbar">
        <div className="navbar-title">LegalEase</div>
        <div className="navbar-user-wrapper" onClick={() => setShowUserMenu(!showUserMenu)}>
          <FaUserCircle className="user-icon" />
          <span className="username"></span>
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

      {/* ANALYTICS */}
      <div className="analytics-wrapper">
        <h2>Analytics</h2>
        <section className="analytics-section">
            <h3>Insights Summary</h3>
            <div className="insights-row">
            <div className="insight-box"><strong>Total Documents</strong><p>{documents.length}</p></div>  <div className="insight-box">
        <strong>Most Frequent Entity</strong>
        <p>{getFrequentEntities()[0]?.[0] || 'N/A'}</p>
      </div>
      <div className="insight-box">
        <strong>Most Frequent Label</strong>
        <p>{getLabelCounts()[0]?.[0] || 'N/A'}</p>
      </div>
      <div className="insight-box">
        <strong>Total Unique Entities</strong>
        <p>{
          new Set(documents.flatMap(d => (d.entities || []).map(([text]) => text))).size
        }</p>
      </div>
      <div className="insight-box">
        <strong>Total Unique Labels</strong>
        <p>{
          new Set(documents.flatMap(d => (d.entities || []).map(([, label]) => label))).size
        }</p>
      </div>
    </div>
  </section>


        <section className="analytics-section">
          <h3>Top Named Entities & Labels</h3>
          <div className="graphs-row">
            <div className="graph-container">
              <Bar
                data={getEntityChartData()}
                options={{ responsive: true, plugins: { title: { display: true, text: "Top Entities" } } }}
              />
            </div>
            <div className="graph-container">
              <Bar
                data={getLabelChartData()}
                options={{ responsive: true, plugins: { title: { display: true, text: "Entity Labels" } } }}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AnalyticsPage;
