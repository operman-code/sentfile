import React, { useState } from 'react';
import { Signup } from './components/Signup';
import { Login } from './components/Login';
import Dashboard from './components/dashboard/Dashboard';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

  // Logout handler to clear token and state
  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

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
          <button style={{ marginTop: 20 }} onClick={handleLogout}>
            Log Out
          </button>
        </>
      )}
    </div>
  );
}