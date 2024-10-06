import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Ensure to create this CSS file for custom styling

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <h1 className="header-title">Farm Analysis Dashboard</h1>
        <nav className="nav">
          <Link to="/" className="nav-link">Farm Analysis</Link>
          <Link to="/climate" className="nav-link">Climate Analysis</Link>
          <Link to="/ndvi" className="nav-link">NDVI Trend</Link>
          <Link to="/inspect" className="nav-link">GeoJSON Inspector</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;