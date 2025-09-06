import { useState, useEffect } from 'react';

export default function ReceivedFiles() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    async function fetchReceivedFiles() {
      try {
        const res = await fetch('/api/files/received', {
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
    fetchReceivedFiles();
  }, []);

  return (
    <div>
      <h2>Received Files</h2>
      {files.length === 0 ? (
        <p>No files received yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>File Name</th>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Sender</th>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Expiry Time</th>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Status</th>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Download</th>
            </tr>
          </thead>
          <tbody>
            {files.map(file => (
              <tr key={file.id}>
                <td>{file.filename}</td>
                <td>{file.sender}</td>
                <td>{new Date(file.expiry_time).toLocaleString()}</td>
                <td>{file.status}</td>
                <td>
                  {file.status === 'active' ? (
                    <a href={file.download_url} target="_blank" rel="noopener noreferrer">Download</a>
                  ) : (
                    'Expired'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
