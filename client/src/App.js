import React, { useState, useEffect } from 'react';
import { Signup } from './components/Signup';
import { Login } from './components/Login';
import Dashboard from './components/dashboard/Dashboard';
import InfoPanel from './components/InfoPanel';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    // Example token validation logic (replace with actual)
    fetch('/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.ok) setLoggedIn(true);
        else localStorage.removeItem('token');
      })
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {!loggedIn ? (
        <>
          <div style={{ flex: 1, maxWidth: 480, padding: 40, backgroundColor: '#fff' }}>
            <h2>Login</h2>
            <Login onLogin={() => setLoggedIn(true)} />
            <hr style={{ margin: '20px 0' }} />
            <h2>Sign Up</h2>
            <Signup />
          </div>
          <InfoPanel style={{ flex: 1 }} />
        </>
      ) : (
        <Dashboard />
      )}
    </div>
  );
}
