const base = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const LogoutIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" {...base} aria-hidden>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H9" />
  </svg>
);
export const ArrowLeftIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" {...base} strokeWidth={2.6} aria-hidden>
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
);
export const PlusIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" {...base} aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v8M8 12h8" />
  </svg>
);
export const SearchIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" {...base} aria-hidden>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);
