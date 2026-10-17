import AuthShell from "@/components/AuthCard";
import ForgotForm from "@/components/ForgotForm";

export default function Page() {
  return (
    <AuthShell portal="employee">
      <ForgotForm portal="employee" />
    </AuthShell>
  );
}
