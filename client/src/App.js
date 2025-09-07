import React, { useState, useEffect } from 'react';
import { Signup } from './components/Signup';
import { Login } from './components/Login';
import Dashboard from './components/dashboard/Dashboard';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    // Call backend to verify token or get profile
    fetch('/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (res.ok) {
          setLoggedIn(true);
        } else {
          localStorage.removeItem('token');
          setLoggedIn(false);
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        setLoggedIn(false);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
      {!loggedIn ? (
        <>
          <h2>Login</h2>
          <Login onLogin={() => setLoggedIn(true)} />
          <hr />
          <h2>Sign Up</h2>
          <Signup />
        </>
      ) : (
        <>
          <Dashboard />
          <button style={{ marginTop: 20 }} onClick={() => {
            localStorage.removeItem('token');
            setLoggedIn(false);
          }}>
            Log Out
          </button>
        </>
      )}
    </div>
  );
}
