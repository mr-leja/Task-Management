import axios from "axios";

const api = axios.create({
  baseURL: "/api", // usa el proxy de Vite en dev
  // timeout: 5000,
});

// Si usas sesiones y cookies en Django, descomenta:
// api.defaults.withCredentials = true;

export default api;
