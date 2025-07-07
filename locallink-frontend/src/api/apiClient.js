// src/api/apiClient.js

import axios from 'axios';

// The base URL of your backend server
const API_BASE_URL = 'http://localhost:3001'; // Use your backend's port

/**
 * Makes an authenticated API request.
 * @param {object} options - The options for the axios request.
 * @param {string} options.method - The HTTP method (get, post, put, etc.).
 * @param {string} options.url - The API endpoint (e.g., '/api/services').
 * @param {object} [options.data] - The data to send in the request body (for POST/PUT).
 * @param {string} token - The user's access token from Asgardeo.
 * @returns {Promise<any>} The response data from the API.
 */
const callApi = async ({ method, url, data }, token) => {
  const headers = {
    'Content-Type': 'application/json',
    // Attach the access token to the Authorization header
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}${url}`,
      headers,
      data,
    });
    return response.data;
  } catch (error) {
    console.error('API call failed:', error.response || error);
    // Re-throw the error so the calling component can handle it
    throw error;
  }
};

export default callApi;