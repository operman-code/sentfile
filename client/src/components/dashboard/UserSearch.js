import { useState, useEffect } from 'react';

export default function UserSearch({ selectedUsers, setSelectedUsers }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (res.ok) {
          const { users } = await res.json();
          setResults(users);
        }
      } catch (e) {
        console.error(e);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const toggleUser = (user) => {
    if (selectedUsers.some(u => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search users by name or email..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{
          width: '100%',
          padding: 12,
          marginBottom: 15,
          fontSize: 16,
          borderRadius: 6,
          border: '1px solid #ccc',
          outline: 'none',
          boxSizing: 'border-box'
        }}
      />
      <ul style={{
        maxHeight: 300,
        overflowY: 'auto',
        padding: 0,
        listStyleType: 'none',
        margin: 0,
        borderRadius: 6,
        border: '1px solid #ccc',
        backgroundColor: '#fafafa'
      }}>
        {results.length === 0 ? (
          <li style={{ padding: 12, color: '#666', textAlign: 'center' }}>No users found</li>
        ) : (
          results.map(user => (
            <li
              key={user.id}
              onClick={() => toggleUser(user)}
              style={{
                padding: 12,
                cursor: 'pointer',
                backgroundColor: selectedUsers.some(u => u.id === user.id) ? '#0078d4' : '',
                color: selectedUsers.some(u => u.id === user.id) ? '#fff' : '#333',
                borderBottom: '1px solid #eee',
                userSelect: 'none',
                transition: 'background-color 0.3s ease'
              }}
            >
              <strong>{user.username}</strong> &nbsp; <small>({user.email})</small>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
