import type { CollectionConfig, AccessArgs } from "payload";

export const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "orderNumber",
    defaultColumns: ["orderNumber", "status", "total", "createdAt"],
  },
  access: {
    read: ({ req: { user } }: AccessArgs<any>) => {
      if (!user) return false;

      const userRoles = (user as any).roles;
      const hasRoles = userRoles && Array.isArray(userRoles);

      if (hasRoles && userRoles.includes("super-admin")) {
        return true;
      }

      if (user.id) {
        return {
          "customer.user": {
            equals: user.id,
          },
        };
      }

      return false;
    },

    create: ({ req: { user } }: AccessArgs<any>) => {
      return !!user;
    },

    update: ({ req: { user } }: AccessArgs<any>) => {
      if (!user) return false;

      const userRoles = (user as any).roles;
      const hasRoles = userRoles && Array.isArray(userRoles);

      return hasRoles && userRoles.includes("super-admin");
    },

    delete: ({ req: { user } }: AccessArgs<any>) => {
      if (!user) return false;

      const userRoles = (user as any).roles;
      const hasRoles = userRoles && Array.isArray(userRoles);

      return hasRoles && userRoles.includes("super-admin");
    },
  },
  fields: [
    {
      name: "orderNumber",
      type: "text",
      required: true,
      unique: true,
      label: "شماره سفارش",
      defaultValue: () =>
        `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
    },
    {
      name: "status",
      type: "select",
      required: true,
      label: "وضعیت سفارش",
      options: [
        { label: "در انتظار پرداخت", value: "pending" },
        { label: "پرداخت شده", value: "paid" },
        { label: "در حال پردازش", value: "processing" },
        { label: "آماده ارسال", value: "ready_to_ship" },
        { label: "ارسال شده", value: "shipped" },
        { label: "تحویل داده شده", value: "delivered" },
        { label: "لغو شده", value: "cancelled" },
        { label: "مرجوع شده", value: "refunded" },
      ],
      defaultValue: "pending",
    },
    {
      name: "customer",
      type: "group",
      label: "اطلاعات مشتری",
      fields: [
        {
          name: "user",
          type: "relationship",
          relationTo: "users",
          label: "کاربر",
        },
        {
          name: "fullName",
          type: "text",
          required: true,
          label: "نام و نام خانوادگی",
        },
        {
          name: "phone",
          type: "text",
          required: true,
          label: "تلفن همراه",
        },
        {
          name: "email",
          type: "email",
          label: "ایمیل",
        },
        {
          name: "address",
          type: "textarea",
          required: true,
          label: "آدرس کامل",
        },
        {
          name: "city",
          type: "text",
          required: true,
          label: "شهر",
        },
        {
          name: "postalCode",
          type: "text",
          required: true,
          label: "کد پستی",
        },
        {
          name: "notes",
          type: "textarea",
          label: "یادداشت مشتری",
        },
      ],
    },
    {
      name: "items",
      type: "array",
      label: "آیتم‌های سفارش",
      required: true,
      minRows: 1,
      fields: [
        {
          name: "product",
          type: "relationship",
          relationTo: "products",
          required: true,
          label: "محصول",
        },
        {
          name: "productName",
          type: "text",
          required: true,
          label: "نام محصول",
        },
        {
          name: "variant",
          type: "group",
          label: "ویژگی‌های انتخابی",
          fields: [
            {
              name: "colorName",
              type: "text",
              label: "رنگ",
            },
            {
              name: "size",
              type: "text",
              label: "سایز",
            },
            {
              name: "sku",
              type: "text",
              label: "SKU ترکیبی",
            },
          ],
        },
        {
          name: "quantity",
          type: "number",
          required: true,
          min: 1,
          label: "تعداد",
        },
        {
          name: "unitPrice",
          type: "number",
          required: true,
          label: "قیمت واحد (تومان)",
        },
        {
          name: "totalPrice",
          type: "number",
          required: true,
          label: "قیمت کل (تومان)",
        },
      ],
    },
    {
      name: "pricing",
      type: "group",
      label: "محاسبات مالی",
      fields: [
        {
          name: "subtotal",
          type: "number",
          required: true,
          label: "مجموع قیمت محصولات (تومان)",
        },
        {
          name: "shippingCost",
          type: "number",
          required: true,
          defaultValue: 0,
          label: "هزینه ارسال (تومان)",
          admin: {
            description: "هزینه ارسال از CMS دریافت می‌شود",
          },
        },
        {
          name: "discount",
          type: "number",
          defaultValue: 0,
          label: "تخفیف (تومان)",
        },
        {
          name: "total",
          type: "number",
          required: true,
          label: "مبلغ نهایی (تومان)",
          admin: {
            description: "محاسبه خودکار: (جمع محصولات + هزینه ارسال) - تخفیف",
          },
        },
      ],
    },
    {
      name: "shipping",
      type: "group",
      label: "اطلاعات ارسال",
      fields: [
        {
          name: "method",
          type: "text",
          label: "روش ارسال",
        },
        {
          name: "trackingNumber",
          type: "text",
          label: "شماره پیگیری",
        },
        {
          name: "estimatedDelivery",
          type: "date",
          label: "تاریخ تحویل تخمینی",
        },
      ],
    },
    {
      name: "payment",
      type: "group",
      label: "اطلاعات پرداخت",
      fields: [
        {
          name: "method",
          type: "select",
          options: [
            { label: "زرین‌پال", value: "zarinpal" },
            { label: "درگاه بانکی", value: "bank" },
            { label: "پرداخت در محل", value: "cod" },
          ],
          defaultValue: "zarinpal",
          required: true,
          label: "روش پرداخت",
        },
        {
          name: "transactionId",
          type: "text",
          label: "شناسه تراکنش زرین‌پال",
          admin: {
            description: "شناسه تراکنش دریافتی از زرین‌پال",
          },
        },
        {
          name: "refId",
          type: "text",
          label: "کد مرجع (Ref ID)",
          admin: {
            description: "کد مرجع پرداخت برای پیگیری",
          },
        },
        {
          name: "paymentDate",
          type: "date",
          label: "تاریخ پرداخت",
        },
        {
          name: "paymentStatus",
          type: "select",
          options: [
            { label: "در انتظار پرداخت", value: "pending" },
            { label: "پرداخت موفق", value: "success" },
            { label: "پرداخت ناموفق", value: "failed" },
            { label: "لغو شده", value: "cancelled" },
            { label: "برگشت خورده", value: "refunded" },
          ],
          defaultValue: "pending",
          label: "وضعیت پرداخت",
        },
      ],
    },
    {
      name: "metadata",
      type: "group",
      label: "اطلاعات اضافی",
      fields: [
        {
          name: "ip",
          type: "text",
          label: "آی‌پی کاربر",
        },
        {
          name: "userAgent",
          type: "text",
          label: "مرورگر کاربر",
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === "create") {
          if (req.user && !data.customer?.user) {
            data.customer = {
              ...data.customer,
              user: req.user.id,
            };
          }

          if (data.items && Array.isArray(data.items)) {
            const subtotal = data.items.reduce(
              (sum: number, item: any) => sum + (item.totalPrice || 0),
              0
            );

            data.pricing = {
              ...data.pricing,
              subtotal,
              total:
                subtotal +
                (data.pricing?.shippingCost || 0) -
                (data.pricing?.discount || 0),
            };
          }

          if (req.headers) {
            const headers = req.headers as any;

            const userAgent = headers["user-agent"] || "";
            let deviceType = "desktop";

            if (/mobile|android|iphone/i.test(userAgent)) {
              deviceType = "mobile";
            } else if (/tablet|ipad/i.test(userAgent)) {
              deviceType = "tablet";
            }

            data.metadata = {
              ...data.metadata,
              ip: headers["x-forwarded-for"] || "",
              userAgent: userAgent,
              deviceType,
            };
          }
        }

        return data;
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === "create") {
          try {
            const { payload } = req;

            for (const item of doc.items) {
              const product = await payload.findByID({
                collection: "products",
                id: item.product,
              });

              if (product.inventory && Array.isArray(product.inventory)) {
                const updatedInventory = product.inventory.map(
                  (invItem: any) => {
                    if (
                      invItem.colorName === item.variant?.colorName &&
                      invItem.size === item.variant?.size
                    ) {
                      return {
                        ...invItem,
                        stock: Math.max(
                          0,
                          (invItem.stock || 0) - item.quantity
                        ),
                      };
                    }
                    return invItem;
                  }
                );

                await payload.update({
                  collection: "products",
                  id: item.product,
                  data: {
                    inventory: updatedInventory,
                  },
                });
              }

              await payload.update({
                collection: "products",
                id: item.product,
                data: {
                  salesCount: (product.salesCount || 0) + item.quantity,
                },
              });
            }
          } catch (error) {
            console.error("Error updating inventory and sales count:", error);
          }
        }
      },
    ],
  },
  timestamps: true,
};
