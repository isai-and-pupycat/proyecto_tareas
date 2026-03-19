import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login fallido:', error);
      alert(`Error en login: ${error.message ?? 'Revisa el backend o la URL de la API.'}`);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white px-4 py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.16),transparent_24%),linear-gradient(180deg,#ffffff_0%,#f4f9ff_52%,#edf6ff_100%)]" />
      <div className="absolute inset-y-0 left-0 hidden w-[34%] bg-[linear-gradient(180deg,rgba(239,246,255,0.95)_0%,rgba(224,242,254,0.65)_55%,rgba(255,255,255,0.25)_100%)] lg:block" />
      <div className="absolute -left-10 top-20 h-64 w-64 rounded-full bg-cyan-200/70 blur-3xl" />
      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-blue-200/70 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-sky-200/60 blur-3xl" />
      <div className="absolute bottom-16 right-20 hidden h-28 w-28 rounded-[2rem] bg-gradient-to-br from-cyan-300/50 to-blue-300/50 blur-2xl lg:block" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full max-w-[1080px] gap-8 lg:grid-cols-[1fr_760px] lg:items-center">
          <section className="hidden lg:block">
            <div className="max-w-[340px]">
              <span className="inline-flex rounded-full border border-cyan-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700 shadow-sm">
                Mi Aula
              </span>
              <h1 className="mt-5 text-5xl font-semibold tracking-[-0.05em] text-slate-800">Tu espacio escolar digital</h1>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Accede a tus materias, tareas y horarios desde una interfaz clara, moderna y lista para tu seguimiento diario.
              </p>

              <div className="mt-8 rounded-[1.8rem] border border-cyan-100 bg-white/90 p-5 shadow-[0_24px_45px_-32px_rgba(15,23,42,0.22)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-[0_14px_30px_-18px_rgba(37,99,235,0.75)]">
                    <i className="bi bi-stars text-base" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">Ingreso moderno</p>
                    <p className="mt-1 text-sm font-medium text-slate-700">Todo listo para entrar</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Un acceso claro, con acentos en azul y cyan para que la pantalla se sienta actual, ordenada y agradable.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-700">Tareas</span>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">Materias</span>
                  <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">Horarios</span>
                </div>
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white px-7 py-8 shadow-[0_30px_70px_-36px_rgba(15,23,42,0.18)] sm:px-12 sm:py-10">
            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600" />
            <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-cyan-100/70 blur-3xl" />
            <div className="absolute -bottom-8 -left-6 h-32 w-32 rounded-full bg-blue-100/60 blur-3xl" />

            <div className="mx-auto max-w-[590px]">
              <div className="mb-5 flex items-center justify-between gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700"
                >
                  <i className="bi bi-arrow-left" />
                  Ir a registro
                </Link>
                <span className="inline-flex items-center rounded-full border border-sky-200 bg-gradient-to-r from-cyan-50 to-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 shadow-sm">
                  Acceso seguro
                </span>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[1.35rem] bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-600 text-white shadow-[0_18px_35px_-18px_rgba(37,99,235,0.7)]">
                  <i className="bi bi-person-lock text-[1.35rem]" />
                </div>
                <h1 className="text-[2rem] font-semibold tracking-[-0.03em] text-slate-800">Acceso</h1>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Ingresa a tu cuenta para continuar con tus tareas, materias y horarios.
                </p>
              </div>

              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">
                    Correo electronico
                  </span>
                  <div className="relative">
                    <i className="bi bi-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ejemplo@correo.com"
                      className="h-[50px] w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                    />
                  </div>
                </label>

                <label className="block max-w-[360px]">
                  <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">
                    Contrasena
                  </span>
                  <div className="relative">
                    <i className="bi bi-shield-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="********"
                      className="h-[50px] w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                    />
                  </div>
                </label>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <label className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-50 to-sky-50 px-3 py-3 text-[11px] uppercase tracking-[0.06em] text-slate-500">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500"
                    />
                    Recordarme
                  </label>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700"
                    style={{
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      backgroundColor: '#ffffff',
                      color: '#334155',
                      borderColor: '#cbd5e1',
                      cursor: 'pointer',
                    }}
                  >
                    Recuperar contrasena
                  </button>
                </div>

                <div className="pt-1 text-center">
                  <button
                    type="submit"
                    className="inline-flex min-h-[52px] w-full items-center justify-center rounded-xl border border-blue-600 bg-blue-600 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-[0_20px_40px_-22px_rgba(37,99,235,0.8)] transition hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-cyan-100"
                    style={{
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      background: 'linear-gradient(90deg, #06b6d4 0%, #0ea5e9 50%, #2563eb 100%)',
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      borderColor: '#2563eb',
                      opacity: 1,
                      cursor: 'pointer',
                    }}
                  >
                    Ingresar
                  </button>
                </div>
              </form>

              <p className="mt-8 text-center text-sm text-slate-500">
                ¿No tienes cuenta?{' '}
                <Link to="/register" className="font-semibold text-cyan-600 transition hover:text-cyan-500">
                  Registrate aqui
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Login;
