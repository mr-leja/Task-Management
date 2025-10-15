import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/", // asegúrate de usar la URL completa
});

// Si usas sesiones y cookies en Django, podrías usar esto:
// api.defaults.withCredentials = true;

// 👇 Aquí agregas el token automáticamente a todas las peticiones
const token = localStorage.getItem("token");

if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default api;
