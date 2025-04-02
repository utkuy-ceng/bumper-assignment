"use client";

interface StepProps {
  number: number;
  title: string;
  description: string;
  titleSize?: string;
  descriptionSize?: string;
  className?: string;
}

export default function Step({
  number,
  title,
  description,
  titleSize = "typography-description font-bold",
  descriptionSize = "typography-small text-gray-700",
  className = "",
}: StepProps) {
  return (
    <div className={`flex gap-4 ${className}`}>
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--primary-color)] flex items-center justify-center text-white font-bold">
        {number}
      </div>
      <div>
        <h3 className={titleSize + " mb-1"}>{title}</h3>
        <p className={descriptionSize}>{description}</p>
      </div>
    </div>
  );
}
