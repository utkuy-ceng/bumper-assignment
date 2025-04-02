"use client";

import Link from "next/link";

interface RegisterProps {
  className?: string;
  isActive?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function Register({
  className = "",
  isActive = false,
  onMouseEnter,
  onMouseLeave,
}: RegisterProps) {
  return (
    <Link
      href="/form"
      className={`relative text-white hover:text-gray-200 transition-colors ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      Register
      {isActive && (
        <div className="absolute -bottom-1 left-0 w-full h-1 bg-[var(--primary-color)]"></div>
      )}
    </Link>
  );
}
