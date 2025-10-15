import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    Correo: "",
    Contrasena: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.Correo || !form.Contrasena) {
      Swal.fire("Campos requeridos", "Completa todos los campos", "warning");
      return;
    }

    try {
      const res = await api.post("/usuarios/login/", form);
      localStorage.setItem("usuario", JSON.stringify(res.data.usuario));

      Swal.fire({
        title: "Bienvenido",
        text: `Hola ${res.data.usuario.Nombre}`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/tareas/");
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.error || "Credenciales incorrectas",
        "error"
      );
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow-lg p-4 rounded-4"
        style={{ width: "400px", backgroundColor: "#fff" }}
      >
        <h3 className="text-center text-primary fw-bold mb-3">
          Iniciar Sesión
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              name="Correo"
              className="form-control"
              value={form.Correo}
              onChange={handleChange}
              placeholder="tuemail@ejemplo.com"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              name="Contrasena"
              className="form-control"
              value={form.Contrasena}
              onChange={handleChange}
              placeholder="••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 fw-semibold shadow-sm"
          >
            Entrar
          </button>
        </form>

        <p className="text-center mt-3 mb-0">
          ¿No tienes cuenta?{" "}
          <Link to="/registro" className="text-decoration-none text-primary">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
