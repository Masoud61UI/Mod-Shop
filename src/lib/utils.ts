import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatToman(value: number | string) {
  return new Intl.NumberFormat("fa-IR").format(Number(value));
}

export function toPersianNumber(value: number | string): string {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

  return value.toString().replace(/\d/g, (digit: string) => {
    const num = parseInt(digit);
    return persianDigits[num] || digit; // اگر مشکلی پیش آمد، عدد اصلی رو برگردون
  });
}
