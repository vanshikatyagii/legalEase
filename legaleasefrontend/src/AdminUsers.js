import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5050/admin-users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error('❌ Failed to fetch users:', err));
  }, []);

  return (
    <div className="admin-wrapper">
      <h1>Manage Users</h1>
      <div className="admin-doc-table">
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>{user.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
