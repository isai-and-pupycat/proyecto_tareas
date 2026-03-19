import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

interface Horario {
  id: number;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  materia?: { nombre: string };
}

const dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
const shortDays = ['LU', 'MA', 'MI', 'JU', 'VI'];
const currentDayNames = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

const subjectStyles = [
  {
    card: 'border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-800',
    chip: 'bg-blue-100 text-blue-700',
    bar: 'bg-blue-500',
  },
  {
    card: 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-800',
    chip: 'bg-emerald-100 text-emerald-700',
    bar: 'bg-emerald-500',
  },
  {
    card: 'border-violet-200 bg-gradient-to-br from-violet-50 to-fuchsia-50 text-violet-800',
    chip: 'bg-violet-100 text-violet-700',
    bar: 'bg-violet-500',
  },
  {
    card: 'border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 text-amber-800',
    chip: 'bg-amber-100 text-amber-700',
    bar: 'bg-amber-500',
  },
  {
    card: 'border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50 text-rose-800',
    chip: 'bg-rose-100 text-rose-700',
    bar: 'bg-rose-500',
  },
];

const HorarioSemanal: React.FC = () => {
  const [horarios, setHorarios] = useState<Horario[]>([]);

  useEffect(() => {
    loadHorarios();
  }, []);

  const loadHorarios = async () => {
    const response = await api.getHorarios();
    setHorarios(response.data);
  };

  const getHorariosForDia = (dia: string) =>
    horarios
      .filter((horario) => normalizeDay(horario.diaSemana) === dia)
      .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

  const activeDays = useMemo(() => dias.filter((dia) => getHorariosForDia(dia).length > 0), [horarios]);

  const allSortedClasses = useMemo(
    () =>
      horarios
        .map((horario) => ({ ...horario, normalizedDay: normalizeDay(horario.diaSemana) }))
        .sort((a, b) => {
          const dayDiff = dias.indexOf(a.normalizedDay) - dias.indexOf(b.normalizedDay);
          if (dayDiff !== 0) return dayDiff;
          return a.horaInicio.localeCompare(b.horaInicio);
        }),
    [horarios]
  );

  const busiestDay = useMemo(() => {
    const ranked = dias
      .map((dia) => ({ dia, clases: getHorariosForDia(dia).length }))
      .sort((a, b) => b.clases - a.clases);
    return ranked[0]?.clases ? ranked[0] : null;
  }, [horarios]);

  const earliestClass = useMemo(() => {
    if (!allSortedClasses.length) return null;
    return [...allSortedClasses].sort((a, b) => a.horaInicio.localeCompare(b.horaInicio))[0];
  }, [allSortedClasses]);

  const nextClass = useMemo(() => getNextClass(allSortedClasses), [allSortedClasses]);

  const totalHours = useMemo(() => {
    const minutes = horarios.reduce((acc, horario) => acc + getClassDuration(horario.horaInicio, horario.horaFin), 0);
    return formatMinutes(minutes);
  }, [horarios]);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/90 shadow-[0_30px_60px_-36px_rgba(15,23,42,0.35)] backdrop-blur">
        <div className="relative px-6 py-7 sm:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.14),transparent_28%)]" />
          <div className="relative flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
                Vista semanal
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-900 sm:text-[2.65rem]">
                Tu horario escolar, claro y visual
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                Consulta tus bloques semanales con una interfaz mas limpia, detecta tu siguiente clase y revisa tu carga academica en segundos.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Metric label="Clases" value={horarios.length.toString()} tone="text-slate-900" />
              <Metric label="Dias activos" value={activeDays.length.toString()} tone="text-blue-700" />
              <Metric label="Carga total" value={totalHours} tone="text-emerald-700" />
              <Metric label="Dia fuerte" value={busiestDay?.dia ?? 'Libre'} tone="text-violet-700" />
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <aside className="space-y-4">
          <InfoCard
            eyebrow="Siguiente clase"
            title={nextClass ? `${nextClass.normalizedDay} · ${formatTime(nextClass.horaInicio)}` : 'Sin clases proximas'}
            description={
              nextClass
                ? `${nextClass.materia?.nombre ?? 'Materia sin nombre'} hasta ${formatTime(nextClass.horaFin)}`
                : 'Agrega bloques para detectar automaticamente tu siguiente clase.'
            }
            accent="from-blue-500/15 to-cyan-500/10"
          />
          <InfoCard
            eyebrow="Inicio mas temprano"
            title={earliestClass ? formatTime(earliestClass.horaInicio) : 'Sin datos'}
            description={
              earliestClass
                ? `${earliestClass.materia?.nombre ?? 'Materia sin nombre'} el ${earliestClass.normalizedDay}`
                : 'Todavia no hay clases registradas.'
            }
            accent="from-emerald-500/15 to-teal-500/10"
          />
        </aside>

        <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {dias.map((dia, index) => {
            const horariosDia = getHorariosForDia(dia);
            const totalMinutes = horariosDia.reduce((acc, horario) => acc + getClassDuration(horario.horaInicio, horario.horaFin), 0);

            return (
              <article
                key={dia}
                className="rounded-[1.7rem] border border-white/60 bg-white/90 p-5 shadow-[0_24px_55px_-38px_rgba(15,23,42,0.35)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_65px_-40px_rgba(37,99,235,0.32)]"
              >
                <header className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-3 inline-flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-xs font-bold tracking-[0.22em] text-white shadow-sm">
                        {shortDays[index]}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Dia escolar
                      </span>
                    </div>
                    <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-900">{dia}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {horariosDia.length
                        ? `${horariosDia.length} clase${horariosDia.length > 1 ? 's' : ''} · ${formatMinutes(totalMinutes)}`
                        : 'Sin clases programadas'}
                    </p>
                  </div>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                    {horariosDia.length}
                  </span>
                </header>

                <div className="space-y-3">
                  {horariosDia.length === 0 ? (
                    <div className="rounded-[1.3rem] border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">
                      Dia libre para descanso, estudio o actividades extra.
                    </div>
                  ) : (
                    horariosDia.map((horario) => {
                      const style = getStyleForMateria(horario.materia?.nombre ?? 'Materia');
                      const duration = getClassDuration(horario.horaInicio, horario.horaFin);
                      return (
                        <div key={horario.id} className={`rounded-[1.25rem] border p-4 ${style.card}`}>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${style.chip}`}>
                                {formatMinutes(duration)}
                              </span>
                              <h4 className="mt-3 text-sm font-semibold">
                                {horario.materia?.nombre ?? 'Materia sin nombre'}
                              </h4>
                              <p className="mt-1 text-xs opacity-80">
                                {formatTime(horario.horaInicio)} - {formatTime(horario.horaFin)}
                              </p>
                            </div>
                            <div className="rounded-2xl bg-white/70 px-3 py-2 text-[11px] font-semibold text-slate-600 shadow-sm">
                              Bloque
                            </div>
                          </div>
                          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/80">
                            <div
                              className={`h-full rounded-full ${style.bar}`}
                              style={{ width: `${Math.max(24, Math.min(100, (duration / 180) * 100))}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </article>
            );
          })}
        </section>
      </div>

      {horarios.length === 0 && (
        <section className="rounded-[1.8rem] border border-dashed border-slate-300 bg-white/80 p-8 text-center text-slate-500 shadow-[0_18px_45px_-35px_rgba(15,23,42,0.3)]">
          Todavia no hay clases registradas para mostrar.
        </section>
      )}
    </div>
  );
};

const Metric = ({ label, value, tone }: { label: string; value: string; tone: string }) => (
  <div className="rounded-[1.35rem] border border-slate-200 bg-white/95 px-4 py-4 shadow-[0_16px_35px_-30px_rgba(15,23,42,0.35)]">
    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</p>
    <p className={`mt-2 text-[1.7rem] font-semibold tracking-[-0.04em] ${tone}`}>{value}</p>
  </div>
);

const InfoCard = ({
  eyebrow,
  title,
  description,
  accent,
}: {
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
}) => (
  <div className={`overflow-hidden rounded-[1.7rem] border border-white/60 bg-white/90 shadow-[0_20px_48px_-36px_rgba(15,23,42,0.35)] backdrop-blur`}>
    <div className={`bg-gradient-to-r ${accent} px-5 py-5`}>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{eyebrow}</p>
      <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-900">{title}</p>
      <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
    </div>
  </div>
);

const normalizeDay = (value: string) => {
  const normalized = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
  const map: Record<string, string> = {
    lunes: 'Lunes',
    martes: 'Martes',
    miercoles: 'Miercoles',
    jueves: 'Jueves',
    viernes: 'Viernes',
    sabado: 'Sabado',
    domingo: 'Domingo',
  };
  return map[normalized] ?? value;
};

const getStyleForMateria = (materiaNombre: string) => {
  const index = materiaNombre.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % subjectStyles.length;
  return subjectStyles[index];
};

const formatTime = (time: string) => time.substring(0, 5);

const getClassDuration = (start: string, end: string) => {
  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);
  return endHour * 60 + endMinute - (startHour * 60 + startMinute);
};

const formatMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (!hours) return `${remainingMinutes} min`;
  if (!remainingMinutes) return `${hours} h`;
  return `${hours} h ${remainingMinutes} min`;
};

const getNextClass = (
  classes: Array<Horario & { normalizedDay: string }>
): (Horario & { normalizedDay: string }) | null => {
  if (!classes.length) return null;

  const now = new Date();
  const currentDay = currentDayNames[now.getDay()];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const ordered = [...classes].sort((a, b) => {
    const dayDiff = currentDayNames.indexOf(a.normalizedDay) - currentDayNames.indexOf(b.normalizedDay);
    if (dayDiff !== 0) return dayDiff;
    return a.horaInicio.localeCompare(b.horaInicio);
  });

  const sameDayUpcoming = ordered.find((item) => {
    if (item.normalizedDay !== currentDay) return false;
    const [hour, minute] = item.horaInicio.split(':').map(Number);
    return hour * 60 + minute >= currentMinutes;
  });

  if (sameDayUpcoming) return sameDayUpcoming;

  const currentDayIndex = currentDayNames.indexOf(currentDay);
  const nextDayUpcoming = ordered.find((item) => currentDayNames.indexOf(item.normalizedDay) > currentDayIndex);
  return nextDayUpcoming ?? ordered[0];
};

export default HorarioSemanal;
