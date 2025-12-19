import Image from "next/image";
import { toPersianNumber } from "@/src/lib/utils";

interface ProductImagesProps {
  image: any;
  name: string;
  hasDiscount: boolean;
  discountPercent?: number;
}

export default function ProductImages({
  image,
  name,
  hasDiscount,
  discountPercent,
}: ProductImagesProps) {
  return (
    <>
      <div className="relative aspect-square rounded-xl bg-gray-50 overflow-hidden">
        <Image
          src={image?.url || "/no-image2.png"}
          alt={name}
          fill
          className="object-cover"
          priority
        />
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            ٪{toPersianNumber(discountPercent || 0)} تخفیف
          </div>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="relative w-20 h-20 rounded-lg bg-gray-100 border-2 border-transparent hover:border-purple-400 cursor-pointer flex-shrink-0"
          >
            <Image
              src={image?.url || "/no-image2.png"}
              alt={`${name} - ${item}`}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
    </>
  );
}
