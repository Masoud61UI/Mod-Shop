import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, Eye } from "lucide-react";
import { toPersianNumber } from "@/src/lib/utils";
import { getTagLabel } from "../../utils/tags";

interface BlogCardProps {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage: any;
  readingTime: number;
  publishedAt: string;
  views: number;
  formattedPublishedAt?: string;
  tags?: string[];
}

export default function BlogCard({
  title,
  slug,
  excerpt,
  featuredImage,
  readingTime,
  publishedAt,
  views,
  formattedPublishedAt,
  tags = [],
}: BlogCardProps) {
  return (
    <Link href={`/blog/${slug}`}>
      <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-purple-200 h-full flex flex-col">
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          <Image
            alt={title}
            fill
            src={featuredImage?.url || "/blog-placeholder.jpg"}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {tags.length > 0 && (
            <div className="absolute top-3 right-3 flex flex-wrap gap-1">
              {tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="bg-white/90 backdrop-blur-sm text-purple-600 px-2 py-1 rounded-full text-xs font-medium"
                >
                  {getTagLabel(tag)}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col gap-4 flex-1">
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-gray-800 line-clamp-2 leading-relaxed group-hover:text-purple-600 transition-colors">
              {title}
            </h2>

            {excerpt && (
              <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                {excerpt}
              </p>
            )}
          </div>

          <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formattedPublishedAt || publishedAt}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{toPersianNumber(readingTime)} دقیقه</span>
                </div>

                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{toPersianNumber(views)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export const BlogCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 h-full flex flex-col animate-pulse">
      <div className="aspect-video bg-gray-200"></div>
      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="space-y-3">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
