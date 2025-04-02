"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  icon?: IconDefinition;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  href,
  onClick,
  children,
  icon,
  className = "",
  type = "button",
}: ButtonProps) {
  const buttonClasses = `inline-flex items-center justify-center gap-[10px] bg-[#32BE50] border border-[#1B1B1B] text-black py-[12px] px-[16px] rounded-[27px] font-medium hover:bg-green-600 transition ${className}`;

  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        <span>{children}</span>
        {icon && <FontAwesomeIcon icon={icon} width={16} height={16} />}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={buttonClasses}>
      <span>{children}</span>
      {icon && <FontAwesomeIcon icon={icon} width={16} height={16} />}
    </button>
  );
}
