import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accepted, setAccepted] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Registro fallido:', error);
      alert(`Error en registro: ${error.message ?? 'Revisa el backend o la URL de la API.'}`);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white px-4 py-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.08),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_24%),linear-gradient(180deg,#ffffff_0%,#f9fbff_52%,#f3f7fc_100%)]" />
      <div className="absolute inset-y-0 left-0 hidden w-[32%] bg-[linear-gradient(180deg,rgba(239,246,255,0.9)_0%,rgba(255,255,255,0.2)_100%)] lg:block" />
      <div className="absolute left-10 top-16 h-56 w-56 rounded-full bg-cyan-100/60 blur-3xl" />
      <div className="absolute right-8 top-10 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-52 w-52 rounded-full bg-sky-100/50 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-2rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full max-w-[1060px] gap-8 lg:grid-cols-[1fr_760px] lg:items-center">
          <section className="hidden lg:block">
            <div className="max-w-[320px]">
              <span className="inline-flex rounded-full border border-cyan-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700 shadow-sm">
                Mi Aula
              </span>
              <h1 className="mt-5 text-5xl font-semibold tracking-[-0.05em] text-slate-800">Crea tu cuenta y empieza</h1>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Registra tu usuario para comenzar a organizar tus periodos, materias, tareas y horarios desde un solo lugar.
              </p>
              <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-white/90 p-5 shadow-[0_24px_45px_-32px_rgba(15,23,42,0.22)]">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">Espacio limpio</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Un acceso claro, con fondo blanco y una interfaz pensada para que el registro se sienta sencillo y profesional.
                </p>
              </div>
            </div>
          </section>

          <section className="relative w-full rounded-[0.8rem] border border-slate-200 bg-white px-7 py-7 shadow-[0_30px_70px_-36px_rgba(15,23,42,0.18)] sm:px-12 sm:py-8">
            <div className="mx-auto max-w-[590px]">
              <div className="mb-5">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-cyan-200 hover:text-cyan-600"
                >
                  <i className="bi bi-arrow-left" />
                  Volver al login
                </Link>
              </div>

              <div className="text-center">
                <h1 className="text-[1.8rem] font-semibold tracking-[-0.03em] text-slate-800">Registro</h1>
                <p className="mt-2 text-sm text-slate-500">
                  Crea tu cuenta para comenzar a organizar tus materias, tareas y horarios.
                </p>
              </div>

              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">
                      Nombre de usuario
                    </span>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="h-[46px] w-full rounded-md border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                      placeholder="Ingresa tu usuario"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">
                      Email
                    </span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-[46px] w-full rounded-md border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                      placeholder="ejemplo@correo.com"
                    />
                  </label>
                </div>

                <div className="max-w-[340px]">
                  <label className="block">
                    <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">
                      Contrasena
                    </span>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-[46px] w-full rounded-md border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                      placeholder="••••••••"
                    />
                  </label>
                </div>

                <label className="flex items-start gap-2.5 rounded-xl bg-slate-50 px-3 py-3 text-[11px] text-slate-500">
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    required
                    className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500"
                  />
                  <span>
                    He leido y acepto las{' '}
                    <span className="font-medium underline decoration-slate-300 underline-offset-2">
                      Condiciones Generales y la Politica de Privacidad
                    </span>
                  </span>
                </label>

                <div className="pt-1 text-center">
                  <button
                    type="submit"
                    className="inline-flex min-w-[230px] items-center justify-center rounded-md border-0 bg-[#20c4cb] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_18px_35px_-20px_rgba(32,196,203,0.75)] transition hover:bg-[#18b2b8]"
                  >
                    Registrar
                  </button>
                </div>
              </form>

              <p className="mt-8 text-center text-sm text-slate-500">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="font-semibold text-cyan-600 transition hover:text-cyan-500">
                  Inicia sesion aqui
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Register;
