import { isSuperAdmin } from "../lib/access";

import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  access: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
    update: ({ req, id }) => {
      if (isSuperAdmin(req.user)) return true;

      return req.user?.id === id;
    },
  },
  admin: {
    useAsTitle: "email",
    hidden: ({ user }) => !isSuperAdmin(user),
  },
  auth: true,
  fields: [
    {
      name: "username",
      required: true,
      unique: true,
      type: "text",
    },
    {
      admin: {
        position: "sidebar",
      },
      name: "roles",
      type: "select",
      defaultValue: "user",
      hasMany: true,
      options: [
        { label: "سوپر ادمین", value: "super-admin" },
        { label: "کاربر عادی", value: "user" },
      ],
      access: {
        update: ({ req }) => isSuperAdmin(req.user),
      },
    },
  ],
};
