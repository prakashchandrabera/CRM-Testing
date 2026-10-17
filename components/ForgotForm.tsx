"use client";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Role } from "@/lib/types";

export default function ForgotForm({ portal }: { portal: Role }) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const email = String(new FormData(e.currentTarget).get("email")).trim();
    const { error } = await createClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
    });
    setBusy(false);
    if (error) return setError("Could not send the email. Wait a minute and try again.");
    setSent(true);
  }

  return (
    <>
      <h1 className="mb-3 text-4xl font-semibold">Reset password</h1>
      {sent ? (
        <p className="alert-ok" role="status">
          If that email has an account, a reset link is on its way. Open it in this browser.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <p className="text-sm">Enter your account email and we'll send a reset link.</p>
          {error && <p className="alert-error" role="alert">{error}</p>}
          <input name="email" type="email" required autoComplete="email" className="input" placeholder="you@company.com" aria-label="Email" />
          <button disabled={busy} className="btn btn-lg w-full">{busy ? "Sending…" : "Send reset link"}</button>
        </form>
      )}
      <Link href={`/${portal}/login`} className="mt-6 block text-center text-sm font-medium underline-offset-4 hover:underline">
        Back to login
      </Link>
    </>
  );
}
