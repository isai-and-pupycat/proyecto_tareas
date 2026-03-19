import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Periodos from './pages/Periodos';
import Materias from './pages/Materias';
import Tareas from './pages/Tareas';
import Horarios from './pages/Horarios';
import Calendario from './pages/Calendario';
import HorarioSemanal from './pages/HorarioSemanal';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  return user ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="periodos" element={<Periodos />} />
            <Route path="materias" element={<Materias />} />
            <Route path="tareas" element={<Tareas />} />
            <Route path="horarios" element={<Horarios />} />
            <Route path="calendario" element={<Calendario />} />
            <Route path="horario-semanal" element={<HorarioSemanal />} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;