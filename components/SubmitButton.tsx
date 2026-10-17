"use client";
import { useFormStatus } from "react-dom";

export default function SubmitButton({
  children, className = "btn", name, value, pendingLabel,
}: { children: React.ReactNode; className?: string; name?: string; value?: string; pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" name={name} value={value} disabled={pending} className={className}>
      {pending ? pendingLabel ?? "Working…" : children}
    </button>
  );
}
