"use client";

import Link from "next/link";

interface LoginProps {
  className?: string;
}

export default function Login({ className = "" }: LoginProps) {
  return (
    <div className={`typography-description md:typography-small ${className}`}>
      <span className="text-white">Already registered? </span>
      <Link href="/login" className="text-[#32BE50]">
        Login
      </Link>
    </div>
  );
}
