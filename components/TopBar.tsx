import Link from "next/link";
import { signOutAction } from "@/app/actions";
import type { Role } from "@/lib/types";
import { ArrowLeftIcon, LogoutIcon } from "./icons";

export default function TopBar({ portal, backHref, title }: { portal: Role; backHref?: string; title?: string }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div className="flex items-center gap-4">
        {backHref && (
          <Link href={backHref} aria-label="Back" className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white shadow-pill">
            <ArrowLeftIcon />
          </Link>
        )}
        {title && <h1 className="text-3xl font-semibold sm:text-4xl">{title}</h1>}
      </div>
      <form action={signOutAction.bind(null, portal)}>
        <button className="flex items-center gap-2 text-sm font-semibold hover:text-black" aria-label="Log out">
          Logout <LogoutIcon />
        </button>
      </form>
    </div>
  );
}
