import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import axios from 'axios';

interface Periodo {
  id: number;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
}

const Periodos: React.FC = () => {
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [editing, setEditing] = useState<Periodo | null>(null);
  const [form, setForm] = useState({ nombre: '', fechaInicio: '', fechaFin: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPeriodos();
  }, []);

  const loadPeriodos = async () => {
    const response = await api.getPeriodos();
    setPeriodos(response.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validatePeriodoForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      nombre: form.nombre.trim(),
      fechaInicio: normalizeDate(form.fechaInicio),
      fechaFin: normalizeDate(form.fechaFin),
    };

    setSaving(true);
    try {
      if (editing) {
        await api.updatePeriodo(editing.id, payload);
        setSuccess('Periodo actualizado correctamente.');
      } else {
        await api.createPeriodo(payload);
        setSuccess('Periodo creado correctamente.');
      }

      setForm({ nombre: '', fechaInicio: '', fechaFin: '' });
      setEditing(null);
      await loadPeriodos();
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (periodo: Periodo) => {
    setEditing(periodo);
    setForm({
      nombre: periodo.nombre,
      fechaInicio: normalizeDate(periodo.fechaInicio),
      fechaFin: normalizeDate(periodo.fechaFin),
    });
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id: number) => {
    setError('');
    setSuccess('');
    try {
      await api.deletePeriodo(id);
      setSuccess('Periodo eliminado correctamente.');
      await loadPeriodos();
    } catch (err) {
      setError(getApiError(err));
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[390px_1fr]">
      <section className="rounded-[1.8rem] border border-white/60 bg-white/85 p-6 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.35)] backdrop-blur">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
            {editing ? 'Editar periodo' : 'Nuevo periodo'}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-900">
            {editing ? 'Actualizar periodo' : 'Crear periodo'}
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            Organiza tus ciclos escolares con una interfaz más limpia y ordenada.
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

          <Field label="Nombre del periodo">
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
              placeholder="Ej. Primer semestre"
              required
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Fecha de inicio">
              <input
                type="date"
                value={form.fechaInicio}
                onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                required
              />
            </Field>
            <Field label="Fecha de fin">
              <input
                type="date"
                value={form.fechaFin}
                onChange={(e) => setForm({ ...form, fechaFin: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                required
              />
            </Field>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-2xl border-0 bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-600 disabled:opacity-65"
              style={{
                appearance: 'none',
                WebkitAppearance: 'none',
                background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 50%, #4338ca 100%)',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: '1px solid #2563eb',
                opacity: saving ? 0.7 : 1,
                boxShadow: '0 18px 35px -20px rgba(37, 99, 235, 0.75)',
              }}
            >
              {saving ? 'Guardando...' : editing ? 'Actualizar periodo' : 'Crear periodo'}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setForm({ nombre: '', fechaInicio: '', fechaFin: '' });
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
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Planeacion</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-900">Periodos académicos</h2>
          </div>
          <div className="inline-flex rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700">
            Total: {periodos.length}
          </div>
        </div>

        <div className="grid gap-4">
          {periodos.length === 0 ? (
            <div className="rounded-[1.4rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
              No hay periodos registrados todavía.
            </div>
          ) : (
            periodos.map((periodo) => (
              <article
                key={periodo.id}
                className="rounded-[1.4rem] border border-slate-200 bg-slate-50/80 p-5 transition hover:border-sky-200 hover:bg-white"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{periodo.nombre}</h3>
                    <div className="mt-3 space-y-2 text-sm text-slate-500">
                      <p>Inicio: <span className="font-medium text-slate-700">{periodo.fechaInicio}</span></p>
                      <p>Fin: <span className="font-medium text-slate-700">{periodo.fechaFin}</span></p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(periodo)}
                      className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(periodo.id)}
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

const normalizeDate = (value: string) => value?.slice(0, 10);

const isValidDateInput = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(`${value}T00:00:00`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    date.getDate() === day
  );
};

const validatePeriodoForm = (form: { nombre: string; fechaInicio: string; fechaFin: string }) => {
  if (!form.nombre.trim()) {
    return 'Escribe un nombre para el periodo.';
  }

  if (!isValidDateInput(form.fechaInicio)) {
    return 'La fecha de inicio no es válida.';
  }

  if (!isValidDateInput(form.fechaFin)) {
    return 'La fecha de fin no es válida.';
  }

  if (form.fechaFin < form.fechaInicio) {
    return 'La fecha de fin no puede ser menor que la fecha de inicio.';
  }

  return '';
};

const getApiError = (err: unknown) => {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string; error?: string } | undefined;
    const message =
      data?.message ??
      data?.error ??
      (typeof err.response?.data === 'string' ? err.response.data : undefined) ??
      err.message;
    return `No se pudo guardar el periodo: ${message}`;
  }

  return `No se pudo guardar el periodo: ${(err as Error).message || 'Error desconocido'}`;
};

export default Periodos;

