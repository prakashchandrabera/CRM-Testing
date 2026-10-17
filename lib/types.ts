export type Role = "employee" | "sales";
export type Vote = "pass" | "approved";

export type Job = {
  id: string;
  job_number: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  additional_comments: string;
  status: "draft" | "sent";
  pass_count: number;
  approved_count: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  sent_at: string | null;
};

export const homeFor = (role: Role) =>
  role === "employee" ? "/employee/dashboard" : "/sales/leads";
