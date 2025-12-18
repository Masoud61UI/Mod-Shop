export const TAG_OPTIONS = [
  { label: "همه مقالات", value: "all" },
  { label: "ترندهای فصلی", value: "seasonal-trends" },
  { label: "استایل‌سازی", value: "styling" },
  { label: "مراقبت از لباس", value: "clothing-care" },
  { label: "تخفیف‌ها", value: "discounts" },
  { label: "اخبار", value: "news" },
] as const;

export function getTagLabel(value: string): string {
  const tag = TAG_OPTIONS.find((t) => t.value === value);
  return tag ? tag.label : value;
}
