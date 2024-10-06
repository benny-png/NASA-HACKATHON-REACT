import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Update the import
import Header from './components/Header';
import Footer from './components/Footer';
import FarmAnalysis from './components/FarmAnalysis';
import ClimateAnalysis from './components/ClimateAnalysis';
import NDVITrend from './components/NDVITrend';
import RegionImage from './components/RegionImage';
import GeoJSONInspector from './components/GeoJSONInspector';
import './styles/global.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes> {/* Replace Switch with Routes */}
            <Route path="/" element={<FarmAnalysis />} /> {/* Use element prop */}
            <Route path="/climate" element={<ClimateAnalysis />} />
            <Route path="/ndvi" element={<NDVITrend />} />
            <Route path="/region/:name" element={<RegionImage />} />
            <Route path="/inspect" element={<GeoJSONInspector />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;