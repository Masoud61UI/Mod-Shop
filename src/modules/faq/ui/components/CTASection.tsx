import { MessageCircle, Phone } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="bg-gradient-to-r from-purple-50 to-amber-50 py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-sm mb-6">
          <MessageCircle className="h-8 w-8 text-purple-600" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          پاسخ خود را <span className="text-purple-600">نیافتید؟</span>
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          تیم پشتیبانی مد کالکشن آماده پاسخگویی به سوالات شماست. ما در کمترین زمان ممکن پاسخ شما را خواهیم داد.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/contact">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 h-12 text-base font-medium cursor-pointer gap-2">
              <Phone className="h-5 w-5" />
              تماس با پشتیبانی
            </Button>
          </Link>
          <Link href="https://wa.me/989117186181" target="_blank">
            <Button
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-50 hover:text-purple-800 hover:border-purple-400 px-8 h-12 text-base font-medium cursor-pointer gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              پشتیبانی واتساپ
            </Button>
          </Link>
        </div>
        <p className="text-sm text-gray-500 mt-8">
          زمان پاسخگویی:  هر روز هفته، ۹ صبح تا ۹ شب
        </p>
      </div>
    </section>
  );
}