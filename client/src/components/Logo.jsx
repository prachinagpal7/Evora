import React from "react";
import { Link } from "react-router-dom";

// Icon: an "E" built from three bars, the middle one in the accent color.
export const LogoMark = ({ className = "h-6 w-6" }) => (
  <svg
    viewBox="0 0 16 16"
    className={className}
    fill="none"
    aria-hidden="true"
  >
    <rect x="0" y="0" width="4" height="16" rx="1" fill="#e4e4e7" />
    <rect x="0" y="0" width="16" height="4" rx="1" fill="#e4e4e7" />
    <rect x="0" y="6" width="11" height="4" rx="1" fill="#22d3ee" />
    <rect x="0" y="12" width="16" height="4" rx="1" fill="#e4e4e7" />
  </svg>
);

// Icon + wordmark. The wordmark uses the app font, so it always matches the UI.
const Logo = ({ className = "" }) => (
  <Link
    to="/"
    aria-label="Evora home"
    className={`inline-flex items-center gap-2.5 ${className}`}
  >
    <LogoMark />
    <span className="text-lg font-semibold tracking-tight text-zinc-100">
      Evora
    </span>
  </Link>
);

export default Logo;
