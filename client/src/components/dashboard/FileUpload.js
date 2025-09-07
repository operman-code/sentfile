import { useState } from 'react';

const expiryOptions = [
  { label: '1 Hour', value: 3600 },
  { label: '1 Day', value: 86400 },
  { label: '1 Week', value: 604800 },
];

export default function FileUpload({ selectedUsers, setSelectedUsers }) {
  const [file, setFile] = useState(null);
  const [expiry, setExpiry] = useState(expiryOptions[0].value);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return setMessage('Please select a file.');
    if (selectedUsers.length === 0) return setMessage('Please choose at least one recipient.');

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('expiry', expiry);
    formData.append('recipients', JSON.stringify(selectedUsers.map(u => u.id)));

    try {
      const res = await fetch('/api/files/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('File sent successfully!');
        setFile(null);
        setSelectedUsers([]);
      } else {
        setMessage(data.message || 'Failed to send file.');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={e => setFile(e.target.files[0])}
        style={{ marginBottom: 15 }}
      />
      <div style={{ marginBottom: 15 }}>
        <label htmlFor="expirySelect" style={{ marginRight: 10, fontWeight: 'bold' }}>Expiry Time:</label>
        <select
          id="expirySelect"
          value={expiry}
          onChange={e => setExpiry(Number(e.target.value))}
          style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #ccc' }}
        >
          {expiryOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <button
        onClick={handleUpload}
        disabled={uploading}
        style={{
          padding: '10px 25px',
          backgroundColor: '#0078d4',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          cursor: uploading ? 'not-allowed' : 'pointer'
        }}
      >
        {uploading ? 'Uploading...' : 'Send File'}
      </button>
      {!!message && <p style={{ marginTop: 15, color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>}
    </div>
  );
}
