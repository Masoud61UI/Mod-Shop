import Image from "next/image";
import RichTextContent from "./RichTextContent";
import { ContentBlock } from "../../types/blog.types";

interface ContentBlockRendererProps {
  block: ContentBlock;
  index: number;
}

export default function ContentBlockRenderer({
  block,
  index,
}: ContentBlockRendererProps) {
  const isEven = index % 2 === 0;

  switch (block.type) {
    case "text":
      return <TextContentBlock block={block} />;

    case "image":
      return <ImageContentBlock block={block} isEven={isEven} />;

    case "gallery":
      return <GalleryContentBlock block={block} />;

    case "quote":
      return <QuoteContentBlock block={block} isEven={isEven} />;

    case "video":
      return <VideoContentBlock block={block} />;

    default:
      return null;
  }
}

function TextContentBlock({ block }: { block: ContentBlock }) {
  if (block.textContent?.root) {
    return (
      <div className="prose prose-lg max-w-none my-6">
        <RichTextContent content={block.textContent} />
      </div>
    );
  }

  if (block.textContent?.html) {
    return (
      <div className="prose prose-lg max-w-none my-6">
        <div
          className="text-gray-700 leading-relaxed text-justify text-[16px] md:text-[17px]"
          dangerouslySetInnerHTML={{ __html: block.textContent.html }}
        />
      </div>
    );
  }

  return (
    <div className="my-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <p className="text-yellow-800">متن یافت نشد یا ساختار نامشخص</p>
      <pre className="text-xs mt-2">
        {JSON.stringify(block.textContent, null, 2)}
      </pre>
    </div>
  );
}

function ImageContentBlock({
  block,
  isEven,
}: {
  block: ContentBlock;
  isEven: boolean;
}) {
  return (
    <div
      className={`my-10 ${isEven ? "" : "md:mr-auto md:ml-0"}`}
      style={{
        textAlign: block.alignment || "center",
        maxWidth: block.alignment === "center" ? "100%" : "80%",
      }}
    >
      <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg">
        <Image
          src={(block.image?.url as string) || "/blog-placeholder.jpg"}
          alt=""
          fill
          className="object-cover"
        />
      </div>
      {block.image?.caption && (
        <p className="text-sm text-gray-500 mt-3 text-center italic">
          {block.image.caption}
        </p>
      )}
    </div>
  );
}

function GalleryContentBlock({ block }: { block: ContentBlock }) {
  return (
    <div className="my-12">
      <div
        className={`grid grid-cols-1 md:grid-cols-${Math.min(block.gallery?.length || 2, 3)} gap-4`}
      >
        {block.gallery?.map((item, idx) => (
          <div
            key={idx}
            className="relative aspect-square rounded-xl overflow-hidden"
          >
            <Image
              src={(item.image?.url as string) || "/blog-placeholder.jpg"}
              alt={item.caption || ""}
              fill
              className="object-cover"
            />
            {item.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white text-sm">{item.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function QuoteContentBlock({
  block,
  isEven,
}: {
  block: ContentBlock;
  isEven: boolean;
}) {
  return (
    <div className="my-12">
      <div
        className={`bg-gradient-to-r from-purple-50 to-pink-50 border-r-4 border-purple-500 p-8 rounded-2xl ${isEven ? "" : "md:mr-auto md:ml-0"}`}
        style={{ maxWidth: block.alignment === "center" ? "100%" : "80%" }}
      >
        <blockquote className="text-2xl md:text-3xl font-medium text-gray-800 leading-relaxed italic mb-4">
          "{block.quote}"
        </blockquote>
        {block.quoteAuthor && (
          <cite className="text-lg font-semibold text-purple-600 not-italic">
            — {block.quoteAuthor}
          </cite>
        )}
      </div>
    </div>
  );
}

function VideoContentBlock({ block }: { block: ContentBlock }) {
  return (
    <div className="my-12">
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-black">
        <iframe
          src={block.videoUrl}
          className="absolute inset-0 w-full h-full"
          allowFullScreen
          title="ویدیو مقاله"
        />
      </div>
    </div>
  );
}
