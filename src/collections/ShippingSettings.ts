import type { CollectionConfig } from "payload";

export const ShippingSettings: CollectionConfig = {
  slug: "shipping-settings",
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      defaultValue: "تنظیمات ارسال",
    },
    {
      name: "enabled",
      type: "checkbox",
      label: "فعال بودن هزینه ارسال",
      defaultValue: true,
    },
    {
      name: "baseCost",
      type: "number",
      label: "هزینه پایه ارسال (تومان)",
      required: true,
      defaultValue: 70000,
      min: 0,
    },
    {
      name: "freeThreshold",
      type: "number",
      label: "حداقل مبلغ برای ارسال رایگان (تومان)",
      required: true,
      defaultValue: 1500000,
      min: 0,
    },
    {
      name: "message",
      type: "text",
      label: "پیام نمایشی",
      defaultValue: "خرید بالای ۱,۵۰۰,۰۰۰ تومان رایگان",
    },
  ],
  versions: false,
  access: {
    read: () => true,
    update: () => true,
  },
};