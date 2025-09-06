import { useState } from 'react';

export function UserSearch() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState('');

  const searchUsers = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMsg('Please log in first');
      return;
    }
    const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users);
      if (data.users.length === 0) setMsg('No users found');
      else setMsg('');
    } else {
      setMsg('Search failed');
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search users (username/email)"
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ marginRight: 10 }}
      />
      <button onClick={searchUsers}>Search</button>
      <p>{msg}</p>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.username} ({user.email})</li>
        ))}
      </ul>
    </div>
  );
}
