"use client";
import SubmitButton from "./SubmitButton";

export default function ConfirmButton({
  action, label, message, className = "btn",
}: { action: () => Promise<void>; label: string; message: string; className?: string }) {
  return (
    <form action={action} onSubmit={(e) => { if (!window.confirm(message)) e.preventDefault(); }}>
      <SubmitButton className={className}>{label}</SubmitButton>
    </form>
  );
}
