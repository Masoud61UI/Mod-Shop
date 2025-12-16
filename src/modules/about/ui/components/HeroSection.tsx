import { SparklesIcon, UsersIcon } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="pt-12 pb-4 md:py-18 md:pb-9 lg:pt-24 lg:pb-14 text-center max-w-4xl mx-auto px-4">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-sm font-medium mb-6 cursor-default">
        <SparklesIcon className="h-4 w-4" />
        از ۱۴۰۰ تا امروز
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6 tracking-tight">
        داستان <span className="text-purple-600">مد کالکشن</span>
      </h1>
      <p className="text-base text-gray-600 mb-6 md:mb-8 leading-relaxed">
        در سال <span className="font-semibold text-purple-600">۱۴۰۰</span> با یک
        رویا شروع کردیم:
        <span className="font-medium text-purple-600">
          {" "}
          ایجاد تجربه‌ای متفاوت در خرید پوشاک آنلاین. 
        </span>
        امروز، با افتخار به یکی از معتبرترین پلتفرم‌های مد ایران تبدیل شده‌ایم.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/products">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 h-11 text-sm font-medium cursor-pointer">
            مشاهده محصولات
          </Button>
        </Link>
        <Link href="/contact">
          <Button
            variant="outline"
            className="border-purple-300 text-purple-700 hover:bg-purple-50 hover:text-purple-800 hover:border-purple-400 px-6 h-11 text-sm font-medium cursor-pointer"
          >
            <UsersIcon className="h-4 w-4 ml-1" />
            تماس با ما
          </Button>
        </Link>
      </div>
    </section>
  );
}
