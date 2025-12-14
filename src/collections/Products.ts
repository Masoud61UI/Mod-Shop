import type { CollectionConfig } from "payload";
import { isSuperAdmin } from "../lib/access";

export const Products: CollectionConfig = {
  slug: "products",
  access: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    update: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  admin: {
    useAsTitle: "name",
    hidden: ({ user }) => !isSuperAdmin(user),
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "نام محصول",
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      label: "اسلاگ (آدرس محصول)",
    },
    {
      name: "description",
      type: "textarea",
      label: "توضیحات محصول",
    },

    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      hasMany: false,
      required: true,
      label: "دسته‌بندی اصلی",
    },
    {
      name: "subcategory",
      type: "relationship",
      relationTo: "categories",
      hasMany: false,
      label: "زیردسته‌بندی",
    },

    {
      type: "row",
      fields: [
        {
          name: "price",
          type: "number",
          required: true,
          label: "قیمت اصلی (تومان)",
        },
        {
          name: "discountPrice",
          type: "number",
          label: "قیمت بعد از تخفیف (تومان)",
        },
        {
          name: "discountPercent",
          type: "number",
          label: "درصد تخفیف",
          admin: {
            description: "میتوانید درصد را manually وارد کنید",
          },
        },
      ],
    },

    {
      name: "images",
      type: "array",
      label: "گالری تصاویر",
      minRows: 1,
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          label: "تصویر",
        },
        {
          name: "alt",
          type: "text",
          label: "متن جایگزین تصویر",
        },
      ],
    },

    {
      name: "inventory",
      type: "array",
      label: "موجودی محصول",
      admin: {
        description: "برای هر ترکیب رنگ و سایز، یک ردیف اضافه کنید",
      },
      fields: [
        {
          name: "colorName",
          type: "text",
          label: "نام رنگ",
          required: true,
          admin: {
            placeholder: "مثال: مشکی, سفید, قرمز",
          },
        },
        {
          name: "colorHex",
          type: "text",
          label: "کد رنگ (HEX)",
          admin: {
            placeholder: "مثال: #000000",
            description: "اختیاری - برای نمایش در سایت",
          },
        },
        {
          name: "size",
          type: "text",
          label: "سایز",
          required: true,
          admin: {
            placeholder: "مثال: M, L, XL, 42, 43",
          },
        },
        {
          name: "stock",
          type: "number",
          label: "تعداد موجودی",
          required: true,
          defaultValue: 0,
          min: 0,
        },
        {
          name: "sku",
          type: "text",
          label: "SKU ترکیبی",
          admin: {
            description: "کد محصول برای این ترکیب خاص",
          },
        },
      ],
    },

    {
      name: "sku",
      type: "text",
      required: true,
      unique: true,
      label: "کد محصول اصلی (SKU)",
    },

    {
      name: "refundPolicy",
      type: "select",
      options: [
        {
          label: "۳۰ روز مهلت مرجوعی",
          value: "30-day",
        },
        {
          label: "۱۴ روز مهلت مرجوعی",
          value: "14-day",
        },
        {
          label: "۷ روز مهلت مرجوعی",
          value: "7-day",
        },
        {
          label: "۳ روز مهلت مرجوعی",
          value: "3-day",
        },
        {
          label: "۱ روز مهلت مرجوعی",
          value: "1-day",
        },
        {
          label: "غیرقابل مرجوع",
          value: "no-refunds",
        },
      ],
      defaultValue: "no-refunds",
      label: "سیاست مرجوعی",
    },

    {
      name: "featured",
      type: "checkbox",
      label: "محصول ویژه",
      defaultValue: false,
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data?.inventory && Array.isArray(data.inventory)) {
          data.inventory = data.inventory.map((item: any) => {
            if (!item.sku && item.colorName && item.size) {
              item.sku = `${data.sku}-${item.colorName}-${item.size}`
                .toUpperCase()
                .replace(/\s+/g, "-");
            }
            return item;
          });
        }
        return data;
      },
    ],
  },
};
