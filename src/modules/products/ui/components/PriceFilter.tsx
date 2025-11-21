import { ChangeEvent } from "react";

import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

interface Props {
  minPrice?: string | null;
  maxPrice?: string | null;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
}

export const formatAsCurrency = (value: string) => {
  const numericValue = value.replace(/[^0-9.]/g, "");

  const parts = numericValue.split(".");
  const formattedValue =
    parts[0] + (parts.length > 1 ? "." + parts[1]?.slice(0, 2) : "");

  if (!formattedValue) return "";

  const numberValue = parseFloat(formattedValue);
  if (isNaN(numberValue)) return "";

  return (
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      useGrouping: true,
    }).format(numberValue) + " تومان"
  );
};

export const PriceFilter = ({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
}: Props) => {
  const handleMinPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9.]/g, "");
    onMinPriceChange(numericValue);
  };

  const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9.]/g, "");
    onMaxPriceChange(numericValue);
  };

  return (
    <div className="flex flex-col gap-[22px] pt-2.5">
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-normal text-gray-500">کمترین قیمت</Label>
        <Input
          type="text"
          placeholder="0"
          value={minPrice ? formatAsCurrency(minPrice) : ""}
          onChange={handleMinPriceChange}
          className="bg-white focus-visible:ring-1 
            focus-visible:ring-purple-200 
            focus-visible:ring-offset-0"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-normal text-gray-500 mb-0.5">
          بیشترین قیمت
        </Label>
        <Input
          type="text"
          placeholder="∞"
          value={maxPrice ? formatAsCurrency(maxPrice) : ""}
          onChange={handleMaxPriceChange}
          className="bg-white focus-visible:ring-1 
            focus-visible:ring-purple-200 
            focus-visible:ring-offset-0"
        />
      </div>
    </div>
  );
};
