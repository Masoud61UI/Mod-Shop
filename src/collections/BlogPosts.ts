import type { CollectionConfig } from "payload";
import { isSuperAdmin } from "@/src/lib/access";

export const BlogPosts: CollectionConfig = {
  slug: "blog-posts",
  access: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    update: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "status", "publishedAt", "createdAt"],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "عنوان مقاله",
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      label: "اسلاگ (آدرس مقاله)",
    },
    {
      name: "excerpt",
      type: "textarea",
      label: "چکیده مقاله",
      maxLength: 200,
    },
    {
      name: "contentBlocks",
      type: "array",
      label: "بلوک‌های محتوا",
      minRows: 1,
      fields: [
        {
          name: "type",
          type: "select",
          options: [
            { label: "متن", value: "text" },
            { label: "تصویر", value: "image" },
            { label: "ویدیو", value: "video" },
            { label: "گالری", value: "gallery" },
            { label: "نقل قول", value: "quote" },
            { label: "عنوان", value: "heading" },
          ],
          defaultValue: "text",
          label: "نوع بلوک",
        },
        {
          name: "title",
          type: "text",
          label: "عنوان بخش",
          admin: {
            condition: (_, siblingData) => siblingData?.type === "heading",
          },
        },
        {
          name: "headingLevel",
          type: "select",
          options: [
            { label: "عنوان اصلی (H2)", value: "h2" },
            { label: "عنوان فرعی (H3)", value: "h3" },
            { label: "عنوان کوچک (H4)", value: "h4" },
          ],
          defaultValue: "h2",
          label: "سطح عنوان",
          admin: {
            condition: (_, siblingData) => siblingData?.type === "heading",
          },
        },
        {
          name: "textContent",
          type: "richText",
          label: "محتوی متنی",
          admin: {
            condition: (_, siblingData) => siblingData?.type === "text",
          },
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          label: "تصویر",
          admin: {
            condition: (_, siblingData) =>
              siblingData?.type === "image" || siblingData?.type === "gallery",
          },
        },
        {
          name: "gallery",
          type: "array",
          label: "گالری تصاویر",
          fields: [
            {
              name: "image",
              type: "upload",
              relationTo: "media",
              label: "تصویر",
            },
            {
              name: "caption",
              type: "text",
              label: "توضیح تصویر",
            },
          ],
          admin: {
            condition: (_, siblingData) => siblingData?.type === "gallery",
          },
        },
        {
          name: "videoUrl",
          type: "text",
          label: "لینک ویدیو (YouTube/Vimeo)",
          admin: {
            condition: (_, siblingData) => siblingData?.type === "video",
          },
        },
        {
          name: "quote",
          type: "textarea",
          label: "متن نقل قول",
          admin: {
            condition: (_, siblingData) => siblingData?.type === "quote",
          },
        },
        {
          name: "quoteAuthor",
          type: "text",
          label: "نویسنده نقل قول",
          admin: {
            condition: (_, siblingData) => siblingData?.type === "quote",
          },
        },
        {
          name: "alignment",
          type: "select",
          options: [
            { label: "چپ", value: "left" },
            { label: "مرکز", value: "center" },
            { label: "راست", value: "right" },
          ],
          defaultValue: "center",
          label: "تراز",
          admin: {
            condition: (_, siblingData) =>
              siblingData?.type === "image" || siblingData?.type === "quote",
          },
        },
      ],
    },
    {
      name: "featuredImage",
      type: "upload",
      relationTo: "media",
      label: "تصویر شاخص",
      required: true,
    },
    {
      name: "tags",
      type: "select",
      hasMany: true,
      label: "برچسب‌ها",
      options: [
        { label: "ترندهای فصلی", value: "seasonal-trends" },
        { label: "استایل‌سازی", value: "styling" },
        { label: "مراقبت از لباس", value: "clothing-care" },
        { label: "تخفیف‌ها", value: "discounts" },
        { label: "اخبار", value: "news" },
      ],
    },
    {
      name: "readingTime",
      type: "number",
      label: "زمان مطالعه (دقیقه)",
      defaultValue: 5,
      min: 1,
    },
    {
      name: "status",
      type: "select",
      options: [
        { label: "پیش‌نویس", value: "draft" },
        { label: "در انتظار تایید", value: "pending" },
        { label: "منتشر شده", value: "published" },
        { label: "آرشیو", value: "archived" },
      ],
      defaultValue: "draft",
      label: "وضعیت",
    },
    {
      name: "publishedAt",
      type: "date",
      label: "تاریخ انتشار",
      admin: {
        date: {
          pickerAppearance: "dayOnly",
        },
      },
    },
    {
      name: "views",
      type: "number",
      label: "تعداد بازدید",
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "featured",
      type: "checkbox",
      label: "مقاله ویژه",
      defaultValue: false,
    },
  ],
};
