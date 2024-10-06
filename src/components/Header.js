import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header style={{ backgroundColor: 'var(--primary-green)', padding: '1rem 0', color: 'var(--white)' }}>
      <div className="container">
        <h1 style={{ margin: 0 }}>Farm Analysis Dashboard</h1>
        <nav style={{ marginTop: '1rem' }}>
          <Link to="/" style={{ color: 'var(--white)', marginRight: '1rem' }}>Farm Analysis</Link>
          <Link to="/climate" style={{ color: 'var(--white)', marginRight: '1rem' }}>Climate Analysis</Link>
          <Link to="/ndvi" style={{ color: 'var(--white)', marginRight: '1rem' }}>NDVI Trend</Link>
          <Link to="/inspect" style={{ color: 'var(--white)' }}>GeoJSON Inspector</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;