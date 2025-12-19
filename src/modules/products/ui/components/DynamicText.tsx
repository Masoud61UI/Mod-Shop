import { useState, useEffect } from "react";

export default function DynamicText() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const texts = [
      {
        icon: "⭐",
        text: "بهترین قیمت در ۳۰ روز گذشته",
        color: "text-amber-500",
      },
      {
        icon: "👁️",
        text: "بیش از ۳۰۰ بازدید در هفت روز گذشته",
        color: "text-blue-500",
      },
      {
        icon: "✓",
        text: "گارانتی اصالت و سلامت فیزیکی کالا",
        color: "text-green-500",
      },
    ];

    const timer = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % texts.length);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const texts = [
    {
      icon: "⭐",
      text: "بهترین قیمت در ۳۰ روز گذشته",
      color: "text-amber-500",
    },
    {
      icon: "👁️",
      text: "بیش از ۳۰۰ بازدید در هفت روز گذشته",
      color: "text-blue-500",
    },
    {
      icon: "✓",
      text: "گارانتی اصالت و سلامت فیزیکی کالا",
      color: "text-green-500",
    },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
      <div className="relative h-6 overflow-hidden min-w-[250px]">
        {texts.map((item, index) => {
          let transformClass = "";
          if (currentTextIndex === index) {
            transformClass = "translate-y-0 opacity-100";
          } else if (currentTextIndex > index) {
            transformClass = "-translate-y-full opacity-0";
          } else {
            transformClass = "translate-y-full opacity-0";
          }

          return (
            <div
              key={index}
              className={`absolute inset-0 flex items-center gap-1.5 text-[13px] text-gray-600 transition-all duration-500 ${transformClass}`}
            >
              <span className={`text-[15px] ${item.color}`}>{item.icon}</span>
              <span className="whitespace-nowrap">{item.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
