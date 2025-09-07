import React, { useState } from 'react';
import { Signup } from './components/Signup';
import { Login } from './components/Login';
import Dashboard from './components/dashboard/Dashboard';
import InfoPanel from './components/InfoPanel';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      background: 'linear-gradient(90deg,#f8fafd 50%,#0057b9 100%)'
    }}>
      {!loggedIn ? (
        <>
          <div style={{
            flex: 1, maxWidth: 480, padding: 40, background: '#fff', zIndex: 1, boxShadow: '0 4px 24px rgba(0,0,0,0.04)'
          }}>
            <h2>Sign in to Sentfile</h2>
            <Login onLogin={() => setLoggedIn(true)} />
            <hr style={{ margin: '32px 0' }}/>
            <Signup />
          </div>
          <InfoPanel />
        </>
      ) : (
        <Dashboard />
      )}
    </div>
  );
}
