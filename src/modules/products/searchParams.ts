// در فایل searchParams.ts
import { createLoader, parseAsString, parseAsStringLiteral, parseAsInteger } from "nuqs/server";

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
  page: parseAsInteger
    .withOptions({
      clearOnDefault: true,
    })
    .withDefault(1), // ✅ اضافه شده
};

export const loadProductsFilters = createLoader(params);