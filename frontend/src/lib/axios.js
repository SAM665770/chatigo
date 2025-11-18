import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:3000/api"
      : "/api",
  withCredentials: true,
});

// Axios Instance Creation:
// axios.create() creates a custom axios instance with predefined configuration
// This avoids repeating the same config for every API call

// Development: Uses full URL http://localhost:3000/api (backend server)
// Production: Uses relative path /api (same domain as frontend)
// import.meta.env.MODE is Vite's way to detect the current environment

// Credentials Configuration:
// withCredentials: true enables sending cookies/auth headers with requests
// Essential for authentication systems that use HTTP-only cookies
// Allows cross-origin requests to include credentials

// Usage:
// // Instead of axios.get()
// axiosInstance.get('/users')  // Automatically uses baseURL + withCredentials
// // Becomes:
// // Dev: GET http://localhost:3000/api/users (with cookies)
// // Prod: GET /api/users (with cookies)


// This setup handles the common scenario where your frontend and backend run on different ports in development but are served from the same domain in production.