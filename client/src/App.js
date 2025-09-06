import React, { useState } from 'react';
import { Signup } from './components/Signup';
import { Login } from './components/Login';
import { UserSearch } from './components/UserSearch';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div style={{ width: 400, margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
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
          <h2>User Search</h2>
          <UserSearch />
        </>
      )}
    </div>
  );
}