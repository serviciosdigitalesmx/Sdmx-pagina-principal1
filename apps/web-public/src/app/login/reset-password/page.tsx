"use client";

import Link from "next/link";

export default function ResetPasswordPage() {
  return (
    <main
      className="min-h-screen px-6 py-12 text-zinc-100"
      style={{
        background:
          "radial-gradient(circle_at_top,_rgba(180,83,9,0.14),_transparent_22%),radial-gradient(circle_at_80%_10%,_rgba(251,191,36,0.08),_transparent_24%),linear-gradient(180deg,#050505_0%,#0f0f10_46%,#141210_100%)",
      }}
    >
      <section className="mx-auto flex w-full max-w-2xl flex-col gap-6 rounded-[2rem] border border-stone-700 bg-[linear-gradient(180deg,rgba(16,14,12,0.96),rgba(22,18,14,0.98))] p-8 shadow-[0_30px_120px_rgba(120,53,15,0.16)] backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.35em] text-amber-100">Recuperación</p>
        <h1 className="text-4xl font-semibold tracking-tight text-stone-50">Revisa tu correo</h1>
        <p className="text-lg leading-8 text-stone-300">
          Si el correo existe en el sistema, te mandamos un enlace para crear una nueva contraseña.
        </p>
        <Link
          href="/login"
          className="w-fit rounded-full bg-amber-50 px-5 py-3 font-semibold text-zinc-950 transition hover:bg-amber-100"
        >
          Volver al login
        </Link>
      </section>
    </main>
  );
}
