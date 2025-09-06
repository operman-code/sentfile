import { useState } from 'react';

const expiryOptions = [
  { label: '1 Hour', value: 3600 },
  { label: '1 Day', value: 86400 },
  { label: '1 Week', value: 604800 },
];

export default function FileUpload({ selectedUsers }) {
  const [file, setFile] = useState(null);
  const [expiry, setExpiry] = useState(expiryOptions[0].value);
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file.');
      return;
    }
    if (selectedUsers.length === 0) {
      setMessage('Please select at least one user to send the file.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('expiry', expiry);
    formData.append('recipients', JSON.stringify(selectedUsers.map(u => u.id)));

    try {
      const res = await fetch('/api/files/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('File uploaded and sent successfully!');
        setFile(null);
      } else {
        setMessage(data.message || 'Upload failed.');
      }
    } catch (err) {
      setMessage('Upload error: ' + err.message);
    }
  };

  return (
    <div>
      <input type="file" onChange={e => setFile(e.target.files[0])} style={{ marginBottom: 10 }} />
      <div style={{ marginBottom: 10 }}>
        <label>Expiry Time: </label>
        <select value={expiry} onChange={e => setExpiry(Number(e.target.value))}>
          {expiryOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleUpload}>Send File</button>
      <p>{message}</p>
    </div>
  );
}
