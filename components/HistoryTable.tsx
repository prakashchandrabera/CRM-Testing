"use client";
import { useMemo, useState } from "react";
import type { Job } from "@/lib/types";

const csvCell = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;

export default function HistoryTable({ jobs }: { jobs: Job[] }) {
  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return jobs;
    return jobs.filter((j) =>
      [j.job_number, j.first_name, j.last_name, j.email, j.phone].join(" ").toLowerCase().includes(s)
    );
  }, [jobs, q]);

  function exportCsv() {
    const head = ["Job ID", "First name", "Last name", "Email", "Phone", "Pass", "Approved"];
    const lines = rows.map((j) =>
      [j.job_number, j.first_name || "no name", j.last_name || "no name", j.email, j.phone, j.pass_count, j.approved_count]
        .map(csvCell).join(",")
    );
    const blob = new Blob([[head.map(csvCell).join(","), ...lines].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "history-leads.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} className="input max-w-xs" placeholder="Search name, email, phone, Job ID" aria-label="Search history" />
        <button onClick={exportCsv} className="btn">Export CSV</button>
        <span className="text-sm">{rows.length} of {jobs.length} leads</span>
      </div>
      <div className="overflow-x-auto rounded-2xl ring-1 ring-black/10">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-neutral-100 text-xs font-semibold">
            <tr>
              {["Job ID", "First name", "Last name", "Email", "Phone", "Pass", "Approved"].map((h) => (
                <th key={h} scope="col" className="px-3 py-2.5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {rows.map((j) => (
              <tr key={j.id} className="hover:bg-neutral-50">
                <td className="px-3 py-2 font-semibold">{j.job_number}</td>
                <td className="px-3 py-2">{j.first_name || "no name"}</td>
                <td className="px-3 py-2">{j.last_name || "no name"}</td>
                <td className="px-3 py-2">{j.email}</td>
                <td className="px-3 py-2">{j.phone}</td>
                <td className="px-3 py-2">{j.pass_count}</td>
                <td className="px-3 py-2">{j.approved_count}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={7} className="px-3 py-6 text-center">No leads match your search.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
