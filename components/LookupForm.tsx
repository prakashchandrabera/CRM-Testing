"use client";
import { useRouter } from "next/navigation";
import { SearchIcon } from "./icons";

export default function LookupForm() {
  const router = useRouter();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const n = String(new FormData(e.currentTarget).get("n")).replace(/\D/g, "");
        if (n) router.push(`/employee/job/${n}`);
      }}
      className="flex items-center gap-3"
      role="search"
    >
      <SearchIcon />
      <input name="n" inputMode="numeric" className="input w-48" placeholder="Job ID lookup" aria-label="Job ID lookup" />
    </form>
  );
}
