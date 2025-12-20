import { MessageCircle, FileQuestion } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="bg-gradient-to-r from-amber-50 to-purple-50 py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-sm mb-6">
          <FileQuestion className="h-8 w-8 text-purple-600" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          <span className="text-purple-600">سوالی</span>
          <span className="text-amber-500"> دارید؟</span>
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          اگر در مورد قوانین، شرایط استفاده یا هر موضوع دیگری نیاز به توضیح بیشتر دارید، 
          تیم پشتیبانی ما آماده پاسخگویی به شماست.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/contact">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 h-12 text-base font-medium cursor-pointer gap-2">
              <MessageCircle className="h-5 w-5" />
              تماس با پشتیبانی
            </Button>
          </Link>
          <Link href="/faq">
            <Button
              variant="outline"
              className="border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-400 px-8 h-12 text-base font-medium cursor-pointer gap-2"
            >
              <FileQuestion className="h-5 w-5" />
              سوالات متداول
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}