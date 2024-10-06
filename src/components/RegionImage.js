import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import './RegionImage.css'; // Ensure this CSS file is created for custom styling

function RegionImage() {
  const { name } = useParams();
  const { data, loading, error, fetchData } = useApi();
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (name) {
      fetchData(`/region_image/${name}`, { method: 'POST' });
    }
  }, [name, fetchData]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      fetchData(`/region_image/${name}`, { method: 'POST', body: formData });
    }
  };

  return (
    <div className="card">
      <h2>Region Image: {name}</h2>
      <form onSubmit={handleSubmit} className="region-image-form">
        <div>
          <label htmlFor="file">Upload GeoJSON file (optional):</label>
          <input id="file" type="file" onChange={handleFileChange} className="input-file" />
        </div>
        <button type="submit" className="button">Get Region Image</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">Error: {error}</p>}
      {data && (
        <div className="images-container">
          <h3>Region Images:</h3>
          <img src={data.rgb_image_url} alt="RGB" className="region-image" />
          <img src={data.ndvi_image_url} alt="NDVI" className="region-image" />
        </div>
      )}
    </div>
  );
}

export default RegionImage;