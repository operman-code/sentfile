import { useState } from 'react';

export function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Signup successful! Please log in.');
        setUsername('');
        setEmail('');
        setPassword('');
      } else {
        setMessage(data.message || 'Signup failed');
      }
    } catch (err) {
      setMessage('Network error');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
        minLength={3}
        style={{
          padding: 12,
          fontSize: 16,
          borderRadius: 6,
          border: '1px solid #ccc',
          outline: 'none'
        }}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={{
          padding: 12,
          fontSize: 16,
          borderRadius: 6,
          border: '1px solid #ccc',
          outline: 'none'
        }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        minLength={6}
        style={{
          padding: 12,
          fontSize: 16,
          borderRadius: 6,
          border: '1px solid #ccc',
          outline: 'none'
        }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: 12,
          backgroundColor: '#0078d4',
          color: '#fff',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: 6,
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>
      {message && (
        <p style={{ color: message.includes('successful') ? 'green' : 'red', fontSize: 14 }}>
          {message}
        </p>
      )}
    </form>
  );
}
