import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import './GeoJSONInspector.css'; // Ensure to create this CSS file for custom styling

function GeoJSONInspector() {
  const [file, setFile] = useState(null);
  const [showAllProperties, setShowAllProperties] = useState(false);
  const [nameKey, setNameKey] = useState('');
  const { data, loading, error, fetchData } = useApi();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      fetchData('/inspect_geojson', {
        method: 'POST',
        body: formData,
        params: { show_all_properties: showAllProperties, name_key: nameKey },
      });
    }
  };

  return (
    <div className="card">
      <h2>GeoJSON Inspector</h2>
      <form onSubmit={handleSubmit} className="inspector-form">
        <div>
          <label htmlFor="file">Upload GeoJSON file:</label>
          <input
            id="file"
            className="input-file"
            type="file"
            onChange={handleFileChange}
            required
          />
        </div>
        <div className="checkbox-group">
          <label htmlFor="showAllProperties" className="checkbox-label">
            <input
              id="showAllProperties"
              type="checkbox"
              checked={showAllProperties}
              onChange={(e) => setShowAllProperties(e.target.checked)}
            />
            Show all properties
          </label>
        </div>
        <div>
          <label htmlFor="nameKey">Name Key (optional):</label>
          <input
            id="nameKey"
            className="input"
            type="text"
            value={nameKey}
            onChange={(e) => setNameKey(e.target.value)}
          />
        </div>
        <button type="submit" className="button">
          Inspect GeoJSON
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">Error: {error}</p>}
      {data && (
        <div className="results-container">
          <h3>Inspection Results:</h3>
          <p>Total Regions: {data.total_regions}</p>
          <ul>
            {data.regions.map((region, index) => (
              <li key={index}>
                {region.name} ({region.type})
                {showAllProperties && (
                  <ul>
                    {Object.entries(region.properties).map(([key, value]) => (
                      <li key={key}>
                        {key}: {value}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default GeoJSONInspector;