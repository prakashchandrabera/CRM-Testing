import { createClient } from "@/lib/supabase/server";
import TopBar from "@/components/TopBar";
import LeadsBoard from "@/components/LeadsBoard";
import type { Job, Vote } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const supabase = createClient();
  const [{ data: jobs }, { data: votes }] = await Promise.all([
    supabase.from("jobs").select("*").eq("status", "sent").order("sent_at", { ascending: false }),
    supabase.from("job_votes").select("job_id, vote"),
  ]);
  const myVotes = Object.fromEntries((votes ?? []).map((v) => [v.job_id, v.vote as Vote]));

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="card">
        <TopBar portal="sales" title="Sales Team" />
        <LeadsBoard jobs={(jobs ?? []) as Job[]} myVotes={myVotes} />
      </div>
    </main>
  );
}
