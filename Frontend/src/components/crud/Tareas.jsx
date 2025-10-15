import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../../api";

function emptyForm() {
  return { Titulo: "", descripcion: "", FechaVence: "", Estado: false };
}

function Tareas() {
  const [tareas, setTareas] = useState([]);
  const [form, setForm] = useState(emptyForm());
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // Modal controlado por estado

  // 📋 Obtener todas las tareas
  const fetchTareas = async () => {
    setLoading(true);
    try {
      const res = await api.get("tareas/");
      setTareas(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudieron cargar las tareas", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTareas();
  }, []);

  // 🧾 Abrir modal para crear o editar
  const openModal = (t = null) => {
    if (t) {
      setEditingId(t.Id);
      setForm({
        Titulo: t.Titulo,
        descripcion: t.descripcion,
        FechaVence: t.FechaVence,
        Estado: t.Estado,
      });
    } else {
      setEditingId(null);
      setForm(emptyForm());
    }
    setShowModal(true);
  };

  // 📝 Guardar (crear o actualizar)
  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.Titulo || !form.FechaVence) {
      Swal.fire(
        "Campos requeridos",
        "Completa el título y la fecha",
        "warning"
      );
      return;
    }

    try {
      let res;
      if (editingId) {
        res = await api.put(`tareas/${editingId}/actualizar/`, form);
        setTareas((prev) =>
          prev.map((t) => (t.Id === editingId ? res.data : t))
        );
      } else {
        res = await api.post("tareas/crear/", form);
        setTareas((prev) => [res.data, ...prev]);
      }

      setShowModal(false);
      Swal.fire("Éxito", "Tarea guardada correctamente", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo guardar la tarea", "error");
    }
  };

  // 🗑️ Eliminar tarea
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar tarea?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`tareas/${id}/eliminar/`);
      setTareas((prev) => prev.filter((t) => t.Id !== id));
      Swal.fire("Eliminada", "La tarea fue eliminada correctamente", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo eliminar la tarea", "error");
    }
  };

  // 🔁 Cambiar estado de tarea (completada o pendiente)
  const toggleEstado = async (t) => {
    try {
      const res = await api.put(`tareas/${t.Id}/actualizar/`, {
        ...t,
        Estado: !t.Estado,
      });
      setTareas((prev) => prev.map((x) => (x.Id === t.Id ? res.data : x)));
    } catch {
      Swal.fire("Error", "No se pudo actualizar el estado", "error");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center bg-light vh-100 vw-100"
      style={{ overflow: "hidden" }}
    >
      <div
        className="bg-white shadow-lg rounded-4 d-flex flex-column"
        style={{
          width: "90%",
          height: "90%",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <header className="text-black py-3 px-4 d-flex justify-content-between align-items-center rounded-top-4">
          <h4 className="fw-bold mb-0">Gestión de Tareas</h4>
          <button
            className="btn btn-light fw-semibold"
            onClick={() => openModal()}
          >
            + Crear tarea
          </button>
        </header>

        {/* Contenido principal */}
        <main
          className="flex-grow-1 overflow-auto p-4"
          style={{ backgroundColor: "#f8f9fa" }}
        >
          {loading ? (
            <p>Cargando...</p>
          ) : tareas.length === 0 ? (
            <div className="text-center text-muted mt-5">
              <h5>No hay tareas registradas.</h5>
            </div>
          ) : (
            <div className="list-group">
              {tareas.map((t) => (
                <div
                  key={t.Id}
                  className="list-group-item d-flex justify-content-between align-items-center mb-2 border rounded p-3 shadow-sm"
                >
                  <div className="d-flex align-items-start gap-3 w-100">
                    <input
                      type="checkbox"
                      className="form-check-input mt-1"
                      checked={t.Estado}
                      onChange={() => toggleEstado(t)}
                    />
                    <div className="flex-grow-1">
                      <h6
                        className={`mb-1 ${
                          t.Estado
                            ? "text-decoration-line-through text-success"
                            : "fw-semibold"
                        }`}
                      >
                        {t.Titulo}
                      </h6>
                      <p className="mb-1 text-muted small">{t.descripcion}</p>
                      <small className="text-secondary">
                        Vence: {t.FechaVence} —{" "}
                        {t.Estado ? "Completada ✅" : "Pendiente ⏳"}
                      </small>
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => openModal(t)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(t.Id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-top text-center py-2 small text-muted rounded-bottom-4">
          © {new Date().getFullYear()} Mi Gestor de Tareas
        </footer>

        {/* Modal */}
        {showModal && (
          <div
            className="modal fade show"
            style={{
              display: "block",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content rounded-3">
                <form onSubmit={handleSave}>
                  <div className="modal-header text-black">
                    <h5 className="modal-title">
                      {editingId ? "Editar tarea" : "Nueva tarea"}
                    </h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      onClick={() => setShowModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Título</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.Titulo}
                        onChange={(e) =>
                          setForm({ ...form, Titulo: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Descripción</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={form.descripcion}
                        onChange={(e) =>
                          setForm({ ...form, descripcion: e.target.value })
                        }
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Fecha de vencimiento</label>
                      <input
                        type="date"
                        className="form-control"
                        value={form.FechaVence}
                        onChange={(e) =>
                          setForm({ ...form, FechaVence: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="estadoTarea"
                        checked={form.Estado}
                        onChange={(e) =>
                          setForm({ ...form, Estado: e.target.checked })
                        }
                      />
                      <label className="form-check-label" htmlFor="estadoTarea">
                        Completada
                      </label>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-info">
                      {editingId ? "Guardar cambios" : "Crear"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Tareas;
