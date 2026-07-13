const API_BASE = "http://localhost:5000/api";

async function apiRequest(endpoint, method, body = null) {

  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE}${endpoint}`, {

    method,

    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : ""
    },

    body: body ? JSON.stringify(body) : null
  });

  return response.json();
}