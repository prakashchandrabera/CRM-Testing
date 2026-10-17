"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Role, Vote } from "@/lib/types";

export type FormState = { error?: string } | undefined;

async function requireRole(role: Role) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${role}/login`);
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== role) redirect("/");
  return { supabase, user };
}

export async function signOutAction(portal: Role) {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect(`/${portal}/login`);
}

// ---------- Employee ----------
export async function saveJob(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireRole("employee");
  const intent = formData.get("intent") === "send" ? "send" : "save";
  const text = (k: string) => String(formData.get(k) ?? "").trim();

  const first_name = text("first_name");
  const email = text("email");
  if (!first_name) return { error: "Enter a first name." };
  if (email && !/^\S+@\S+\.\S+$/.test(email)) return { error: "Enter a valid email address." };
  if (intent === "send" && !email && !text("phone"))
    return { error: "Add an email or phone number before sending to CRM." };

  const { data, error } = await supabase
    .from("jobs")
    .insert({
      first_name,
      last_name: text("last_name"),
      email,
      phone: text("phone"),
      additional_comments: text("additional_comments"),
      status: intent === "send" ? "sent" : "draft",
      sent_at: intent === "send" ? new Date().toISOString() : null,
    })
    .select("job_number")
    .single();

  if (error || !data) return { error: "Could not save the job. Try again." };
  redirect(`/employee/job/${data.job_number}`);
}

export async function resendJob(jobNumber: number) {
  const { supabase } = await requireRole("employee");
  await supabase
    .from("jobs")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("job_number", jobNumber);
  revalidatePath(`/employee/job/${jobNumber}`);
  revalidatePath("/sales/leads");
}

export async function deleteEmployeeJob(jobNumber: number) {
  const { supabase } = await requireRole("employee");
  await supabase.from("jobs").delete().eq("job_number", jobNumber);
  redirect("/employee/dashboard");
}

// ---------- Sales ----------
export async function voteJob(jobId: string, vote: Vote) {
  const { supabase, user } = await requireRole("sales");
  await supabase
    .from("job_votes")
    .upsert({ job_id: jobId, user_id: user.id, vote }, { onConflict: "job_id,user_id" });
  revalidatePath("/sales/leads");
  revalidatePath("/sales/history");
}

export async function deleteSalesJob(jobId: string) {
  const { supabase } = await requireRole("sales");
  await supabase.from("jobs").delete().eq("id", jobId);
  revalidatePath("/sales/leads");
  revalidatePath("/sales/history");
}
