import axios from "axios";

const api = axios.create({
  baseURL: "https://noteshub-server.onrender.com/api",
  withCredentials: true, 
});

export default api;
