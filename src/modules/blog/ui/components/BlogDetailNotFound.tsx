import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Home, Search } from "lucide-react";

export default function BlogDetailNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="container max-w-2xl mx-auto px-4 text-center">
        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 mb-8">
            <Search className="h-12 w-12 text-red-600" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            مقاله مورد نظر یافت نشد
          </h1>
          
          <p className="text-gray-600 text-lg mb-8">
            متأسفانه مقاله‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/blog">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6">
              <Search className="h-5 w-5 ml-2" />
              مشاهده مقالات
            </Button>
          </Link>
          
          <Link href="/">
            <Button variant="outline" className="px-8 py-6">
              <Home className="h-5 w-5 ml-2" />
              بازگشت به صفحه اصلی
            </Button>
          </Link>
        </div>

        <div className="mt-16 p-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            پیشنهاد می‌کنیم:
          </h3>
          <ul className="text-gray-700 text-lg space-y-2">
            <li>✓ از دکمه «بازگشت به مقالات» استفاده کنید</li>
            <li>✓ آدرس مقاله را دوباره چک کنید</li>
            <li>✓ از منوی سایت مقالات جدید را ببینید</li>
          </ul>
        </div>
      </div>
    </div>
  );
}