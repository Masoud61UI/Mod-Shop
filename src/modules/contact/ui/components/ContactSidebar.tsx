import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const ContactSidebar = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
    <h2 className="text-lg font-semibold text-gray-800 mb-5">
      راه‌های ارتباطی
    </h2>

    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="bg-amber-50 p-2.5 rounded-lg mt-0.5">
          <Phone className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-700">تلفن پشتیبانی</h3>
          <a
            href="tel:+989117186181"
            className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
          >
            ۰۹۱۱۷۱۸۶۱۸۱
          </a>
          <p className="text-xs text-gray-500 mt-1">
            هر روز هفته، ۹ صبح تا ۹ شب
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="bg-amber-50 p-2.5 rounded-lg mt-0.5">
          <Mail className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-700">ایمیل</h3>
          <a
            href="mailto:mod.store@gmail.com"
            className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
          >
            mod.store@gmail.com
          </a>
          <p className="text-xs text-gray-500 mt-1">
            پاسخگویی در کمتر از ۲۴ ساعت
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="bg-amber-50 p-2.5 rounded-lg mt-0.5">
          <MapPin className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-700">آدرس فروشگاه</h3>
          <p className="text-gray-600 text-sm">
            مازندران، رویان، مجتمع الماس، طبقه ۱
          </p>
          <p className="text-xs text-gray-500 mt-1">
            برای مراجعه حضوری هماهنگی لازم است
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="bg-amber-50 p-2.5 rounded-lg mt-0.5">
          <Clock className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-700">ساعات کاری حضوری</h3>
          <p className="text-gray-600 text-sm">همه روزه: ۹:۰۰ - ۲۰:۰۰</p>
        </div>
      </div>
    </div>
  </div>
);
