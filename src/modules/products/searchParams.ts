import { createLoader, parseAsString, parseAsStringLiteral } from "nuqs/server";

export const sortValues = ["پرفروش‌ترین", "جدیدترین", "قدیمی‌ترین"] as const;

const params = {
  search: parseAsString
    .withOptions({
      clearOnDefault: true,
    })
    .withDefault(""),
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
};

export const loadProductsFilters = createLoader(params);
