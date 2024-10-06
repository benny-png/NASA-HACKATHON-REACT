import React, { useState, useEffect } from 'react';
import OpenAI from 'openai';
import { useApi } from '../hooks/useApi';
import './FarmAnalysis.css';

const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

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

  const defaultStartDate = '2023-01-01';
  const defaultEndDate = '2023-06-01';
  const [aoi, setAoi] = useState(defaultAoi);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [cropType, setCropType] = useState('corn');
  const { data, loading: apiLoading, error, fetchData } = useApi();
  const [openaiResponse, setOpenaiResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data && data.ndvi_stats) {
      analyzeWithOpenAI();
    }
  }, [data]);

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

    fetchData('/analyze_farm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(requestBody),
      params: { crop_type: cropType },
    });
  };

  const analyzeWithOpenAI = async () => {
    const farmData = JSON.stringify({
      ndvi_stats: data.ndvi_stats,
      vegetation_health: data.vegetation_health,
      harvest_prediction: data.harvest_prediction,
      ndvi_trend: data.ndvi_trend,
    });
    setLoading(true);

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a helpful assistant specialized in agricultural analysis. Provide concise and clear insights." },
          {
            role: "user",
            content: `Analyze this farm data and provide key insights: ${farmData}`
          },
        ],
      });

      setOpenaiResponse(completion.choices[0].message.content);
    } catch (err) {
      console.error("OpenAI API error:", err);
    } finally {
      setLoading(false);
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

      {(apiLoading || loading) && <p>Loading...</p>}
      {error && <p className="error-message">Error: {error}</p>}
      {data && (
        <div className="results-container">
          <h3>Farm Analysis Results:</h3>
          <p>Vegetation Health: {data.vegetation_health.vegetation_health}</p>
          <p>Current NDVI: {data.vegetation_health.current_ndvi.toFixed(2)}</p>
          <p>Harvest Prediction: {data.harvest_prediction}</p>
          <p>NDVI Trend: {data.ndvi_trend}</p>
        </div>
      )}
      {openaiResponse && (
        <div className="results-container">
          <h3>AI Insights:</h3>
          <p>{openaiResponse}</p>
        </div>
      )}
    </div>
  );
}

export default FarmAnalysis;