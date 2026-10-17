import type { Job } from "@/lib/types";

export default function JobPanel({ job }: { job: Job }) {
  return (
    <div className="panel space-y-4 text-sm leading-relaxed">
      <p>
        <span className="opacity-70">First name:</span> {job.first_name}
        <br />
        <span className="opacity-70">Last name:</span> {job.last_name || "—"}
      </p>
      <p>
        <span className="opacity-70">Email:</span> {job.email || "—"}
        <br />
        <span className="opacity-70">Phone:</span> {job.phone || "—"}
      </p>
      <p>
        <span className="opacity-70">Additional comments:</span>
        <br />
        <span className="whitespace-pre-wrap">{job.additional_comments || "—"}</span>
      </p>
    </div>
  );
}
