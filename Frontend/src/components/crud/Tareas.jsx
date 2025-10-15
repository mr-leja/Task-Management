import { useEffect, useState } from "react";
import api from "../../api";

function emptyForm() {
  return { Titulo: "", descripcion: "", FechaVence: "", Estado: false };
}

function Tareas() {
  const [tareas, setTareas] = useState([]);
  const [form, setForm] = useState(emptyForm());
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 📋 Listar todas las tareas
  const fetchTareas = async () => {
    setLoading(true);
    try {
      const res = await api.get("tareas/"); // ✅ Ruta correcta para listar
      setTareas(res.data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar tareas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTareas();
  }, []);

  // 📝 Crear o actualizar tarea
  const submitForm = async (e) => {
    e.preventDefault();

    if (!form.Titulo || !form.FechaVence) {
      setError("Título y Fecha de vencimiento son requeridos");
      return;
    }

    try {
      if (editingId === null) {
        // ✅ Crear nueva tarea
        const res = await api.post("tareas/crear/", form);
        setTareas([res.data, ...tareas]);
      } else {
        // ✅ Actualizar tarea existente
        const res = await api.put(`tareas/${editingId}/actualizar/`, form);
        setTareas(tareas.map((t) => (t.Id === editingId ? res.data : t)));
        setEditingId(null);
      }

      setForm(emptyForm());
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error al guardar la tarea");
    }
  };

  // ✏️ Cargar datos en el formulario para editar
  const startEdit = (t) => {
    setEditingId(t.Id);
    setForm({
      Titulo: t.Titulo || "",
      descripcion: t.descripcion || "",
      FechaVence: t.FechaVence || "",
      Estado: !!t.Estado,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ❌ Eliminar tarea
  const deleteTarea = async (id) => {
    if (!confirm("¿Eliminar esta tarea?")) return;
    try {
      await api.delete(`tareas/${id}/eliminar/`);
      setTareas(tareas.filter((t) => t.Id !== id));
    } catch (err) {
      console.error(err);
      alert("Error al eliminar la tarea");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "1.5rem auto", padding: "1rem" }}>
      <h1>Gestión de Tareas</h1>

      {/* 🧾 Formulario de creación / edición */}
      <form
        onSubmit={submitForm}
        style={{ marginBottom: "1rem", display: "grid", gap: 8 }}
      >
        <input
          placeholder="Título"
          value={form.Titulo}
          onChange={(e) => setForm({ ...form, Titulo: e.target.value })}
        />
        <input
          placeholder="Descripción"
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
        />
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="date"
            value={form.FechaVence}
            onChange={(e) => setForm({ ...form, FechaVence: e.target.value })}
          />
          <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              type="checkbox"
              checked={!!form.Estado}
              onChange={(e) => setForm({ ...form, Estado: e.target.checked })}
            />
            Completada
          </label>
          <button type="submit">
            {editingId === null ? "Agregar" : "Guardar cambios"}
          </button>
          {editingId !== null && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm());
              }}
            >
              Cancelar
            </button>
          )}
        </div>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>

      <hr />

      {/* 📄 Lista de tareas */}
      {loading ? (
        <p>Cargando...</p>
      ) : tareas.length === 0 ? (
        <p>No hay tareas registradas.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tareas.map((t) => (
            <li
              key={t.Id}
              style={{
                padding: 10,
                borderBottom: "1px solid #ddd",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{t.Titulo}</strong>
                <div>{t.descripcion}</div>
                <small>
                  Vence: {t.FechaVence} — Estado:{" "}
                  {t.Estado ? "Completada ✅" : "Pendiente ⏳"}
                </small>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => startEdit(t)}>Editar</button>
                <button onClick={() => deleteTarea(t.Id)}>Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Tareas;
