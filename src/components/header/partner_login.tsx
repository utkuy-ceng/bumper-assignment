"use client";

import Link from "next/link";

interface PartnerLoginProps {
  className?: string;
}

export default function PartnerLogin({ className = "" }: PartnerLoginProps) {
  return (
    <Link
      href="/login"
      className={`text-white hover:text-gray-200 transition-colors ${className}`}
    >
      Partner login
    </Link>
  );
}
