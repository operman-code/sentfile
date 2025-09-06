import { useState } from 'react';
import UserSearch from './UserSearch';
import FileUpload from './FileUpload';
import SentFiles from './SentFiles';
import ReceivedFiles from './ReceivedFiles';

export default function Dashboard() {
  const [tab, setTab] = useState('search');
  const [selectedUsers, setSelectedUsers] = useState([]);

  return (
    <div style={{ maxWidth: 800, margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Sentfile Dashboard</h1>
      <nav style={{ marginBottom: 20 }}>
        <button onClick={() => setTab('search')} disabled={tab === 'search'}>User Search</button>
        <button onClick={() => setTab('upload')} disabled={tab === 'upload'}>Send File</button>
        <button onClick={() => setTab('sent')} disabled={tab === 'sent'}>Sent Files</button>
        <button onClick={() => setTab('received')} disabled={tab === 'received'}>Received Files</button>
      </nav>

      {tab === 'search' && <UserSearch selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />}
      {tab === 'upload' && <FileUpload selectedUsers={selectedUsers} />}
      {tab === 'sent' && <SentFiles />}
      {tab === 'received' && <ReceivedFiles />}
    </div>
  );
}
