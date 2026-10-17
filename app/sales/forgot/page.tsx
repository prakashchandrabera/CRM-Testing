import AuthShell from "@/components/AuthCard";
import ForgotForm from "@/components/ForgotForm";

export default function Page() {
  return (
    <AuthShell portal="sales">
      <ForgotForm portal="sales" />
    </AuthShell>
  );
}
