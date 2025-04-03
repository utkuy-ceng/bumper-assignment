"use client";

import Register from "./register";
import Login from "./login";

interface CTAProps {
  className?: string;
}

export default function CTA({ className = "" }: CTAProps) {
  return (
    <div className={`flex flex-col gap-5 md:gap-2 lg:gap-3 ${className}`}>
      <Register />
      <Login />
    </div>
  );
}
