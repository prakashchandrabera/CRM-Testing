import { createClient } from "@/lib/supabase/server";
import TopBar from "@/components/TopBar";
import HistoryTable from "@/components/HistoryTable";
import type { Job } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("jobs").select("*").eq("status", "sent").order("job_number", { ascending: false });

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="card">
        <TopBar portal="sales" backHref="/sales/leads" title="History Leads" />
        <HistoryTable jobs={(data ?? []) as Job[]} />
      </div>
    </main>
  );
}
