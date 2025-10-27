import { RefObject } from "react";

export const useDropdownPosition = (
  ref: RefObject<HTMLDivElement | null> | RefObject<HTMLDivElement>
) => {
  const getDropdownPosition = () => {
    if (!ref.current) return { top: 0, left: 0 };

    const rect = ref.current.getBoundingClientRect();
    const dropdownWidth = 224;

    let left = rect.right + window.scrollX - dropdownWidth;
    const top = rect.bottom + window.scrollY;

    if (left < 0) {
      left = window.innerWidth - dropdownWidth - 16;
    }

    return { top, left };
  };

  return { getDropdownPosition };
};
