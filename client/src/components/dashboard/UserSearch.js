import { useState, useEffect } from 'react';

export default function UserSearch({ selectedUsers, setSelectedUsers }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query.length === 0) {
      setResults([]);
      return;
    }
    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (res.ok) {
          const data = await res.json();
          setResults(data.users);
        }
      } catch (e) {
        console.error(e);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const toggleUser = user => {
    if (selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ width: '100%', marginBottom: 10, padding: 8 }}
      />
      <ul style={{ listStyle: 'none', padding: 0, maxHeight: 200, overflowY: 'auto' }}>
        {results.map(user => (
          <li
            key={user.id}
            onClick={() => toggleUser(user)}
            style={{
              padding: 8,
              marginBottom: 4,
              backgroundColor: selectedUsers.find(u => u.id === user.id) ? '#cce5ff' : '#f8f9fa',
              cursor: 'pointer',
              borderRadius: 4,
            }}
          >
            {user.username} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
}
