import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './Login';
import UserDashboard from './UserDashboard';
import LandingPage from './LandingPage';
import AnalyticsPage from './AnalyticsPage';
import Logout from './Logout';
import AdminDashboard from './AdminDashboard';
import AdminUsers from './AdminUsers';
import AdminAnalytics from './AdminAnalytics';

const App = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const role = localStorage.getItem('role');
  const isAuthenticated = !!user;

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />

        {/* Protected User Routes */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated && role === 'user' ? (
              <UserDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/analytics"
          element={
            isAuthenticated && role === 'user' ? (
              <AnalyticsPage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin-dashboard"
          element={
            isAuthenticated && role === 'admin' ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin-users"
          element={
            isAuthenticated && role === 'admin' ? (
              <AdminUsers />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin-analytics"
          element={
            isAuthenticated && role === 'admin' ? (
              <AdminAnalytics />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
