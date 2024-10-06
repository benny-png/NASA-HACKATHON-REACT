import React, { useState, useEffect } from 'react';
import OpenAI from 'openai'; // Ensure you have OpenAI npm package installed
import { useApi } from '../hooks/useApi';
import './ClimateAnalysis.css';

// Directly include the OpenAI API Key (Not Recommended for Production)
const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

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

  const defaultStartDate = '2023-01-01';
  const defaultEndDate = '2023-01-03';
  const [aoi, setAoi] = useState(defaultAoi);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [parameters, setParameters] = useState(['temperature', 'precipitation']);
  const { data, loading: apiLoading, error, fetchData } = useApi();
  const [openaiResponse, setOpenaiResponse] = useState(null);
  const [loading, setLoading] = useState(false); // Flag to manage OpenAI loading

  useEffect(() => {
    if (data && data.weather_data) {
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
      parameters: parameters,
    };

    console.log('Sending request to /analyze_climate');
    console.log('Request Body:', JSON.stringify(requestBody, null, 2));

    fetchData('/analyze_climate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', },
      body: JSON.stringify(requestBody),
    });
  };

  const handleParameterChange = (e) => {
    const { value, checked } = e.target;
    setParameters((prev) => (
      checked ? [...prev, value] : prev.filter((p) => p !== value)
    ));
  };

  const analyzeWithOpenAI = async () => {
    const flattenedData = JSON.stringify(data.weather_data.map(d => d.properties));
    setLoading(true); // Start loading

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a helpful assistant. Short and clear dont put markdown" },
          {
            role: "user",
            content: `Summarize the climate analysis: ${flattenedData} Short and clear dont put markdown`
          },
        ],
      });

      setOpenaiResponse(completion.choices[0].message.content);
    } catch (err) {
      console.error("OpenAI API error:", err);
    } finally {
      setLoading(false); // Stop loading
    }
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

      {(apiLoading || loading) && <p>Loading...</p>}
      {error && <p className="error-message">Error: {error}</p>}
      {openaiResponse && (
        <div className="results-container">
          <h3>OpenAI Analysis Results:</h3>
          <p>{openaiResponse}</p>
        </div>
      )}
    </div>
  );
}

export default ClimateAnalysis;