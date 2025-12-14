import type { CollectionConfig } from "payload";
import { isSuperAdmin } from "../lib/access";

export const Reviews: CollectionConfig = {
  slug: "reviews",
  access: {
    read: ({ req }) => isSuperAdmin(req.user),
    create: ({ req }) => isSuperAdmin(req.user),
    update: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "امتیاز", "status", "createdAt"],
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: "عنوان",
      required: true,
    },
    {
      name: "توضیحات",
      type: "textarea",
      required: true,
    },
    {
      name: "امتیاز",
      type: "number",
      required: true,
      min: 1,
      max: 5,
    },
    {
      name: "محصول",
      type: "relationship",
      relationTo: "products",
      hasMany: false,
      required: true,
    },
    {
      name: "کاربر",
      type: "relationship",
      relationTo: "users",
      hasMany: false,
      required: true,
    },
    {
      name: "status",
      type: "select",
      label: "وضعیت",
      options: [
        { label: "در انتظار تایید", value: "pending" },
        { label: "منتشر شده", value: "published" },
        { label: "رد شده", value: "rejected" },
      ],
      defaultValue: "pending",
      required: true,
      admin: {
        position: "sidebar",
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!data.title && data["توضیحات"] && data["امتیاز"]) {
          data.title = `امتیاز ${data["امتیاز"]} ستاره: ${data["توضیحات"].substring(0, 50)}...`;
        }
        return data;
      },
    ],
  },
};
