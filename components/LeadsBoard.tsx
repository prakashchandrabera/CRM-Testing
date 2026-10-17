"use client";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { deleteSalesJob, voteJob } from "@/app/actions";
import type { Job, Vote } from "@/lib/types";
import JobPanel from "./JobPanel";

export default function LeadsBoard({ jobs, myVotes }: { jobs: Job[]; myVotes: Record<string, Vote> }) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(jobs[0]?.id ?? null);
  const [pending, start] = useTransition();

  // Live updates: a job appears the moment an employee clicks Send CRM.
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("jobs-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "jobs" }, () => router.refresh())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [router]);

  const selected = jobs.find((j) => j.id === selectedId) ?? jobs[0];
  const mine = selected ? myVotes[selected.id] : undefined;

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-3xl font-semibold">Leads / Job ID</h2>
        <Link href="/sales/history" className="btn btn-lg">History Lookup</Link>
      </div>

      {jobs.length === 0 || !selected ? (
        <p className="panel text-sm">No leads yet. New jobs appear here the moment an employee clicks Send CRM.</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <ul className="max-h-[28rem] space-y-2 overflow-y-auto pr-1" aria-label="Incoming leads">
            {jobs.map((j) => (
              <li key={j.id}>
                <button
                  onClick={() => setSelectedId(j.id)}
                  aria-current={j.id === selected.id}
                  className={`w-full rounded-2xl px-4 py-3 text-left text-sm shadow-pill ring-1 ring-black/5 transition ${
                    j.id === selected.id ? "bg-panel text-white" : "bg-white hover:bg-neutral-100"
                  }`}
                >
                  <span className="block font-semibold">#{j.job_number} · {j.first_name} {j.last_name}</span>
                  <span className="block text-xs opacity-70">
                    Pass {j.pass_count} · Approved {j.approved_count}
                    {myVotes[j.id] ? ` · You: ${myVotes[j.id]}` : ""}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div>
            <h3 className="mb-3 text-lg font-semibold">Job ID details: #{selected.job_number}</h3>
            <div className="grid items-start gap-6 md:grid-cols-[1fr_auto]">
              <JobPanel job={selected} />
              <div className="flex flex-col items-stretch gap-3">
                <button
                  disabled={pending}
                  className="btn"
                  onClick={() => {
                    if (window.confirm(`Delete job #${selected.job_number}? This can't be undone.`))
                      start(() => deleteSalesJob(selected.id));
                  }}
                >
                  Delete JOB
                </button>
                <p className="text-center text-sm font-semibold">
                  Pass: {selected.pass_count} &nbsp; Approved: {selected.approved_count}
                </p>
                <button disabled={pending} onClick={() => start(() => voteJob(selected.id, "pass"))}
                  className={mine === "pass" ? "btn ring-2 ring-black ring-offset-2" : "btn"} aria-pressed={mine === "pass"}>
                  Pass
                </button>
                <button disabled={pending} onClick={() => start(() => voteJob(selected.id, "approved"))}
                  className={mine === "approved" ? "btn ring-2 ring-black ring-offset-2" : "btn"} aria-pressed={mine === "approved"}>
                  Approved
                </button>
                {mine && <p className="text-center text-xs">Your vote: {mine}. Tap the other button to change it.</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
