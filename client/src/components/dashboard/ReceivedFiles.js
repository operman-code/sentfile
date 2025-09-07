import { useEffect, useState } from 'react';

export default function ReceivedFiles() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReceivedFiles();
  }, []);

  const fetchReceivedFiles = async () => {
    try {
      const res = await fetch('/api/files/received', {
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
      <h2>Received Files</h2>
      {loading ? (
        <p>Loading files...</p>
      ) : files.length === 0 ? (
        <p>No files received yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#0078d4', color: '#fff' }}>
              <th style={{ padding: 12, border: '1px solid #ddd' }}>File Name</th>
              <th style={{ padding: 12, border: '1px solid #ddd' }}>Sender</th>
              <th style={{ padding: 12, border: '1px solid #ddd' }}>Expiry</th>
              <th style={{ padding: 12, border: '1px solid #ddd' }}>Status</th>
              <th style={{ padding: 12, border: '1px solid #ddd' }}>Download</th>
            </tr>
          </thead>
          <tbody>
            {files.map(({ id, filename, sender, expiry_time, status, download_url }) => (
              <tr key={id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: 12 }}>{filename}</td>
                <td style={{ padding: 12 }}>{sender.username}</td>
                <td style={{ padding: 12 }}>{new Date(expiry_time).toLocaleString()}</td>
                <td style={{ padding: 12, textTransform: 'capitalize', color: status === 'active' ? 'green' : 'gray' }}>
                  {status}
                </td>
                <td style={{ padding: 12 }}>
                  {status === 'active' ? (
                    <a href={download_url} target="_blank" rel="noopener noreferrer" style={{color:'#0078d4', textDecoration:'none'}}>
                      Download
                    </a>
                  ) : 'Expired'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
