import { Category } from "@/src/payload-types";

export type CustomCategory = Category & {
  subcategories: Category[];
};
