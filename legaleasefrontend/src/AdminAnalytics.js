import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from 'chart.js';
import './AdminDashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminAnalytics = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5050/admin-documents')
      .then(res => res.json())
      .then(data => setDocuments(data))
      .catch(err => console.error('❌ Analytics fetch failed:', err));
  }, []);

  const getTopLabels = () => {
    const labelMap = {};
    documents.forEach(doc => {
      (doc.entities || []).forEach(([, label]) => {
        labelMap[label] = (labelMap[label] || 0) + 1;
      });
    });

    return Object.entries(labelMap).sort((a, b) => b[1] - a[1]);
  };

  const chartData = {
    labels: getTopLabels().map(([label]) => label),
    datasets: [
      {
        label: 'Entity Labels (System-wide)',
        data: getTopLabels().map(([, count]) => count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="admin-wrapper">
      <h1>Admin Analytics</h1>
      <div style={{ maxWidth: '700px', margin: 'auto' }}>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Most Common Entity Labels',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default AdminAnalytics;
