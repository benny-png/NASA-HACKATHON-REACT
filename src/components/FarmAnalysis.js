import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import './FarmAnalysis.css';

function FarmAnalysis() {
  const defaultAoi = JSON.stringify({
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-95.5, 42.5],
          [-95.5, 42.7],
          [-95.3, 42.7],
          [-95.3, 42.5],
          [-95.5, 42.5],
        ],
      ],
    },
  });

  const [aoi, setAoi] = useState(defaultAoi);
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2023-06-01');
  const [cropType, setCropType] = useState('corn');
  const { data, loading, error, fetchData } = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestBody = {
      aoi: {
        type: 'geojson',
        data: JSON.parse(aoi),
      },
      date_range: { start_date: startDate, end_date: endDate },
    };

    console.log('Sending request to /analyze_farm');
    console.log('Request Body:', JSON.stringify(requestBody, null, 2));

    try {
      const result = await fetchData('/analyze_farm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(requestBody),
        params: { crop_type: cropType },
      });
      console.log('API Response:', result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="card">
      <h2>Farm Analysis</h2>
      <form onSubmit={handleSubmit} className="farm-form">
        <div>
          <label htmlFor="aoi">Area of Interest (GeoJSON):</label>
          <textarea id="aoi" className="input" value={aoi} onChange={(e) => setAoi(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="startDate">Start Date:</label>
          <input id="startDate" className="input" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="endDate">End Date:</label>
          <input id="endDate" className="input" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="cropType">Crop Type:</label>
          <select id="cropType" className="input" value={cropType} onChange={(e) => setCropType(e.target.value)} required>
            <option value="corn">Corn</option>
            <option value="wheat">Wheat</option>
            <option value="soybeans">Soybeans</option>
            <option value="rice">Rice</option>
          </select>
        </div>
        <button type="submit" className="button">Analyze Farm</button>
      </form>

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error-message">Error: {error}</p>}
      {data && (
        <div className="results-container">
          <h3>Farm Analysis Results</h3>
          <div className="data-output">
            <div className="data-point">
              <span className="data-label">Vegetation Health:</span> 
              <span className="data-value">{data.vegetation_health?.vegetation_health}</span>
            </div>
            <div className="data-point">
              <span className="data-label">Current NDVI:</span> 
              <span className="data-value">{data.vegetation_health?.current_ndvi?.toFixed(2)}</span>
            </div>
            <div className="data-point">
              <span className="data-label">Harvest Prediction:</span> 
              <span className="data-value">{data.harvest_prediction}</span>
            </div>
            <div className="data-point">
              <span className="data-label">NDVI Trend:</span> 
              <span className="data-value">{data.ndvi_trend}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FarmAnalysis;