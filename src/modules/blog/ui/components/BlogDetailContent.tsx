import ContentBlockRenderer from "./ContentBlockRenderer";
import { BlogPost } from "../../types/blog.types";

interface BlogDetailContentProps {
  post: BlogPost;
}

export default function BlogDetailContent({ post }: BlogDetailContentProps) {
  const safeContentBlocks = Array.isArray(post.contentBlocks)
    ? post.contentBlocks.filter(
        (block): block is any =>
          block && typeof block === "object" && "type" in block
      )
    : [];

  return (
    <>
      {post.excerpt && (
        <div className="mb-12 p-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-100">
          <h3 className="text-[19px] font-bold text-gray-800 mb-4">
            خلاصه مقاله
          </h3>
          <p className="text-gray-700 text-[17px] leading-relaxed">
            {post.excerpt}
          </p>
        </div>
      )}

      <div className="mb-16">
        {safeContentBlocks.map((block, index) => (
          <div key={index} className="mb-10">
            <ContentBlockRenderer block={block} index={index} />
          </div>
        ))}
      </div>
    </>
  );
}
