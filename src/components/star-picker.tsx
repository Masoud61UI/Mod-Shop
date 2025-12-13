"use client";

import { useState } from "react";
import { StarIcon } from "lucide-react";

import { cn } from "../lib/utils";

interface StarPickerProps {
  value?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

export default function StarPicker({
  value = 0,
  onChange,
  disabled,
  className,
}: StarPickerProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const handleChange = (value: number) => {
    onChange?.(value);
  };

  return (
    <div
      className={cn(
        "flex items-center",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          className={cn(
            "p-0.5 transition-transform",
            !disabled && "cursor-pointer hover:scale-110 active:scale-95"
          )}
          onClick={() => handleChange(star)}
          onMouseEnter={() => !disabled && setHoverValue(star)}
          onMouseLeave={() => !disabled && setHoverValue(0)}
        >
          <StarIcon
            className={cn(
              "size-4 sm:size-5 transition-colors",
              star <= (hoverValue || value)
                ? "fill-amber-500 text-amber-500"
                : "fill-gray-200 text-gray-300"
            )}
          />
        </button>
      ))}
    </div>
  );
}
