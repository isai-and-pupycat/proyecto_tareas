import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import axios from 'axios';

interface Materia {
  id: number;
  nombre: string;
  descripcion: string;
  periodoId: number;
  periodo?: string;
}

interface Periodo {
  id: number;
  nombre: string;
}

const Materias: React.FC = () => {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [editing, setEditing] = useState<Materia | null>(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '', periodoId: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadMaterias();
    loadPeriodos();
  }, []);

  const loadMaterias = async () => {
    const response = await api.getMaterias();
    setMaterias(response.data);
  };

  const loadPeriodos = async () => {
    const response = await api.getPeriodos();
    setPeriodos(response.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const periodoId = Number.parseInt(form.periodoId, 10);
    if (!form.nombre.trim()) {
      setError('Escribe un nombre para la materia.');
      return;
    }

    if (Number.isNaN(periodoId)) {
      setError('Selecciona un periodo válido.');
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        await api.updateMateria(editing.id, {
          nombre: form.nombre.trim(),
          descripcion: form.descripcion.trim(),
          periodoId,
        });
        setSuccess('Materia actualizada correctamente.');
      } else {
        await api.createMateria({
          nombre: form.nombre.trim(),
          descripcion: form.descripcion.trim(),
          periodoId,
        });
        setSuccess('Materia creada correctamente.');
      }

      setForm({ nombre: '', descripcion: '', periodoId: '' });
      setEditing(null);
      await loadMaterias();
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (materia: Materia) => {
    setEditing(materia);
    setForm({
      nombre: materia.nombre,
      descripcion: materia.descripcion,
      periodoId: materia.periodoId.toString(),
    });
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id: number) => {
    setError('');
    setSuccess('');
    try {
      await api.deleteMateria(id);
      setSuccess('Materia eliminada correctamente.');
      await loadMaterias();
    } catch (err) {
      setError(getApiError(err));
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[390px_1fr]">
      <section className="rounded-[1.8rem] border border-white/60 bg-white/85 p-6 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.35)] backdrop-blur">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">
            {editing ? 'Modo edicion' : 'Nueva materia'}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-900">
            {editing ? 'Actualizar materia' : 'Crear materia'}
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            Organiza tus asignaturas con una interfaz más limpia y ordenada.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {success}
            </div>
          )}

          <Field label="Nombre">
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              placeholder="Ej. Matematicas"
              required
            />
          </Field>

          <Field label="Profesor">
            <textarea
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              className="min-h-[120px] w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              placeholder="Nombre del profesor o responsable"
            />
          </Field>

          <Field label="Periodo">
            <select
              value={form.periodoId}
              onChange={(e) => setForm({ ...form, periodoId: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              required
            >
              <option value="">Selecciona un periodo</option>
              {periodos.map((periodo) => (
                <option key={periodo.id} value={periodo.id}>
                  {periodo.nombre}
                </option>
              ))}
            </select>
          </Field>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-2xl border-0 bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-600 disabled:opacity-65"
              style={{
                appearance: 'none',
                WebkitAppearance: 'none',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 45%, #2563eb 100%)',
                backgroundColor: '#059669',
                color: '#ffffff',
                border: '1px solid #059669',
                opacity: saving ? 0.7 : 1,
                boxShadow: '0 18px 35px -20px rgba(5, 150, 105, 0.75)',
              }}
            >
              {saving ? 'Guardando...' : editing ? 'Actualizar materia' : 'Crear materia'}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setForm({ nombre: '', descripcion: '', periodoId: '' });
                  setError('');
                  setSuccess('');
                }}
                className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="rounded-[1.8rem] border border-white/60 bg-white/85 p-6 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.35)] backdrop-blur">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Listado</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-900">Materias registradas</h2>
          </div>
          <div className="inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            Total: {materias.length}
          </div>
        </div>

        <div className="grid gap-4">
          {materias.length === 0 ? (
            <div className="rounded-[1.4rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
              No hay materias registradas todavía.
            </div>
          ) : (
            materias.map((materia) => (
              <article
                key={materia.id}
                className="rounded-[1.4rem] border border-slate-200 bg-slate-50/80 p-5 transition hover:border-emerald-200 hover:bg-white"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{materia.nombre}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-500">
                      {materia.descripcion || 'Sin profesor asignado.'}
                    </p>
                    {materia.periodo && (
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                        {materia.periodo}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(materia)}
                      className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(materia.id)}
                      className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block space-y-2">
    <span className="text-sm font-semibold text-slate-700">{label}</span>
    {children}
  </label>
);

const getApiError = (err: unknown) => {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string; error?: string } | undefined;
    const message =
      data?.message ??
      data?.error ??
      (typeof err.response?.data === 'string' ? err.response.data : undefined) ??
      err.message;
    return `No se pudo guardar la materia: ${message}`;
  }

  return `No se pudo guardar la materia: ${(err as Error).message || 'Error desconocido'}`;
};

export default Materias;
