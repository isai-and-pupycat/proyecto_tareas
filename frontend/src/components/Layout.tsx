import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const { user } = useAuth();
  const displayName = user?.username?.trim() || 'estudiante';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1200) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="bs-shell text-dark">
      <header className="sticky-top border-bottom bg-white bg-opacity-75 backdrop-blur">
        <div className="container-fluid px-3 px-lg-4">
          <div className="d-flex align-items-center justify-content-between py-3">
            <div className="d-flex align-items-center gap-3">
              <button
                type="button"
                className="btn btn-light rounded-circle shadow-sm"
                onClick={() => setSidebarOpen((prev) => !prev)}
                aria-label="Abrir navegacion"
                aria-expanded={sidebarOpen}
              >
                <i className="bi bi-list fs-5" />
              </button>
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-4 shadow-sm"
                  style={{
                    width: 48,
                    height: 48,
                    minWidth: 48,
                    background: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
                    border: '1px solid rgba(255,255,255,0.55)',
                    boxShadow: '0 14px 30px -18px rgba(37, 99, 235, 0.75)',
                  }}
                />
                <div>
                  <div className="text-uppercase small text-secondary">Mi Aula</div>
                  <div className="fs-3 fw-semibold">Panel Escolar</div>
                  <div className="small text-secondary">Bienvenido, {displayName}. Organiza tus clases, tareas y horarios en un solo lugar.</div>
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <div
                className="rounded-circle bg-primary shadow-sm overflow-hidden"
                style={{ width: 44, height: 44, minWidth: 44, fontSize: '0.9rem', letterSpacing: '0.02em', lineHeight: 1 }}
                title={displayName}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="container-fluid px-3 px-lg-4 py-4">
        {sidebarOpen && (
          <>
            <div className="bs-sidebar-backdrop d-xl-none" onClick={() => setSidebarOpen(false)} />
            <div className="bs-sidebar-drawer d-xl-none">
              <Sidebar onNavigate={() => setSidebarOpen(false)} />
            </div>
          </>
        )}

        <div className="row g-4">
          <div className="col-12 col-xl-3 d-none d-xl-block">
            <Sidebar />
          </div>
          <div className="col-12 col-xl-9">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
