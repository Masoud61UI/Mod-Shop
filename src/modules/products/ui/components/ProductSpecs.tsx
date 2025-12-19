interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductSpecsProps {
  sku: string;
  category: string | Category;
  subcategory?: string | Category;
}

export default function ProductSpecs({
  sku,
  category,
  subcategory,
}: ProductSpecsProps) {
  const getCategoryName = (): string => {
    if (!category) return "";
    return typeof category === "string" ? category : category.name;
  };

  const getSubcategoryName = (): string => {
    if (!subcategory) return "";
    return typeof subcategory === "string" ? subcategory : subcategory.name;
  };

  return (
    <div className="border-t border-gray-100 pt-4">
      <h3 className="text-[17px] font-semibold text-gray-900 mb-4">
        مشخصات فنی
      </h3>
      <div className="grid grid-cols-1 gap-3">
        <div className="flex justify-between py-2 border-b border-gray-100 text-[15px]">
          <span className="text-gray-500">کد محصول</span>
          <span className="text-gray-900 font-medium">{sku}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100 text-[15px]">
          <span className="text-gray-500">دسته‌بندی</span>
          <span className="text-gray-900 font-medium">{getCategoryName()}</span>
        </div>
        {subcategory && (
          <div className="flex justify-between py-2 border-b border-gray-100 text-[15px]">
            <span className="text-gray-500">زیردسته‌بندی</span>
            <span className="text-gray-900 font-medium">
              {getSubcategoryName()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
