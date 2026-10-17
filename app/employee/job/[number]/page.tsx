import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deleteEmployeeJob, resendJob } from "@/app/actions";
import TopBar from "@/components/TopBar";
import JobPanel from "@/components/JobPanel";
import ConfirmButton from "@/components/ConfirmButton";
import type { Job } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function JobPage({ params }: { params: { number: string } }) {
  const n = Number(params.number);
  if (!Number.isInteger(n)) notFound();

  const supabase = createClient();
  const { data } = await supabase.from("jobs").select("*").eq("job_number", n).maybeSingle();
  if (!data) notFound();
  const job = data as Job;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="card">
        <TopBar portal="employee" backHref="/employee/dashboard" />
        <h1 className="mb-1 text-3xl font-semibold">Job ID details: #{job.job_number}</h1>
        <p className="mb-6 text-sm">
          {job.status === "sent"
            ? `Sent to CRM ${new Date(job.sent_at ?? job.updated_at).toLocaleString()}`
            : "Draft. Not visible to the sales team yet."}
        </p>
        <div className="grid items-start gap-6 md:grid-cols-[1fr_auto]">
          <JobPanel job={job} />
          <div className="flex flex-col gap-3">
            <ConfirmButton
              action={deleteEmployeeJob.bind(null, job.job_number)}
              label="Delete JOB"
              message={`Delete job #${job.job_number}? This also removes it from the sales team's list.`}
            />
            <ConfirmButton
              action={resendJob.bind(null, job.job_number)}
              label={job.status === "sent" ? "Resend CRM" : "Send CRM"}
              message="Send this job to the sales team now?"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
