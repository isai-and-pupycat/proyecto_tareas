import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

const AUTH_STORAGE_KEYS = {
  token: 'token',
  user: 'user',
} as const;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export const applyAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete apiClient.defaults.headers.common.Authorization;
};

export const clearStoredSession = () => {
  localStorage.removeItem(AUTH_STORAGE_KEYS.token);
  localStorage.removeItem(AUTH_STORAGE_KEYS.user);
  applyAuthToken(null);
};

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url as string | undefined;
    const isAuthRoute = url?.includes('/auth/login') || url?.includes('/auth/register');

    if (!isAuthRoute && (status === 401 || status === 403)) {
      clearStoredSession();
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

type PeriodoApi = {
  id_periodo?: number;
  id?: number;
  nombre: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  fechaInicio?: string;
  fechaFin?: string;
};

const mapPeriodoFromApi = (periodo: PeriodoApi) => ({
  id: periodo.id ?? periodo.id_periodo ?? 0,
  nombre: periodo.nombre,
  fechaInicio: periodo.fechaInicio ?? periodo.fecha_inicio ?? '',
  fechaFin: periodo.fechaFin ?? periodo.fecha_fin ?? '',
});

const mapPeriodoToApi = (periodo: PeriodoApi) => ({
  nombre: periodo.nombre,
  fecha_inicio: periodo.fecha_inicio ?? periodo.fechaInicio ?? '',
  fecha_fin: periodo.fecha_fin ?? periodo.fechaFin ?? '',
});

type MateriaApi = {
  id_materia?: number;
  id?: number;
  nombre: string;
  profesor?: string;
  descripcion?: string;
  id_periodo?: number;
  periodoId?: number;
  periodo?: string;
};

const mapMateriaFromApi = (materia: MateriaApi) => ({
  id: materia.id ?? materia.id_materia ?? 0,
  nombre: materia.nombre,
  descripcion: materia.descripcion ?? materia.profesor ?? '',
  profesor: materia.profesor ?? materia.descripcion ?? '',
  periodoId: materia.periodoId ?? materia.id_periodo ?? 0,
  periodo: materia.periodo ?? '',
});

const mapMateriaToApi = (materia: MateriaApi) => ({
  nombre: materia.nombre,
  profesor: materia.profesor ?? materia.descripcion ?? '',
  id_periodo: materia.id_periodo ?? materia.periodoId ?? 0,
});

type TareaApi = {
  id_tarea?: number;
  id?: number;
  titulo: string;
  descripcion?: string;
  fecha_entrega?: string;
  fechaEntrega?: string;
  id_materia?: number;
  materiaId?: number;
  materia?: string;
  completada?: boolean;
  estado?: 'pendiente' | 'realizada' | 'entregada';
};

const mapTareaFromApi = (tarea: TareaApi) => ({
  id: tarea.id ?? tarea.id_tarea ?? 0,
  titulo: tarea.titulo,
  descripcion: tarea.descripcion ?? '',
  fechaEntrega: tarea.fechaEntrega ?? tarea.fecha_entrega ?? '',
  materiaId: tarea.materiaId ?? tarea.id_materia ?? 0,
  materia: tarea.materia ?? '',
  estado: tarea.estado ?? (tarea.completada ? 'realizada' : 'pendiente'),
});

const mapTareaToApi = (tarea: TareaApi) => ({
  titulo: tarea.titulo,
  descripcion: tarea.descripcion ?? '',
  fecha_entrega: tarea.fecha_entrega ?? tarea.fechaEntrega ?? '',
  id_materia: tarea.id_materia ?? tarea.materiaId ?? 0,
});

type HorarioApi = {
  id_horario?: number;
  id?: number;
  dia_semana?: string;
  diaSemana?: string;
  hora_inicio?: string;
  horaInicio?: string;
  hora_fin?: string;
  horaFin?: string;
  id_materia?: number;
  materiaId?: number;
  materia?: string;
  periodo?: string;
};

const dayCodeToLabel: Record<string, string> = {
  LUN: 'Lunes',
  LUNES: 'Lunes',
  Lun: 'Lunes',
  MAR: 'Martes',
  MARTES: 'Martes',
  Mar: 'Martes',
  MIE: 'Miercoles',
  MIERCOLES: 'Miercoles',
  Mie: 'Miercoles',
  JUE: 'Jueves',
  JUEVES: 'Jueves',
  Jue: 'Jueves',
  VIE: 'Viernes',
  VIERNES: 'Viernes',
  Vie: 'Viernes',
};

const dayLabelToCode: Record<string, string> = {
  Lunes: 'Lun',
  Martes: 'Mar',
  Miercoles: 'Mie',
  Jueves: 'Jue',
  Viernes: 'Vie',
};

const normalizeHorarioDayFromApi = (value?: string) => {
  if (!value) return '';
  const trimmed = value.trim();
  return dayCodeToLabel[trimmed.toUpperCase()] ?? dayCodeToLabel[trimmed] ?? trimmed;
};

const normalizeHorarioDayToApi = (value?: string) => {
  if (!value) return '';
  const trimmed = value.trim();
  return dayLabelToCode[trimmed] ?? trimmed.slice(0, 3);
};

const mapHorarioFromApi = (horario: HorarioApi) => ({
  id: horario.id ?? horario.id_horario ?? 0,
  diaSemana: normalizeHorarioDayFromApi(horario.diaSemana ?? horario.dia_semana),
  horaInicio: horario.horaInicio ?? horario.hora_inicio ?? '',
  horaFin: horario.horaFin ?? horario.hora_fin ?? '',
  materiaId: horario.materiaId ?? horario.id_materia ?? 0,
  materia: typeof horario.materia === 'string' ? { nombre: horario.materia } : horario.materia,
  periodo: horario.periodo ?? '',
});

const mapHorarioToApi = (horario: HorarioApi) => ({
  dia_semana: normalizeHorarioDayToApi(horario.dia_semana ?? horario.diaSemana),
  hora_inicio: horario.hora_inicio ?? horario.horaInicio ?? '',
  hora_fin: horario.hora_fin ?? horario.horaFin ?? '',
  id_materia: horario.id_materia ?? horario.materiaId ?? 0,
});

export const api = {
  getPeriodos: async () => {
    const response = await apiClient.get('/periodos');
    return {
      ...response,
      data: Array.isArray(response.data) ? response.data.map(mapPeriodoFromApi) : [],
    };
  },
  createPeriodo: async (data: PeriodoApi) => {
    const response = await apiClient.post('/periodos', mapPeriodoToApi(data));
    return {
      ...response,
      data: mapPeriodoFromApi(response.data),
    };
  },
  updatePeriodo: async (id: number, data: PeriodoApi) => {
    const response = await apiClient.put(`/periodos/${id}`, mapPeriodoToApi(data));
    return {
      ...response,
      data: mapPeriodoFromApi(response.data),
    };
  },
  deletePeriodo: (id: number) => apiClient.delete(`/periodos/${id}`),

  getMaterias: async () => {
    const response = await apiClient.get('/materias');
    return {
      ...response,
      data: Array.isArray(response.data) ? response.data.map(mapMateriaFromApi) : [],
    };
  },
  createMateria: async (data: MateriaApi) => {
    const response = await apiClient.post('/materias', mapMateriaToApi(data));
    return {
      ...response,
      data: mapMateriaFromApi(response.data),
    };
  },
  updateMateria: async (id: number, data: MateriaApi) => {
    const response = await apiClient.put(`/materias/${id}`, mapMateriaToApi(data));
    return {
      ...response,
      data: mapMateriaFromApi(response.data),
    };
  },
  deleteMateria: (id: number) => apiClient.delete(`/materias/${id}`),

  getTareas: async () => {
    const response = await apiClient.get('/tareas');
    return {
      ...response,
      data: Array.isArray(response.data) ? response.data.map(mapTareaFromApi) : [],
    };
  },
  createTarea: async (data: TareaApi) => {
    const response = await apiClient.post('/tareas', mapTareaToApi(data));
    return {
      ...response,
      data: mapTareaFromApi(response.data),
    };
  },
  updateTarea: async (id: number, data: TareaApi) => {
    const response = await apiClient.put(`/tareas/${id}`, mapTareaToApi(data));
    return {
      ...response,
      data: mapTareaFromApi(response.data),
    };
  },
  completeTarea: async (id: number) => {
    const response = await apiClient.patch(`/tareas/${id}/completar`);
    return {
      ...response,
      data: mapTareaFromApi(response.data),
    };
  },
  deleteTarea: (id: number) => apiClient.delete(`/tareas/${id}`),

  getHorarios: async () => {
    const response = await apiClient.get('/horarios');
    return {
      ...response,
      data: Array.isArray(response.data) ? response.data.map(mapHorarioFromApi) : [],
    };
  },
  createHorario: async (data: HorarioApi) => {
    const response = await apiClient.post('/horarios', mapHorarioToApi(data));
    return {
      ...response,
      data: mapHorarioFromApi(response.data),
    };
  },
  updateHorario: async (id: number, data: HorarioApi) => {
    const response = await apiClient.put(`/horarios/${id}`, mapHorarioToApi(data));
    return {
      ...response,
      data: mapHorarioFromApi(response.data),
    };
  },
  deleteHorario: (id: number) => apiClient.delete(`/horarios/${id}`),
};

