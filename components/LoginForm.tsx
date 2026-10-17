"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { homeFor, type Role } from "@/lib/types";

export default function LoginForm({ portal, notice }: { portal: Role; notice?: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const form = new FormData(e.currentTarget);
    const supabase = createClient();

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: String(form.get("username")).trim(),
      password: String(form.get("password")),
    });
    if (signInError || !data.user) {
      setBusy(false);
      return setError("Wrong username or password.");
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();
    if (profile?.role !== portal) {
      await supabase.auth.signOut();
      setBusy(false);
      return setError(
        `This account can't sign in here. Use the ${profile?.role === "sales" ? "Sales Team" : "Employee"} login instead.`
      );
    }
    router.replace(homeFor(portal));
    router.refresh();
  }

  return (
    <>
      <h1 className="mb-8 text-5xl font-semibold">Login</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        {notice && <p className="alert-ok" role="status">{notice}</p>}
        {error && <p className="alert-error" role="alert">{error}</p>}
        <div>
          <label htmlFor="username" className="mb-1.5 block text-lg font-medium">Username</label>
          <input id="username" name="username" type="email" autoComplete="username" required className="input" placeholder="you@company.com" />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-lg font-medium">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required className="input" />
        </div>
        <button disabled={busy} className="btn btn-lg w-full">{busy ? "Signing in…" : "Log in"}</button>
        <Link href={`/${portal}/forgot`} className="block text-center text-sm font-medium underline-offset-4 hover:underline">
          Forgot / reset password
        </Link>
      </form>
    </>
  );
}
