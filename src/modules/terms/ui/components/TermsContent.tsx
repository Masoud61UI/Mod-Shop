import {
  CheckCircle,
  AlertCircle,
  Package,
  CreditCard,
  Shield,
  User,
  FileText,
} from "lucide-react";

const termsSections = [
  {
    id: "general",
    title: "مقررات عمومی",
    icon: <FileText className="h-5 w-5 text-purple-600" />,
    items: [
      {
        title: "قبول شرایط",
        content:
          "با استفاده از وبسایت مد کالکشن، شما به طور کامل با کلیه قوانین و مقررات ذکر شده در این صفحه موافقت می‌کنید.",
      },
      {
        title: "تغییر قوانین",
        content:
          "مد کالکشن حق دارد در هر زمان و بدون اطلاع قبلی، قوانین و مقررات را تغییر دهد. تغییرات از زمان انتشار در همین صفحه قابل اجرا خواهند بود.",
      },
      {
        title: "محدودیت سنی",
        content:
          "استفاده از وبسایت برای افراد زیر ۱۸ سال تنها با رضایت و نظارت والدین یا قیم قانونی مجاز است.",
      },
    ],
  },
  {
    id: "purchase",
    title: "شرایط خرید",
    icon: <CreditCard className="h-5 w-5 text-amber-500" />,
    items: [
      {
        title: "تأیید سفارش",
        content:
          "سفارش شما پس از پرداخت موفق و دریافت تأییدیه از درگاه بانکی، قطعی محسوب می‌شود.",
      },
      {
        title: "قیمت‌گذاری",
        content:
          "تمام قیمت‌ها به تومان هستند و شامل مالیات بر ارزش افزوده می‌باشند. قیمت‌ها ممکن است بدون اطلاع قبلی تغییر کنند.",
      },
      {
        title: "موجودی کالا",
        content:
          "در صورت اتمام موجودی یک محصول پس از ثبت سفارش، با شما تماس گرفته می‌شود و می‌توانید کالای جایگزین انتخاب کنید یا مبلغ شما بازگردانده شود.",
      },
    ],
  },
  {
    id: "shipping",
    title: "مقررات ارسال",
    icon: <Package className="h-5 w-5 text-purple-600" />,
    items: [
      {
        title: "زمان و هزینه ارسال",
        content:
          "زمان و هزینه ارسال بر اساس آدرس دریافتی و تعرفه‌های اداره پست محاسبه می‌شود. برای خریدهای بالای ۱,۵۰۰,۰۰۰ تومان ارسال رایگان است.",
      },
      {
        title: "تحویل سفارش",
        content:
          "پس از تحویل سفارش به مامور پست، مسئولیت آن بر عهده شرکت پست خواهد بود. شما می‌توانید با کد رهگیری ارسالی، مرسوله را پیگیری کنید.",
      },
      {
        title: "تأخیر در ارسال",
        content:
          "در صورت تأخیر غیرمعمول در ارسال (بیش از ۷ روز کاری برای تهران و ۱۰ روز کاری برای سایر شهرها)، می‌توانید از طریق پشتیبانی پیگیری نمایید.",
      },
    ],
  },
  {
    id: "return",
    title: "شرایط تعویض",
    icon: <CheckCircle className="h-5 w-5 text-amber-500" />,
    items: [
      {
        title: "مدت زمان تعویض",
        content:
          "محصولات تنها تا ۷ روز پس از دریافت در صورت داشتن برچسب اصلی و عدم استفاده قابل تعویض هستند. بازگشت وجه انجام نمی‌شود.",
      },
      {
        title: "شرایط فیزیکی کالا",
        content:
          "کالای تعویضی باید کاملاً سالم، بدون کوچکترین اثری از استفاده، شستشو یا تغییر باشد و در بسته‌بندی اصلی ارائه شود.",
      },
      {
        title: "هزینه تعویض",
        content:
          "هزینه ارسال برای تعویض در استان مازندران رایگان و برای سایر استان‌ها مطابق تعرفه پست محاسبه می‌شود.",
      },
    ],
  },
  {
    id: "privacy",
    title: "حریم خصوصی",
    icon: <Shield className="h-5 w-5 text-purple-600" />,
    items: [
      {
        title: "حفظ اطلاعات",
        content:
          "ما اطلاعات شخصی شما را محرمانه نگه می‌داریم و آن را در اختیار شخص ثالث قرار نمی‌دهیم، مگر با اجازه شما یا به حکم قانون.",
      },
      {
        title: "اطلاعات پرداخت",
        content:
          "تمامی تراکنش‌های مالی از طریق درگاه‌های امن بانکی انجام می‌شوند و ما هیچ اطلاعات کارت بانکی شما را ذخیره نمی‌کنیم.",
      },
      {
        title: "کوکی‌ها",
        content:
          "وبسایت از کوکی‌ها برای بهبود تجربه کاربری استفاده می‌کند. شما می‌توانید تنظیمات کوکی‌ها را در مرورگر خود تغییر دهید.",
      },
    ],
  },
  {
    id: "responsibility",
    title: "مسئولیت‌ها",
    icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
    items: [
      {
        title: "مسئولیت کاربر",
        content:
          "کاربر موظف است اطلاعات صحیح و کامل در هنگام ثبت‌نام و خرید ارائه دهد. در صورت ارائه اطلاعات نادرست، مسئولیت عواقب آن بر عهده کاربر است.",
      },
      {
        title: "تخلفات",
        content:
          "هرگونه سوءاستفاده از سیستم، خرید با کارت غیرمجاز یا فعالیت متقلبانه منجر به مسدود شدن حساب و پیگرد قانونی خواهد شد.",
      },
      {
        title: "محتوای سایت",
        content:
          "کپی‌برداری از محتوای سایت (متون، تصاویر، طرح‌ها) بدون کسب مجوز کتبی از مد کالکشن ممنوع است.",
      },
    ],
  },
];

export default function TermsContent() {
  return (
    <div className="max-w-4xl mx-auto px-4 pb-16 mt-15">
      <div className="grid md:grid-cols-2 gap-12">
        {termsSections.map((section) => (
          <div key={section.id} id={section.id} className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-amber-50 rounded-lg">{section.icon}</div>
              <h2 className="text-xl font-bold text-gray-900">
                {section.title}
              </h2>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              {section.items.map((item, index) => (
                <div
                  key={index}
                  className="pb-6 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <h3 className="text-gray-800 font-medium mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-purple-50 rounded-2xl border border-purple-100">
        <div className="flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">توجه مهم</h3>
            <p className="text-gray-700">
              در صورت بروز هرگونه اختلاف یا مشکل، اولویت با تصمیم مدیریت مد
              کالکشن است. همچنین مراجع صلاحیت‌دار استان مازندران برای رسیدگی به
              شکایات، صالح خواهند بود.
            </p>
            <p className="text-gray-600 text-sm mt-3">
              برای هرگونه سوال یا ابهام در مورد این قوانین، لطفاً با پشتیبانی
              تماس بگیرید.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
