import { useQueryStates, parseAsString, parseAsStringLiteral, parseAsInteger } from "nuqs";

const sortValues = ["پرفروش‌ترین", "جدیدترین", "قدیمی‌ترین"] as const;

const params = {
  sort: parseAsStringLiteral(sortValues).withDefault("جدیدترین"),
  minPrice: parseAsString
    .withOptions({
      clearOnDefault: true,
    })
    .withDefault(""),
  maxPrice: parseAsString
    .withOptions({
      clearOnDefault: true,
    })
    .withDefault(""),
  page: parseAsInteger
    .withOptions({
      clearOnDefault: true,
    })
    .withDefault(1),
};

export const useProductFilters = () => {
  return useQueryStates(params);
};