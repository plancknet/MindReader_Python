import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-6xl font-semibold text-white">404</h1>
      <p className="max-w-md text-slate-300">
        Ops! Esta dimensao mental ainda nao foi descoberta. Volte para a tela inicial e tente novamente.
      </p>
      <Link
        to="/"
        className="rounded-full bg-gradient-to-r from-quadrant.b to-quadrant.d px-8 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-slate-900 transition hover:scale-[1.03]"
      >
        Retornar
      </Link>
    </div>
  );
}
