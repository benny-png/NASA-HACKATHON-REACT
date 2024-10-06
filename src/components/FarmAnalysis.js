import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';

function FarmAnalysis() {
  const [aoi, setAoi] = useState('');
  const [cropType, setCropType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { data, loading, error, fetchData } = useApi();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData('/analyze_farm', {
      method: 'POST',
      body: JSON.stringify({
        aoi: JSON.parse(aoi),
        date_range: { start_date: startDate, end_date: endDate }
      }),
      params: { crop_type: cropType }
    });
  };

  return (
    <div className="card">
      <h2>Farm Analysis</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="aoi">Area of Interest (GeoJSON):</label>
          <textarea id="aoi" className="input" value={aoi} onChange={(e) => setAoi(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="cropType">Crop Type:</label>
          <input id="cropType" className="input" type="text" value={cropType} onChange={(e) => setCropType(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="startDate">Start Date:</label>
          <input id="startDate" className="input" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="endDate">End Date:</label>
          <input id="endDate" className="input" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        </div>
        <button type="submit" className="button">Analyze Farm</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && (
        <div>
          <h3>Results:</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default FarmAnalysis;