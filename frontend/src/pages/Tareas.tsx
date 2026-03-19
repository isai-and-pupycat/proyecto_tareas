import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { api } from '../services/api';

interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  fechaEntrega: string;
  estado: 'pendiente' | 'realizada' | 'entregada';
  materiaId: number;
  periodoId?: number;
  materia?: string;
}

interface Materia {
  id: number;
  nombre: string;
  periodoId?: number;
}

interface Periodo {
  id: number;
  nombre: string;
}

const statusStyles: Record<Tarea['estado'], string> = {
  pendiente: 'bg-amber-100 text-amber-700',
  realizada: 'bg-emerald-100 text-emerald-700',
  entregada: 'bg-blue-100 text-blue-700',
};

const initialForm = {
  titulo: '',
  descripcion: '',
  fechaEntrega: '',
  estado: 'pendiente' as Tarea['estado'],
  materiaId: '',
  periodoId: '',
};

const Tareas: React.FC = () => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [editing, setEditing] = useState<Tarea | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    loadTareas();
    loadMaterias();
    loadPeriodos();
  }, []);

  const loadTareas = async () => {
    const response = await api.getTareas();
    setTareas(response.data);
  };

  const loadMaterias = async () => {
    const response = await api.getMaterias();
    setMaterias(response.data);
  };

  const loadPeriodos = async () => {
    const response = await api.getPeriodos();
    setPeriodos(response.data);
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditing(null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const materiaId = Number.parseInt(form.materiaId, 10);
    const periodoId = Number.parseInt(form.periodoId, 10);

    if (!form.titulo.trim()) {
      setError('Escribe un titulo para la tarea.');
      return;
    }

    if (Number.isNaN(periodoId)) {
      setError('Selecciona un periodo valido.');
      return;
    }

    if (Number.isNaN(materiaId)) {
      setError('Selecciona una materia valida.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim(),
        fechaEntrega: form.fechaEntrega,
        materiaId,
      };

      const response = editing
        ? await api.updateTarea(editing.id, payload)
        : await api.createTarea(payload);

      if (form.estado !== 'pendiente') {
        await api.completeTarea(response.data.id);
      }

      setSuccess(editing ? 'Tarea actualizada correctamente.' : 'Tarea creada correctamente.');
      setForm(initialForm);
      setEditing(null);
      await loadTareas();
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (tarea: Tarea) => {
    setEditing(tarea);
    setForm({
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      fechaEntrega: tarea.fechaEntrega,
      estado: tarea.estado,
      materiaId: tarea.materiaId.toString(),
      periodoId: materias.find((materia) => materia.id === tarea.materiaId)?.periodoId?.toString() ?? '',
    });
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id: number) => {
    setError('');
    setSuccess('');
    try {
      await api.deleteTarea(id);
      setSuccess('Tarea eliminada correctamente.');
      await loadTareas();
    } catch (err) {
      setError(getApiError(err));
    }
  };

  const materiasFiltradas = form.periodoId
    ? materias.filter((materia) => materia.periodoId === Number.parseInt(form.periodoId, 10))
    : materias;

  return (
    <div className="grid gap-6 xl:grid-cols-[430px_1fr]">
      <section className="overflow-hidden rounded-[1.8rem] border border-white/60 bg-white/85 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.35)] backdrop-blur">
        <div className="relative border-b border-slate-100 px-6 py-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.10),transparent_24%)]" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">
              {editing ? 'Editar tarea' : 'Nueva tarea'}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-900">
              {editing ? 'Actualizar tarea' : 'Crear tarea'}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-7 text-slate-500">
              Organiza entregas con un panel mas visual, rapido de completar y facil de escanear.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <QuickStat label="Estado inicial" value={form.estado} tone="text-amber-700" />
              <QuickStat label="Materias" value={materiasFiltradas.length.toString()} tone="text-indigo-700" />
              <QuickStat label="Periodos" value={periodos.length.toString()} tone="text-sky-700" />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
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

          <Field
            label="Titulo"
            hint="Usa un nombre corto y claro para identificar la entrega."
            icon="bi bi-type"
          >
            <input
              type="text"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              placeholder="Ej. Entregar proyecto final"
              required
            />
          </Field>

          <Field
            label="Descripcion"
            hint="Anota instrucciones, archivos o puntos que no quieres olvidar."
            icon="bi bi-card-text"
          >
            <textarea
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              className="min-h-[140px] w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              placeholder="Agrega instrucciones o detalles relevantes"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Fecha de entrega"
              hint="Selecciona cuando debe estar lista."
              icon="bi bi-calendar-event"
            >
              <input
                type="date"
                value={form.fechaEntrega}
                onChange={(e) => setForm({ ...form, fechaEntrega: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                required
              />
            </Field>

            <Field label="Estado" hint="Define como quieres registrar la tarea." icon="bi bi-flag">
              <select
                value={form.estado}
                onChange={(e) => setForm({ ...form, estado: e.target.value as Tarea['estado'] })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              >
                <option value="pendiente">Pendiente</option>
                <option value="realizada">Realizada</option>
                <option value="entregada">Entregada</option>
              </select>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Periodo" hint="Elige el bloque academico al que pertenece." icon="bi bi-collection">
              <select
                value={form.periodoId}
                onChange={(e) => setForm({ ...form, periodoId: e.target.value, materiaId: '' })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
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

            <Field label="Materia" hint="Se filtra segun el periodo seleccionado." icon="bi bi-book">
              <select
                value={form.materiaId}
                onChange={(e) => setForm({ ...form, materiaId: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                required
              >
                <option value="">Selecciona una materia</option>
                {materiasFiltradas.map((materia) => (
                  <option key={materia.id} value={materia.id}>
                    {materia.nombre}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-w-[210px] items-center justify-center rounded-2xl border-0 bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-600 disabled:opacity-65"
              style={{
                appearance: 'none',
                WebkitAppearance: 'none',
                background: 'linear-gradient(135deg, #4f46e5 0%, #2563eb 55%, #0ea5e9 100%)',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: '1px solid #2563eb',
                opacity: saving ? 0.7 : 1,
                boxShadow: '0 18px 35px -20px rgba(37, 99, 235, 0.75)',
              }}
            >
              {saving ? 'Guardando...' : editing ? 'Actualizar tarea' : 'Crear tarea'}
            </button>

            {editing && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
              >
                Cancelar
              </button>
            )}

            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
              Completa el panel y guarda cuando todo se vea bien.
            </p>
          </div>
        </form>
      </section>

      <section className="rounded-[1.8rem] border border-white/60 bg-white/85 p-6 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.35)] backdrop-blur">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Seguimiento</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-900">Tareas registradas</h2>
          </div>
          <div className="inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
            Total: {tareas.length}
          </div>
        </div>

        <div className="grid gap-4">
          {tareas.length === 0 ? (
            <div className="rounded-[1.4rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
              No hay tareas registradas todavia.
            </div>
          ) : (
            tareas.map((tarea) => (
              <article
                key={tarea.id}
                className="rounded-[1.4rem] border border-slate-200 bg-slate-50/80 p-5 transition hover:border-indigo-200 hover:bg-white"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-slate-900">{tarea.titulo}</h3>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[tarea.estado]}`}>
                        {tarea.estado}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-slate-500">
                      {tarea.descripcion || 'Sin descripcion disponible.'}
                    </p>
                    <p className="mt-3 text-sm font-medium text-slate-700">Entrega: {tarea.fechaEntrega}</p>
                    {'materia' in tarea && (tarea as Tarea & { materia?: string }).materia && (
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
                        {(tarea as Tarea & { materia?: string }).materia}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(tarea)}
                      className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(tarea.id)}
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

const QuickStat = ({ label, value, tone }: { label: string; value: string; tone: string }) => (
  <div className="rounded-[1.25rem] border border-white/70 bg-white/80 px-4 py-3 shadow-[0_14px_30px_-28px_rgba(15,23,42,0.35)]">
    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
    <p className={`mt-2 text-base font-semibold capitalize ${tone}`}>{value}</p>
  </div>
);

const Field = ({
  label,
  hint,
  icon,
  children,
}: {
  label: string;
  hint?: string;
  icon?: string;
  children: React.ReactNode;
}) => (
  <label className="block rounded-[1.5rem] border border-slate-200/80 bg-white/85 p-4 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.35)] transition hover:border-indigo-200">
    <div className="mb-3 flex items-start gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 text-white shadow-[0_14px_30px_-20px_rgba(79,70,229,0.65)]">
        <i className={icon ?? 'bi bi-pencil-square'} />
      </div>
      <div>
        <span className="block text-sm font-semibold text-slate-800">{label}</span>
        {hint && <span className="mt-1 block text-xs leading-5 text-slate-500">{hint}</span>}
      </div>
    </div>
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
    return `No se pudo guardar la tarea: ${message}`;
  }

  return `No se pudo guardar la tarea: ${(err as Error).message || 'Error desconocido'}`;
};

export default Tareas;
