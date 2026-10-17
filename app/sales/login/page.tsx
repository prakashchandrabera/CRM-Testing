import AuthShell from "@/components/AuthCard";
import LoginForm from "@/components/LoginForm";

export default function Page({ searchParams }: { searchParams: { reset?: string } }) {
  return (
    <AuthShell portal="sales">
      <LoginForm portal="sales" notice={searchParams.reset ? "Password updated. Log in with your new password." : undefined} />
    </AuthShell>
  );
}
