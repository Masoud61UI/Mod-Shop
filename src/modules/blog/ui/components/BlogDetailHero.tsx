import Image from "next/image";
import { Calendar, Clock, Eye, Sparkles } from "lucide-react";
import { toPersianNumber } from "@/src/lib/utils";
import { BlogPost } from "../../types/blog.types";
import { getTagLabel } from "../../utils/tags";

interface BlogDetailHeroProps {
  post: BlogPost;
}

export default function BlogDetailHero({ post }: BlogDetailHeroProps) {
  return (
    <div className="mb-8 md:mb-12">
      <div className="relative mb-6 md:mb-8">
        <div className="relative aspect-[4/3] md:aspect-[21/9] rounded-xl md:rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <Image
            src={(post.featuredImage?.url as string) || "/blog-placeholder.jpg"}
            alt={post.title || "مقاله"}
            fill
            className="object-cover transition-opacity duration-300"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {post.featured && (
            <div className="absolute top-3 md:top-4 left-3 md:left-4 z-10">
              <div className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold shadow-lg">
                <Sparkles className="h-3 w-3 md:h-4 md:w-4" />
                ویژه
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-4">
        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="mb-4 md:mb-6">
            <div className="flex flex-nowrap gap-2 overflow-x-auto pb-2 md:flex-wrap justify-center md:overflow-visible">
              {post.tags.map((tag: string) => (
                <span
                  className="inline-flex items-center px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 border border-purple-300 hover:bg-purple-100 transition-colors"
                  key={tag}
                >
                  {getTagLabel(tag)}
                </span>
              ))}
            </div>
          </div>
        )}

        <h1 className="text-[22px] md:text-[28px] lg:text-[34px] font-bold text-gray-800 mb-4 md:mb-6 leading-snug text-center">
          {post.title}
        </h1>

        <div className="hidden md:flex flex-col md:flex-row items-center justify-center gap-4 text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
            <span className="text-sm md:text-[15px]">
              {post.formattedPublishedAt}
            </span>
          </div>

          <div className="hidden md:block text-gray-300">•</div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
            <span className="text-sm md:text-[15px]">
              {toPersianNumber(post.readingTime)} دقیقه مطالعه
            </span>
          </div>

          <div className="hidden md:block text-gray-300">•</div>

          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
            <span className="text-sm md:text-[15px]">
              {toPersianNumber(post.views)} بازدید
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-5 md:hidden">
          <div className="flex flex-col items-center p-2 bg-gray-100 rounded-lg">
            <Calendar className="h-4 w-4 mb-1" />
            <span className="text-xs text-gray-600">تاریخ</span>
            <span className="text-sm font-medium mt-1">
              {post.formattedPublishedAt?.split(" ")[0]}
            </span>
          </div>

          <div className="flex flex-col items-center p-2 bg-gray-100 rounded-lg">
            <Clock className="h-4 w-4 mb-1" />
            <span className="text-xs text-gray-600">زمان</span>
            <span className="text-sm font-medium mt-1">
              {post.readingTime} دقیقه
            </span>
          </div>

          <div className="flex flex-col items-center p-2 bg-gray-100 rounded-lg">
            <Eye className="h-4 w-4 mb-1" />
            <span className="text-xs text-gray-600">بازدید</span>
            <span className="text-sm font-medium mt-1">{post.views}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
