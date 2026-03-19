import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const items = [
  { to: '/dashboard', label: 'Inicio', icon: 'bi-house-door' },
  { to: '/dashboard/tareas', label: 'Tareas', icon: 'bi-journal-check' },
  { to: '/dashboard/materias', label: 'Materias', icon: 'bi-book' },
  { to: '/dashboard/periodos', label: 'Periodos', icon: 'bi-calendar2-range' },
  { to: '/dashboard/horarios', label: 'Horarios', icon: 'bi-clock-history' },
  { to: '/dashboard/calendario', label: 'Calendario', icon: 'bi-calendar3' },
  { to: '/dashboard/horario-semanal', label: 'Horario semanal', icon: 'bi-grid-3x3-gap' },
];

interface SidebarProps {
  onNavigate?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    onNavigate?.();
  };

  return (
    <aside className="bs-card p-4 h-100">
      <div className="text-uppercase small fw-semibold text-secondary mb-3">Navegacion</div>

      <nav className="d-grid gap-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) =>
              `d-flex align-items-center gap-3 rounded-4 px-3 py-3 text-decoration-none ${
                isActive ? 'bg-primary text-white shadow-sm' : 'bg-light text-dark'
              }`
            }
            onClick={() => onNavigate?.()}
          >
            <i className={`bi ${item.icon} fs-5`} />
            <span className="fw-semibold">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-top mt-4 pt-4">
        <div className="small text-secondary">Conectado como</div>
        <div className="fw-semibold mt-1">{user?.username}</div>
        <button onClick={handleLogout} className="btn btn-dark w-100 rounded-4 mt-3">
          Cerrar sesion
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
