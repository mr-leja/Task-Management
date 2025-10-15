import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    Nombre: "",
    Apellidos: "",
    Correo: "",
    Contrasena: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.Nombre || !form.Apellidos || !form.Correo || !form.Contrasena) {
      Swal.fire("Campos requeridos", "Completa todos los campos", "warning");
      return;
    }

    try {
      await api.post("usuarios/registro/", form);

      Swal.fire({
        title: "Registro exitoso 🎉",
        text: "Ya puedes iniciar sesión",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/");
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.error || "No se pudo registrar el usuario",
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
        <h3 className="text-center text-primary fw-bold mb-3">Crear Cuenta</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              name="Nombre"
              className="form-control"
              value={form.Nombre}
              onChange={handleChange}
              placeholder="Tu nombre"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Apellidos</label>
            <input
              type="text"
              name="Apellidos"
              className="form-control"
              value={form.Apellidos}
              onChange={handleChange}
              placeholder="Tus apellidos"
              required
            />
          </div>

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
            Registrarse
          </button>
        </form>

        <p className="text-center mt-3 mb-0">
          ¿Ya tienes cuenta?{" "}
          <Link to="/" className="text-decoration-none text-primary">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
