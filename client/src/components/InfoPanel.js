export default function InfoPanel() {
  return (
    <div style={{
      flex: 1, color: '#fff', padding: '60px 40px', background: 'linear-gradient(135deg,#0057b9 70%,#018ac9 100%)',
      minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center'
    }}>
      <h1 style={{ fontSize: 38, fontWeight: 700, marginBottom: 24 }}>What is Sentfile?</h1>
      <ul style={{ fontSize: 18, lineHeight: 1.6 }}>
        <li><b>Extremely Secure</b> file transfer—end-to-end encryption, not publically accessible.</li>
        <li><b>File expiry</b>—set the time, the file deletes itself automatically.</li>
        <li><b>Full audit trails</b>—know when files are sent, received, or expired.</li>
        <li><b>Easy to use</b>—search users, pick files, send and track in one place.</li>
        <li>Ideal for teams handling confidential or sensitive data.</li>
      </ul>
      <div style={{ marginTop: 32, opacity: 0.75, fontSize: 15 }}>
        Secure, simple &amp; reliable. Try Sentfile today.
      </div>
    </div>
  );
}
