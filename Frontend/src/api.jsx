import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

// Si usas sesiones y cookies en Django, descomenta:
// api.defaults.withCredentials = true;

export default api;
