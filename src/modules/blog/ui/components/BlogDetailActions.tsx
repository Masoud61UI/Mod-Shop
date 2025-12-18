import { Button } from "@/src/components/ui/button";
import { Instagram, MessageCircle, Send, Copy } from "lucide-react";
import { useState } from "react";

interface BlogDetailActionsProps {
  title: string;
}

export default function BlogDetailActions({ title }: BlogDetailActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = encodeURIComponent(`${title} - مد کالکشن\n${url}`);

    const shareUrls = {
      whatsapp: `https://wa.me/?text=${text}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      instagram: `https://www.instagram.com/share?url=${encodeURIComponent(url)}&caption=${encodeURIComponent(title)}`,
    };

    window.open(shareUrls[platform as keyof typeof shareUrls], "_blank");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between mb-8 py-5 px-6 bg-white rounded-xl border border-gray-200">
      <span className="text-sm md:text-base text-gray-600">اشتراک گذاری:</span>

      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare("whatsapp")}
          className="border-green-200 text-green-600 hover:bg-green-50 cursor-pointer text-[13px]"
        >
          <MessageCircle className="h-4 w-4 ml-1" />
          واتس‌اپ
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare("telegram")}
          className="border-blue-200 text-blue-500 hover:bg-blue-50 cursor-pointer text-[13px]"
        >
          <Send className="h-4 w-4 ml-1" />
          تلگرام
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare("instagram")}
          className="border-pink-200 text-pink-600 hover:bg-pink-50 cursor-pointer text-[13px]"
        >
          <Instagram className="h-4 w-4 ml-1" />
          اینستاگرام
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className={`border-gray-200 text-[13px] cursor-pointer ${copied ? "text-green-600" : "text-gray-600"}`}
        >
          <Copy className="h-4 w-4 ml-1" />
          {copied ? "کپی شد" : "کپی لینک"}
        </Button>
      </div>
    </div>
  );
}
