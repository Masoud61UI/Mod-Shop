import { TargetIcon, SparklesIcon, CheckIcon, HeartIcon } from "lucide-react";

export default function MissionVisionSection() {
  return (
    <section className="max-w-4xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl md:rounded-2xl p-5 md:p-6 border border-purple-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-default">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 md:p-3 bg-purple-100 text-purple-600 rounded-lg md:rounded-xl">
              <TargetIcon className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              مأموریت ما
            </h2>
          </div>
          <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-4">
            ایجاد دسترسی آسان به محصولاتی با کیفیت، با قیمت‌های منصفانه و
            تجربه‌ای روان از کشف تا تحویل.
          </p>
          <div className="pt-4 border-t border-purple-100">
            <div className="flex items-center gap-2 text-xs md:text-sm text-purple-600">
              <CheckIcon className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span>کیفیت در تاروپود هر محصول</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl md:rounded-2xl p-5 md:p-6 border border-purple-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-default">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 md:p-3 bg-purple-100 text-purple-600 rounded-lg md:rounded-xl">
              <SparklesIcon className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              چشم‌انداز ما
            </h2>
          </div>
          <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-4">
            تبدیل شدن به مقصد اول خرید آنلاین برای ایرانیان، با تنوعی بی‌نظیر و
            خدماتی فراتر از انتظار.
          </p>
          <div className="pt-4 border-t border-purple-100">
            <div className="flex items-center gap-2 text-xs md:text-sm text-purple-600">
              <HeartIcon className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span>ارائه برترین تجربه خرید آنلاین</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
