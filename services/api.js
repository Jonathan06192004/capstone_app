// services/api.js
import Constants from "expo-constants";

const API_BASE_URL = "https://aquameter-backend-8u1x.onrender.com"; // ✅ Live backend URL on Render

// Reusable API helper
export const apiRequest = async (endpoint, method = "GET", body = null) => {
  try {
    const options = {
      method,
      headers: { "Content-Type": "application/json" },
    };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`❌ API Error [${method}] ${endpoint}:`, error);
    throw error;
  }
};

export default API_BASE_URL;
