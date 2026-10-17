import Link from "next/link";

export default function Home({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-4 py-10">
      <h1 className="mb-2 text-4xl font-semibold sm:text-5xl">Job CRM</h1>
      <p className="mb-8 text-lg">Choose how you sign in.</p>
      {searchParams.error && (
        <p className="alert-error mb-6" role="alert">That reset link has expired. Request a new one from your login page.</p>
      )}
      <div className="grid gap-6 sm:grid-cols-2">
        <Link href="/employee/login" className="card transition hover:-translate-y-0.5">
          <h2 className="mb-2 text-2xl font-semibold">Employee</h2>
          <p>Create jobs, save drafts and send them to the sales team.</p>
        </Link>
        <Link href="/sales/login" className="card transition hover:-translate-y-0.5">
          <h2 className="mb-2 text-2xl font-semibold">Sales Team</h2>
          <p>Review incoming leads. Pass, approve or delete them.</p>
        </Link>
      </div>
    </main>
  );
}
