import React from 'react';

function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--primary-green)', color: 'var(--white)', padding: '1rem 0', marginTop: 'auto' }}>
      <div className="container">
        <p style={{ margin: 0, textAlign: 'center' }}>© 2024 Farm Analysis Dashboard. Created for NASA Hackathon.</p>
      </div>
    </footer>
  );
}

export default Footer;