import { useState, useEffect } from 'react';

export default function SentFiles() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    async function fetchSentFiles() {
      try {
        const res = await fetch('/api/files/sent', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (res.ok) {
          const data = await res.json();
          setFiles(data.files);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchSentFiles();
  }, []);

  return (
    <div>
      <h2>Sent Files</h2>
      {files.length === 0 ? (
        <p>No files sent yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>File Name</th>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Recipients</th>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Expiry Time</th>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {files.map(file => (
              <tr key={file.id}>
                <td>{file.filename}</td>
                <td>{file.recipients.join(', ')}</td>
                <td>{new Date(file.expiry_time).toLocaleString()}</td>
                <td>{file.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
