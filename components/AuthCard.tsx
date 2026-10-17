import Link from "next/link";
import type { Role } from "@/lib/types";

export default function AuthShell({ portal, children }: { portal: Role; children: React.ReactNode }) {
  const label = portal === "employee" ? "Employee" : "Sales Team";
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
      <Link href="/" className="mb-4 text-sm font-semibold underline-offset-4 hover:underline">← All portals</Link>
      <div className="card">
        <p className="mb-1 text-sm font-semibold text-neutral-500">{label} portal</p>
        {children}
      </div>
    </main>
  );
}
