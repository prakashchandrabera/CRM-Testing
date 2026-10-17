"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const password = String(f.get("password"));
    if (password.length < 8) return setError("Use at least 8 characters.");
    if (password !== String(f.get("confirm"))) return setError("Passwords don't match.");

    setBusy(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setBusy(false);
      return setError("Could not update the password. Request a new reset link.");
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user!.id).single();
    await supabase.auth.signOut();
    router.replace(`/${profile?.role ?? "employee"}/login?reset=1`);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
      <div className="card">
        <h1 className="mb-6 text-4xl font-semibold">New password</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          {error && <p className="alert-error" role="alert">{error}</p>}
          <input name="password" type="password" required autoComplete="new-password" className="input" placeholder="New password (8+ characters)" aria-label="New password" />
          <input name="confirm" type="password" required autoComplete="new-password" className="input" placeholder="Confirm new password" aria-label="Confirm new password" />
          <button disabled={busy} className="btn btn-lg w-full">{busy ? "Saving…" : "Save password"}</button>
        </form>
      </div>
    </main>
  );
}
