import { useState } from 'react';
import UserSearch from './UserSearch';
import FileUpload from './FileUpload';
import SentFiles from './SentFiles';
import ReceivedFiles from './ReceivedFiles';

export default function Dashboard() {
  const [tab, setTab] = useState('search');
  const [selectedUsers, setSelectedUsers] = useState([]);

  return (
    <div style={{
      maxWidth: 900, margin: '30px auto', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: 20, background: '#fff', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: 30, color: '#0078d4' }}>Sentfile Dashboard</h1>

      <nav style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 30 }}>
        {['search', 'upload', 'sent', 'received'].map(value => (
          <button
            key={value}
            onClick={() => setTab(value)}
            style={{
              padding: '10px 25px',
              fontWeight: tab === value ? '700' : '500',
              backgroundColor: tab === value ? '#0078d4' : '#e2e8f0',
              color: tab === value ? '#fff' : '#333',
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {value.charAt(0).toUpperCase() + value.slice(1)} Files
          </button>
        ))}
      </nav>

      <div>
        {tab === 'search' && <UserSearch selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />}
        {tab === 'upload' && <FileUpload selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />}
        {tab === 'sent' && <SentFiles />}
        {tab === 'received' && <ReceivedFiles />}
      </div>
    </div>
  );
}
