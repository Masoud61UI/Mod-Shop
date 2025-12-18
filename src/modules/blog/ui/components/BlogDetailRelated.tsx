import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { ChevronLeft } from "lucide-react";
import BlogCard from "./BlogCard";
import { BlogPost } from "../../types/blog.types";

interface BlogDetailRelatedProps {
  posts: BlogPost[];
  showAllLink: string;
}

export default function BlogDetailRelated({
  posts,
  showAllLink,
}: BlogDetailRelatedProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">مقالات مرتبط</h2>
        <Link href={showAllLink}>
          <Button
            variant="ghost"
            className="text-purple-600 hover:text-purple-700"
          >
            مشاهده همه
            <ChevronLeft className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <BlogCard
            key={post.id}
            id={post.id}
            title={post.title}
            slug={post.slug}
            excerpt={post.excerpt}
            featuredImage={post.featuredImage}
            readingTime={post.readingTime}
            publishedAt={post.publishedAt || ""}
            views={post.views}
            formattedPublishedAt={post.formattedPublishedAt}
            tags={post.tags}
          />
        ))}
      </div>
    </div>
  );
}
