import { Scale, SparklesIcon } from "lucide-react";

export default function TermsHeroSection() {
  return (
    <section className="pt-12 pb-12 md:py-18 md:pb-9 lg:pt-24 lg:pb-14 text-center max-w-4xl mx-auto px-4 border-b border-gray-200">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-sm font-medium mb-6 cursor-default">
        <Scale className="h-4 w-4" />
        آگاهی از حقوق و مسئولیت‌ها
      </div>
      
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6 tracking-tight">
        <span>قوانین و</span>
        <span className="text-purple-600">مقررات</span>
      </h1>
      
      <p className="text-base text-gray-600 mb-8 md:mb-10 leading-relaxed max-w-2xl mx-auto">
        لطفاً قبل از استفاده از وبسایت و خدمات 
        <span className="font-semibold text-purple-600"> مد کالکشن</span>
        ، قوانین و شرایط زیر را به دقت مطالعه کنید.
        این قوانین جهت حفظ حقوق شما و ما تنظیم شده‌اند.
      </p>
      
      <div className="text-sm text-gray-500">
        آخرین بروزرسانی: ۱۵ دی ۱۴۰۴
      </div>
    </section>
  );
}