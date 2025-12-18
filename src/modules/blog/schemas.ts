import z from "zod";

export const blogFilterSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(9),
  tag: z.string().optional(),
  search: z.string().optional(),
  featured: z.boolean().optional(),
  sort: z
    .enum(["newest", "oldest", "most-viewed", "featured"])
    .default("newest"),
});

export type BlogFilterData = z.infer<typeof blogFilterSchema>;
