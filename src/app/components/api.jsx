// src/components/ApiClient.js
const ApiClient = (host='localhost', port=5000) => {
  const baseUrl = `http://${host}:${port}`;

  return {
    get: async (endpoint) => {
      const response = await fetch(`${baseUrl}${endpoint}`);
      if (!response.ok) {
        throw new Error(`GET request failed with status ${response.status}`);
      }
      return response.json();
    },
    gets: async (endpoint,token) => {
      if (!token) return "Token is required";
      const response = await fetch(`${baseUrl}${endpoint}`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer "+token
        }
      });
      if (!response.ok) {
        throw new Error(`GET request failed with status ${response.status}`);
      }
      return response.json();
    },
    post: async (endpoint, body) => {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`POST request failed with status ${response.status}`);
      }
      return response.json();
    },
    patch: async (endpoint, body) => {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`PATCH request failed with status ${response.status}`);
      }
      return response.json();
    },
    delete: async (endpoint) => {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`DELETE request failed with status ${response.status}`);
      }
      return response.json();
    },
  };
};

export default ApiClient;
