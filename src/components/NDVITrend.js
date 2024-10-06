import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { Line } from 'react-chartjs-2';
import './NDVITrend.css'; // Make sure to create this CSS file for custom styling

function NDVITrend() {
  // Default AOI and Dates for ease of testing
  const defaultAoi = JSON.stringify({
    type: "Feature",
    properties: {},
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
  });

  const defaultStartDate = '2023-01-01';
  const defaultEndDate = '2023-06-01';

  const [aoi, setAoi] = useState(defaultAoi);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const { data, loading, error, fetchData } = useApi();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData('/ndvi_trend', {
      method: 'POST',
      body: JSON.stringify({
        aoi: JSON.parse(aoi),
        start_date: startDate,
        end_date: endDate,
      }),
    });
  };

  const chartData = {
    labels: data ? data.ndvi_data.map((d) => d.date) : [],
    datasets: [
      {
        label: 'NDVI',
        data: data ? data.ndvi_data.map((d) => d.ndvi) : [],
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  return (
    <div className="card">
      <h2>NDVI Trend Analysis</h2>
      <form onSubmit={handleSubmit} className="trend-form">
        <div>
          <label htmlFor="aoi">Area of Interest (GeoJSON):</label>
          <textarea
            id="aoi"
            className="input"
            value={aoi}
            onChange={(e) => setAoi(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="startDate">Start Date:</label>
          <input
            id="startDate"
            className="input"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="endDate">End Date:</label>
          <input
            id="endDate"
            className="input"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="button">
          Analyze NDVI Trend
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">Error: {error}</p>}
      {data && (
        <div className="results-container">
          <h3>NDVI Trend:</h3>
          <Line data={chartData} />
          <p>Trend Direction: {data.trend_direction}</p>
        </div>
      )}
    </div>
  );
}

export default NDVITrend;