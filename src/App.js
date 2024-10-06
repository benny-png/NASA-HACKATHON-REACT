import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import FarmAnalysis from './components/FarmAnalysis';
import ClimateAnalysis from './components/ClimateAnalysis';
import NDVITrend from './components/NDVITrend';
import RegionImage from './components/RegionImage';
import GeoJSONInspector from './components/GeoJSONInspector';
import './styles/global.css';

function App() {
  const [selectedRegion, setSelectedRegion] = useState(null);

  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Switch>
            <Route exact path="/" component={FarmAnalysis} />
            <Route path="/climate" component={ClimateAnalysis} />
            <Route path="/ndvi" component={NDVITrend} />
            <Route path="/region/:name" component={RegionImage} />
            <Route path="/inspect" component={GeoJSONInspector} />
          </Switch>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;