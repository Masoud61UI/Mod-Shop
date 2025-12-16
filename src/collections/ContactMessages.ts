import type { CollectionConfig } from "payload";

export const ContactMessages: CollectionConfig = {
  slug: "contact-messages",
  admin: {
    useAsTitle: "subject",
    defaultColumns: ["name", "email", "subject", "status", "createdAt"],
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false;
      return req.user.roles?.includes("super-admin") || false;
    },
    create: () => true,
    update: ({ req }) => req.user?.roles?.includes("super-admin") || false,
    delete: ({ req }) => req.user?.roles?.includes("super-admin") || false,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "نام فرستنده",
    },
    {
      name: "email",
      type: "email",
      required: true,
      label: "ایمیل",
    },
    {
      name: "phone",
      type: "text",
      required: true,
      label: "شماره تماس",
    },
    {
      name: "subject",
      type: "select",
      required: true,
      options: [
        { label: "پشتیبانی محصول", value: "product-support" },
        { label: "سوال درباره سفارش", value: "order-question" },
        { label: "همکاری و مشارکت", value: "collaboration" },
        { label: "انتقادات و پیشنهادات", value: "feedback" },
        { label: "سایر", value: "other" },
      ],
      label: "موضوع",
    },
    {
      name: "message",
      type: "textarea",
      required: true,
      label: "پیام",
    },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      options: [
        { label: "جدید", value: "new" },
        { label: "خوانده شده", value: "read" },
        { label: "پاسخ داده شده", value: "replied" },
        { label: "آرشیو", value: "archived" },
      ],
      label: "وضعیت",
    },
    {
      name: "read",
      type: "checkbox",
      defaultValue: false,
      label: "خوانده شده",
    },
    {
      name: "productId",
      type: "relationship",
      relationTo: "products",
      label: "محصول مرتبط",
      admin: {
        condition: (data) => data.subject === "product-support",
      },
    },
    {
      name: "adminNotes",
      type: "textarea",
      label: "یادداشت ادمین",
      admin: {
        condition: () => false,
      },
    },
    {
      name: "repliedAt",
      type: "date",
      label: "تاریخ پاسخ",
      admin: {
        readOnly: true,
      },
    },
    {
      name: "updatedBy",
      type: "relationship",
      relationTo: "users",
      label: "آخرین ویرایش توسط",
      admin: {
        readOnly: true,
      },
    },
  ],
  timestamps: true,
};
