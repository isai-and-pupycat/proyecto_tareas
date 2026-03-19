import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { api } from '../services/api';

interface Horario {
  id: number;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  materiaId: number;
  materia?: { nombre: string };
  periodo?: string;
}

interface Materia {
  id: number;
  nombre: string;
}

const diasSemanales = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];

const badgeByDay: Record<string, string> = {
  Lunes: 'bg-blue-100 text-blue-700',
  Martes: 'bg-cyan-100 text-cyan-700',
  Miercoles: 'bg-emerald-100 text-emerald-700',
  Jueves: 'bg-violet-100 text-violet-700',
  Viernes: 'bg-amber-100 text-amber-700',
};

const Horarios: React.FC = () => {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [editing, setEditing] = useState<Horario | null>(null);
  const [form, setForm] = useState({ diaSemana: '', horaInicio: '', horaFin: '', materiaId: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadHorarios();
    loadMaterias();
  }, []);

  const loadHorarios = async () => {
    const response = await api.getHorarios();
    setHorarios(response.data);
  };

  const loadMaterias = async () => {
    const response = await api.getMaterias();
    setMaterias(response.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const materiaId = Number.parseInt(form.materiaId, 10);
    if (!form.diaSemana || !form.horaInicio || !form.horaFin) {
      setError('Completa dia y horas del horario.');
      return;
    }

    if (Number.isNaN(materiaId)) {
      setError('Selecciona una materia valida.');
      return;
    }

    if (form.horaFin <= form.horaInicio) {
      setError('La hora de fin debe ser mayor que la hora de inicio.');
      return;
    }

    setSaving(true);
    try {
      const payload = { ...form, materiaId };
      if (editing) {
        await api.updateHorario(editing.id, payload);
        setSuccess('Horario actualizado correctamente.');
      } else {
        await api.createHorario(payload);
        setSuccess('Horario creado correctamente.');
      }

      setForm({ diaSemana: '', horaInicio: '', horaFin: '', materiaId: '' });
      setEditing(null);
      await loadHorarios();
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (horario: Horario) => {
    setEditing(horario);
    setForm({
      diaSemana: horario.diaSemana,
      horaInicio: horario.horaInicio,
      horaFin: horario.horaFin,
      materiaId: horario.materiaId.toString(),
    });
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id: number) => {
    setError('');
    setSuccess('');
    try {
      await api.deleteHorario(id);
      setSuccess('Horario eliminado correctamente.');
      await loadHorarios();
    } catch (err) {
      setError(getApiError(err));
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[390px_1fr]">
      <section className="rounded-[1.8rem] border border-white/60 bg-white/85 p-6 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.35)] backdrop-blur">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
            {editing ? 'Editar bloque' : 'Nuevo bloque'}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-900">
            {editing ? 'Actualizar horario' : 'Agregar horario'}
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            Organiza tus bloques de clase con una interfaz más limpia y ordenada.
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

          <Field label="Dia de la semana">
            <select
              value={form.diaSemana}
              onChange={(e) => setForm({ ...form, diaSemana: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              required
            >
              <option value="">Selecciona un dia</option>
              {diasSemanales.map((dia) => (
                <option key={dia} value={dia}>
                  {dia}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Hora inicio">
              <input
                type="time"
                value={form.horaInicio}
                onChange={(e) => setForm({ ...form, horaInicio: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                required
              />
            </Field>
            <Field label="Hora fin">
              <input
                type="time"
                value={form.horaFin}
                onChange={(e) => setForm({ ...form, horaFin: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                required
              />
            </Field>
          </div>

          <Field label="Materia">
            <select
              value={form.materiaId}
              onChange={(e) => setForm({ ...form, materiaId: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              required
            >
              <option value="">Selecciona una materia</option>
              {materias.map((materia) => (
                <option key={materia.id} value={materia.id}>
                  {materia.nombre}
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
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 45%, #0f766e 100%)',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: '1px solid #2563eb',
                opacity: saving ? 0.7 : 1,
                boxShadow: '0 18px 35px -20px rgba(37, 99, 235, 0.75)',
              }}
            >
              {saving ? 'Guardando...' : editing ? 'Actualizar horario' : 'Agregar horario'}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setForm({ diaSemana: '', horaInicio: '', horaFin: '', materiaId: '' });
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
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Orden del dia</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-900">Horarios registrados</h2>
          </div>
          <div className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            Total: {horarios.length}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {horarios.length === 0 ? (
            <div className="md:col-span-2 rounded-[1.4rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
              No hay horarios registrados todavia.
            </div>
          ) : (
            horarios.map((horario) => {
              const materia = horario.materia?.nombre ? horario.materia : materias.find((m) => m.id === horario.materiaId);
              return (
                <article
                  key={horario.id}
                  className="rounded-[1.4rem] border border-slate-200 bg-slate-50/80 p-5 transition hover:border-blue-200 hover:bg-white"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          badgeByDay[horario.diaSemana] ?? 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {horario.diaSemana}
                      </span>
                      <h3 className="mt-3 text-xl font-semibold text-slate-900">
                        {materia?.nombre || 'Materia desconocida'}
                      </h3>
                      <p className="mt-2 text-sm text-slate-500">
                        {horario.horaInicio} - {horario.horaFin}
                      </p>
                      {horario.periodo && (
                        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                          {horario.periodo}
                        </p>
                      )}
                    </div>
                    <div className="rounded-2xl bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600">Hora</div>
                  </div>

                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={() => handleEdit(horario)}
                      className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(horario.id)}
                      className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              );
            })
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
    return `No se pudo guardar el horario: ${message}`;
  }

  return `No se pudo guardar el horario: ${(err as Error).message || 'Error desconocido'}`;
};

export default Horarios;
