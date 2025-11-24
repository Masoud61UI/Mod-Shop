"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronLeftIcon, Key } from "lucide-react";

import { cn } from "@/src/lib/utils";

import { PriceFilter } from "./PriceFilter";
import { useProductFilters } from "../../hooks/use-product-filters";

interface ProductFilterProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}

const ProductFilter = ({ title, className, children }: ProductFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const Icon = isOpen ? ChevronDownIcon : ChevronLeftIcon;

  return (
    <div className={cn("p-4 border-b flex flex-col gap-2", className)}>
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen((current) => !current)}
      >
        <p className="text-[15px] text-gray-700 font-medium">{title}</p>
        <Icon className="size-4 text-gray-700" />
      </div>
      {isOpen && children}
    </div>
  );
};

export const ProductFilters = () => {
  const [filters, setFilters] = useProductFilters();

  const hasAnyFilters = Object.entries(filters).some(([key, value]) => {
    if (key === "sort") return false;

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    if (typeof value === "string") {
      return value !== "";
    }

    return value !== null;
  });

  const onClear = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
    });
  };

  const onChange = (key: keyof typeof filters, value: unknown) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="border rounded-md bg-gray-50">
      <div className="p-4 border-b flex items-center justify-between">
        <p className="font-medium text-base text-gray-700">فیلترها</p>
        {hasAnyFilters && (
          <button
            type="button"
            className="text-sm underline text-gray-400 cursor-pointer"
            onClick={() => onClear()}
          >
            پاک کردن
          </button>
        )}
      </div>
      <ProductFilter title="قیمت" className="border-b-0">
        <PriceFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onMinPriceChange={(value) => onChange("minPrice", value)}
          onMaxPriceChange={(value) => onChange("maxPrice", value)}
        />
      </ProductFilter>
    </div>
  );
};
