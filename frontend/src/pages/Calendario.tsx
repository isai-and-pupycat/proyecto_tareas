import React, { useEffect, useMemo, useState } from 'react';
import esLocale from '@fullcalendar/core/locales/es';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventClickArg } from '@fullcalendar/core';
import { api } from '../services/api';

interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  fechaEntrega: string;
  estado: 'pendiente' | 'realizada' | 'entregada';
  materiaId: number;
  materia?: string;
}

interface Periodo {
  id: number;
  nombre: string;
}

interface Materia {
  id: number;
  nombre: string;
  periodoId?: number;
}

const calendarDayNames = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'];

const statusStyles: Record<Tarea['estado'], { label: string; color: string; chip: string }> = {
  pendiente: { label: 'Pendiente', color: '#f59e0b', chip: 'bg-amber-100 text-amber-700' },
  realizada: { label: 'Realizada', color: '#10b981', chip: 'bg-emerald-100 text-emerald-700' },
  entregada: { label: 'Entregada', color: '#3b82f6', chip: 'bg-blue-100 text-blue-700' },
};

const Calendario: React.FC = () => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [selectedPeriodo, setSelectedPeriodo] = useState<number | null>(null);
  const [selectedTask, setSelectedTask] = useState<Tarea | null>(null);

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

  const tareasFiltradas = useMemo(() => {
    if (!selectedPeriodo) return tareas;
    const materiasDelPeriodo = new Set(
      materias.filter((materia) => materia.periodoId === selectedPeriodo).map((materia) => materia.id)
    );
    return tareas.filter((tarea) => materiasDelPeriodo.has(tarea.materiaId));
  }, [materias, selectedPeriodo, tareas]);

  const stats = useMemo(() => {
    const pendientes = tareasFiltradas.filter((t) => t.estado === 'pendiente').length;
    const realizadas = tareasFiltradas.filter((t) => t.estado === 'realizada').length;
    const entregadas = tareasFiltradas.filter((t) => t.estado === 'entregada').length;
    return { total: tareasFiltradas.length, pendientes, realizadas, entregadas };
  }, [tareasFiltradas]);

  const events = useMemo(
    () =>
      tareasFiltradas.map((tarea) => ({
        title: tarea.titulo,
        start: tarea.fechaEntrega,
        backgroundColor: statusStyles[tarea.estado].color,
        borderColor: statusStyles[tarea.estado].color,
        textColor: '#ffffff',
        extendedProps: { tarea },
      })),
    [tareasFiltradas]
  );

  const nextTask = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return [...tareasFiltradas]
      .filter((t) => t.fechaEntrega >= today)
      .sort((a, b) => a.fechaEntrega.localeCompare(b.fechaEntrega))[0];
  }, [tareasFiltradas]);

  const currentPeriodoLabel = selectedPeriodo
    ? periodos.find((periodo) => periodo.id === selectedPeriodo)?.nombre ?? 'Periodo seleccionado'
    : 'Todos los periodos';

  const handleEventClick = (info: EventClickArg) => {
    const tarea = info.event.extendedProps.tarea as Tarea | undefined;
    if (tarea) setSelectedTask(tarea);
  };

  return (
    <>
      <div className="space-y-6">
        <section className="rounded-[1.8rem] border border-white/60 bg-white/85 p-6 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.35)] backdrop-blur">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">Calendario</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-900 sm:text-4xl">
                Organiza tus tareas por fecha
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
                Da seguimiento a tus entregas con una interfaz más limpia y ordenada.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-4">
              <MiniStat label="Total" value={stats.total} color="text-slate-800" />
              <MiniStat label="Pendientes" value={stats.pendientes} color="text-amber-700" />
              <MiniStat label="Realizadas" value={stats.realizadas} color="text-emerald-700" />
              <MiniStat label="Entregadas" value={stats.entregadas} color="text-blue-700" />
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
          <aside className="space-y-4">
            <div className="rounded-[1.6rem] border border-white/60 bg-white/85 p-5 shadow-[0_20px_45px_-34px_rgba(15,23,42,0.35)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Filtro</p>
              <label className="mt-4 block space-y-2">
                <span className="text-sm font-semibold text-slate-700">Periodo</span>
                <select
                  value={selectedPeriodo ?? ''}
                  onChange={(e) => setSelectedPeriodo(e.target.value ? parseInt(e.target.value, 10) : null)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                >
                  <option value="">Todos los periodos</option>
                  {periodos.map((periodo) => (
                    <option key={periodo.id} value={periodo.id}>
                      {periodo.nombre}
                    </option>
                  ))}
                </select>
              </label>
              <p className="mt-3 text-sm text-slate-500">
                Vista actual: <span className="font-semibold text-slate-700">{currentPeriodoLabel}</span>
              </p>
            </div>

            <div className="rounded-[1.6rem] border border-white/60 bg-white/85 p-5 shadow-[0_20px_45px_-34px_rgba(15,23,42,0.35)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Proxima tarea</p>
              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">{nextTask?.titulo ?? 'Sin proximas tareas'}</p>
                <p className="mt-2 text-sm text-slate-500">
                  {nextTask
                    ? `${formatDate(nextTask.fechaEntrega)} · ${statusStyles[nextTask.estado].label}`
                    : 'Agrega tareas para ver el siguiente vencimiento.'}
                </p>
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-white/60 bg-white/85 p-5 shadow-[0_20px_45px_-34px_rgba(15,23,42,0.35)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Estados</p>
              <div className="mt-4 space-y-2">
                {Object.values(statusStyles).map((status) => (
                  <div key={status.label} className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: status.color }} />
                    <span className="text-sm text-slate-600">{status.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <section className="rounded-[1.8rem] border border-white/60 bg-white/85 p-4 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.35)] backdrop-blur sm:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Vista mensual</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-900">{currentPeriodoLabel}</h2>
              </div>
            </div>

            <div className="calendar-tailwind notranslate rounded-[1.4rem] border border-slate-200 bg-white p-3 sm:p-4" translate="no">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                locales={[esLocale]}
                initialView="dayGridMonth"
                events={events}
                eventClick={handleEventClick}
                height="auto"
                headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,dayGridWeek' }}
                buttonText={{ today: 'Hoy', month: 'Mes', week: 'Semana' }}
                locale={esLocale}
                titleFormat={{ year: 'numeric', month: 'long' }}
                dayHeaderContent={(arg) => calendarDayNames[arg.date.getDay()]}
                dayMaxEvents={3}
                moreLinkText="mas"
                eventDisplay="block"
              />
            </div>

            {tareasFiltradas.length === 0 && (
              <div className="mt-5 rounded-[1.4rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
                No hay tareas para mostrar todavia.
              </div>
            )}
          </section>
        </div>
      </div>

      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[1.7rem] border border-white/60 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-600">Detalle de tarea</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-900">{selectedTask.titulo}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cerrar
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <div className="rounded-[1.3rem] bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Descripcion</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {selectedTask.descripcion || 'Esta tarea no tiene descripcion adicional.'}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.3rem] bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Fecha</p>
                  <p className="mt-3 text-sm font-semibold text-slate-800">{formatDate(selectedTask.fechaEntrega)}</p>
                </div>
                <div className="rounded-[1.3rem] bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Estado</p>
                  <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[selectedTask.estado].chip}`}>
                    {statusStyles[selectedTask.estado].label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .calendar-tailwind .fc {
          color: #334155;
        }
        .calendar-tailwind .fc-toolbar.fc-header-toolbar {
          margin-bottom: 1rem;
          gap: .75rem;
          flex-wrap: wrap;
        }
        .calendar-tailwind .fc .fc-toolbar-title {
          font-size: 1.6rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: #0f172a;
        }
        .calendar-tailwind .fc .fc-button {
          border-radius: 999px;
          border: 1px solid #dbe3ef;
          background: #f8fafc;
          color: #334155;
          box-shadow: none;
          padding: .55rem .9rem;
          text-transform: none;
          font-weight: 600;
        }
        .calendar-tailwind .fc .fc-button:hover,
        .calendar-tailwind .fc .fc-button:focus,
        .calendar-tailwind .fc .fc-button-primary:not(:disabled).fc-button-active {
          background: #e0f2fe;
          border-color: #bae6fd;
          color: #0369a1;
          box-shadow: none;
        }
        .calendar-tailwind .fc-theme-standard th,
        .calendar-tailwind .fc-theme-standard td,
        .calendar-tailwind .fc-theme-standard .fc-scrollgrid {
          border-color: #e2e8f0;
        }
        .calendar-tailwind .fc-col-header-cell {
          background: #f8fafc;
        }
        .calendar-tailwind .fc-col-header-cell-cushion,
        .calendar-tailwind .fc-daygrid-day-number {
          color: #64748b;
          text-decoration: none;
        }
        .calendar-tailwind .fc-daygrid-day.fc-day-today {
          background: #eff6ff;
        }
        .calendar-tailwind .fc-h-event {
          border-radius: 12px;
          padding: .15rem .35rem;
          font-size: .76rem;
          font-weight: 600;
        }
      `}</style>
    </>
  );
};

const MiniStat = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
    <p className={`mt-2 text-2xl font-semibold ${color}`}>{value}</p>
  </div>
);

const formatDate = (value: string) => {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
};

export default Calendario;
