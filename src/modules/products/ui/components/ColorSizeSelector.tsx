interface InventoryItem {
  colorName: string;
  colorHex?: string;
  size: string;
  stock: number;
  sku: string;
}

interface ColorSizeSelectorProps {
  inventory: InventoryItem[];
  selectedColor: string;
  selectedSize: string;
  setSelectedColor: (color: string) => void;
  setSelectedSize: (size: string) => void;
}

export default function ColorSizeSelector({
  inventory,
  selectedColor,
  selectedSize,
  setSelectedColor,
  setSelectedSize,
}: ColorSizeSelectorProps) {
  const uniqueColors = Array.from(
    new Map(
      inventory.map((item) => [
        item.colorName,
        {
          name: item.colorName,
          hex: item.colorHex || "#cccccc",
        },
      ])
    ).values()
  );

  const getAvailableSizes = (): string[] => {
    if (!selectedColor) {
      return Array.from(
        new Set(
          inventory.filter((item) => item.stock > 0).map((item) => item.size)
        )
      );
    }

    return Array.from(
      new Set(
        inventory
          .filter((item) => item.colorName === selectedColor && item.stock > 0)
          .map((item) => item.size)
      )
    );
  };

  const availableSizes = getAvailableSizes();

  return (
    <>
      <div className="border-t border-gray-100 pt-4">
        <h3 className="text-[17px] font-semibold text-gray-900 mb-3">
          انتخاب رنگ
        </h3>
        <div className="flex flex-wrap gap-3">
          {uniqueColors.map((color) => (
            <button
              key={color.name}
              onClick={() => {
                setSelectedColor(color.name);
                setSelectedSize("");
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all cursor-pointer ${
                selectedColor === color.name
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-sm font-medium">{color.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <h3 className="text-[17px] font-semibold text-gray-900 mb-3">
          انتخاب سایز
        </h3>
        <div className="flex flex-wrap gap-3">
          {availableSizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-4 py-2 rounded-lg border-2 transition-all cursor-pointer ${
                selectedSize === size
                  ? "border-purple-600 bg-purple-50 text-purple-600 font-semibold"
                  : "border-gray-200 hover:border-gray-300 text-gray-700"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
