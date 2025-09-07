import { useEffect, useState } from 'react';

export default function SentFiles() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSentFiles();
  }, []);

  const fetchSentFiles = async () => {
    try {
      const res = await fetch('/api/files/sent', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Sent Files</h2>
      {loading ? (
        <p>Loading files...</p>
      ) : files.length === 0 ? (
        <p>No files sent yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#0078d4', color: '#fff' }}>
              <th style={{ padding: 12, border: '1px solid #ddd' }}>File Name</th>
              <th style={{ padding: 12, border: '1px solid #ddd' }}>Recipients</th>
              <th style={{ padding: 12, border: '1px solid #ddd' }}>Expiry</th>
              <th style={{ padding: 12, border: '1px solid #ddd' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {files.map(({ id, filename, recipients, expiry_time, status }) => (
              <tr key={id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: 12 }}>{filename}</td>
                <td style={{ padding: 12 }}>{recipients.map(r => r.username).join(', ')}</td>
                <td style={{ padding: 12 }}>{new Date(expiry_time).toLocaleString()}</td>
                <td style={{ padding: 12, textTransform: 'capitalize', color: status === 'active' ? 'green' : 'gray' }}>
                  {status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
