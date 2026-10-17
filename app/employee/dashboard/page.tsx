import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import TopBar from "@/components/TopBar";
import JobForm from "@/components/JobForm";
import LookupForm from "@/components/LookupForm";
import type { Job } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EmployeeDashboard() {
  const supabase = createClient();
  const { data } = await supabase
    .from("jobs")
    .select("job_number, first_name, last_name, status")
    .order("job_number", { ascending: false })
    .limit(8);
  const recent = (data ?? []) as Pick<Job, "job_number" | "first_name" | "last_name" | "status">[];

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <div className="card">
        <TopBar portal="employee" title="Employee" />
        <div className="mb-8 flex justify-end"><LookupForm /></div>
        <JobForm />
      </div>

      <section className="card">
        <h2 className="mb-4 text-xl font-semibold">Your recent jobs</h2>
        {recent.length === 0 ? (
          <p className="text-sm">No jobs yet. Fill in the form above and choose Save or Send CRM.</p>
        ) : (
          <ul className="divide-y divide-neutral-200">
            {recent.map((j) => (
              <li key={j.job_number}>
                <Link href={`/employee/job/${j.job_number}`} className="flex items-center justify-between py-3 hover:text-black">
                  <span className="font-semibold">#{j.job_number} · {j.first_name} {j.last_name}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${j.status === "sent" ? "bg-emerald-100 text-emerald-800" : "bg-neutral-200"}`}>
                    {j.status === "sent" ? "Sent to CRM" : "Draft"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
