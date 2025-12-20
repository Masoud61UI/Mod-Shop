import { HelpCircle } from "lucide-react";

export default function FaqHeroSection() {
  return (
    <section className="pt-12 pb-12 md:py-18 md:pb-9 lg:pt-24 lg:pb-14 text-center max-w-4xl mx-auto px-4 border-b border-gray-200">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-sm font-medium mb-6 cursor-default">
        <HelpCircle className="h-4 w-4" />
        پاسخ به پرتکرارترین سوالات
      </div>
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6 tracking-tight">
        سوالات <span className="text-purple-600">متداول</span>
        <span> مشتریان</span>
      </h1>
      <p className="text-base text-gray-600 mb-9 md:mb-10 leading-relaxed max-w-2xl mx-auto">
        در این بخش به پرتکرارترین سوالات شما درباره
        <span className="font-semibold text-purple-600">
          {" "}
          خرید، ارسال، بازگشت کالا{" "}
        </span>
        و دیگر خدمات مد کالکشن پاسخ داده‌ایم.
      </p>
      <div className="w-24 h-0.5 bg-gradient-to-r from-purple-600/30 via-purple-600/50 to-purple-600/30 mx-auto rounded-full" />
    </section>
  );
}
