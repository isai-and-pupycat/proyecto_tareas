import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const sections = [
  { id: 'tareas', title: 'Tareas', description: 'Gestiona entregas, avances y prioridades.', color: 'primary', icon: 'bi-journal-check' },
  { id: 'materias', title: 'Materias', description: 'Organiza asignaturas y descripciones.', color: 'success', icon: 'bi-book' },
  { id: 'periodos', title: 'Periodos', description: 'Administra ciclos y fechas clave.', color: 'warning', icon: 'bi-calendar2-range' },
  { id: 'horarios', title: 'Horarios', description: 'Controla bloques por dia y hora.', color: 'info', icon: 'bi-clock-history' },
  { id: 'calendario', title: 'Calendario', description: 'Mira tareas dentro de una vista mensual.', color: 'danger', icon: 'bi-calendar3' },
  { id: 'horario-semanal', title: 'Horario semanal', description: 'Visualiza toda tu semana escolar.', color: 'dark', icon: 'bi-grid-3x3-gap' },
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="d-grid gap-4">
      <section className="bs-card p-4 p-lg-5">
        <div className="d-flex flex-column flex-xl-row align-items-xl-end justify-content-between gap-3">
          <div>
            <div className="text-uppercase small fw-semibold text-primary mb-2">Panel principal</div>
            <h2 className="display-5 fw-bold mb-2">Hola, {user?.username ?? 'estudiante'}</h2>
            <p className="bs-muted fs-5 mb-0">Bienvenido</p>
          </div>
          <div className="badge text-bg-primary rounded-pill fs-6 px-4 py-3">{sections.length} modulos activos</div>
        </div>
      </section>

      <section className="row g-4">
        {sections.map((section) => (
          <div key={section.id} className="col-12 col-md-6 col-xxl-4">
            <button
              type="button"
              onClick={() => navigate(section.id)}
              className="card border-0 h-100 w-100 text-start overflow-hidden shadow-sm rounded-5"
            >
              <div className={`card-header border-0 text-white bg-${section.color} p-4`}>
                <div className="d-flex align-items-start justify-content-between gap-3">
                  <div>
                    <div className="text-uppercase small text-white-50 mb-2">Modulo</div>
                    <h3 className="h2 fw-bold mb-0">{section.title}</h3>
                  </div>
                  <i className={`bi ${section.icon} fs-1`} />
                </div>
              </div>
              <div className="card-body p-4">
                <p className="text-secondary mb-4">{section.description}</p>
                <span className={`btn btn-outline-${section.color} rounded-pill px-4`}>Abrir</span>
              </div>
            </button>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Dashboard;
