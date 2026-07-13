const API_BASE = "http://localhost:5000/api";

/**
 * API request for JSON endpoints only
 */
async function apiRequest(endpoint, method = "GET", body = null) {

    const token = localStorage.getItem("token");

    const options = {
        method,
        headers: {}
    };

    if (body) {

        options.headers["Content-Type"] = "application/json";

        options.body = JSON.stringify(body);

    }

    if (token) {

        options.headers["Authorization"] =
            `Bearer ${token}`;

    }

    const response =
        await fetch(API_BASE + endpoint, options);

    return response.json();

}