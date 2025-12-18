import { PenToolIcon } from "lucide-react";

export default function BlogHero() {
  return (
    <div className="pt-12 pb-12 md:py-18 md:pb-9 lg:pt-24 lg:pb-14 text-center max-w-4xl mx-auto px-4 border-b border-gray-200 mb-5">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-sm font-medium mb-6 cursor-default">
        <PenToolIcon className="h-4 w-4" />
        نکات و ترندها
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 tracking-tight">
        وبلاگ <span className="text-purple-600">مد کالکشن</span>
      </h1>
      <p className="text-gray-600 mb-9 leading-relaxed max-w-xl mx-auto">
        آخرین مقالات، نکات و داستان‌های دنیای مد از تیم متخصص
        <span className="font-semibold text-purple-600"> مد کالکشن</span>
      </p>
      <div className="w-24 h-0.5 bg-gradient-to-r from-purple-600/30 via-purple-600/50 to-purple-600/30 mx-auto rounded-full" />
    </div>
  );
}
