import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import './ClimateAnalysis.css';

function ClimateAnalysis() {
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
  const [endDate, setEndDate] = useState('2023-01-03');
  const [parameters, setParameters] = useState(['temperature', 'precipitation']);
  const { data, loading, error, fetchData } = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestBody = {
      aoi: {
        type: 'geojson',
        data: JSON.parse(aoi),
      },
      date_range: { start_date: startDate, end_date: endDate },
      parameters: parameters,
    };

    console.log('Sending request to /analyze_climate');
    console.log('Request Body:', JSON.stringify(requestBody, null, 2));

    try {
      const result = await fetchData('/analyze_climate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      console.log('API Response:', result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleParameterChange = (e) => {
    const { value, checked } = e.target;
    setParameters((prev) => (
      checked ? [...prev, value] : prev.filter((p) => p !== value)
    ));
  };

  return (
    <div className="card">
      <h2>Climate Analysis</h2>
      <form onSubmit={handleSubmit} className="climate-form">
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
          <label>Parameters:</label>
          <div className="checkbox-group">
            <label>
              <input type="checkbox" value="temperature" checked={parameters.includes('temperature')} onChange={handleParameterChange} />
              Temperature
            </label>
            <label>
              <input type="checkbox" value="precipitation" checked={parameters.includes('precipitation')} onChange={handleParameterChange} />
              Precipitation
            </label>
          </div>
        </div>
        <button type="submit" className="button">Analyze Climate</button>
      </form>

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error-message">Error: {error}</p>}
      {data && (
        <div className="results-container">
          <h3>Climate Analysis Results</h3>
          <div className="data-output">
            <h4>Weather Data:</h4>
            <ul>
              {data.weather_data?.map((item, index) => (
                <li key={index}>
                  Date: {item.date}, 
                  Temperature: {item.temperature?.toFixed(2)}°C, 
                  Precipitation: {item.precipitation?.toFixed(2)}mm
                </li>
              ))}
            </ul>
            <div className="data-point">
              <span className="data-label">Drought Status:</span> 
              <span className="data-value">{data.drought_status}</span>
            </div>
            <h4>Climate Summary:</h4>
            <div className="data-point">
              <span className="data-label">Average Temperature:</span> 
              <span className="data-value">{data.climate_summary?.average_temperature?.toFixed(2)}°C</span>
            </div>
            <div className="data-point">
              <span className="data-label">Total Precipitation:</span> 
              <span className="data-value">{data.climate_summary?.total_precipitation?.toFixed(2)}mm</span>
            </div>
            <h4>Climate Trends:</h4>
            <div className="data-point">
              <span className="data-label">Temperature Trend:</span> 
              <span className="data-value">{data.climate_trends?.temperature_trend}</span>
            </div>
            <div className="data-point">
              <span className="data-label">Precipitation Trend:</span> 
              <span className="data-value">{data.climate_trends?.precipitation_trend}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClimateAnalysis;