import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { Line } from 'react-chartjs-2';
import './ClimateAnalysis.css'; // Make sure to create this CSS file for custom styling

function ClimateAnalysis() {
  const [aoi, setAoi] = useState(JSON.stringify({
    type: "geojson",
    data: {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-95.5, 42.5],
            [-95.5, 42.7],
            [-95.3, 42.7],
            [-95.3, 42.5],
            [-95.5, 42.5]
          ]
        ]
      }
    }
  }));
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2023-06-01');
  const [parameters, setParameters] = useState(['temperature', 'precipitation']);
  const { data, loading, error, fetchData } = useApi();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData('/analyze_climate', {
      method: 'POST',
      body: JSON.stringify({
        aoi: JSON.parse(aoi),
        date_range: { start_date: startDate, end_date: endDate },
        parameters: parameters
      })
    });
  };

  const handleParameterChange = (e) => {
    const { value, checked } = e.target;
    setParameters(prev => 
      checked ? [...prev, value] : prev.filter(p => p !== value)
    );
  };

  const chartData = {
    labels: data ? data.weather_data.map(d => d.date) : [],
    datasets: parameters.map(param => ({
      label: param.charAt(0).toUpperCase() + param.slice(1),
      data: data ? data.weather_data.map(d => d[param]) : [],
      fill: false,
      backgroundColor: param === 'temperature' ? 'rgb(255, 99, 132)' : 'rgb(54, 162, 235)',
      borderColor: param === 'temperature' ? 'rgba(255, 99, 132, 0.2)' : 'rgba(54, 162, 235, 0.2)',
    }))
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
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">Error: {error}</p>}
      {data && (
        <div className="results-container">
          <h3>Climate Analysis Results:</h3>
          <Line data={chartData} />
          <p>Drought Status: {data.drought_status}</p>

          <h4>Climate Summary:</h4>
          <ul>
            <li>Average Temperature: {data.climate_summary.average_temperature}°C</li>
            <li>Total Precipitation: {data.climate_summary.total_precipitation}mm</li>
          </ul>

          <h4>Climate Trends:</h4>
          <ul>
            <li>Temperature Trend: {data.climate_trends.temperature_trend}</li>
            <li>Precipitation Trend: {data.climate_trends.precipitation_trend}</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default ClimateAnalysis;