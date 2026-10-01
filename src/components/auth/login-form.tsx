"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError("Email atau password salah. Silakan coba lagi.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-6">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-indigo-600">Admin Portal</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Masuk ke dashboard</h1>
      </div>

      <div className="space-y-5">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white"
            placeholder="admin@portfolio.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white"
            placeholder="Masukkan password"
          />
        </div>
      </div>

      {error ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-400"
      >
        {isSubmitting ? "Memeriksa login..." : "Masuk"}
      </button>
    </form>
  );
}
