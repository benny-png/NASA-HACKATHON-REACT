const API_BASE_URL = process.env.REACT_APP_API_BASE_URL ;

export async function fetchData(endpoint, options = {}) {
  const url = new URL(endpoint, API_BASE_URL);
  
  if (options.params) {
    Object.keys(options.params).forEach(key => url.searchParams.append(key, options.params[key]));
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}