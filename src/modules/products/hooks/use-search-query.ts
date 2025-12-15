"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export const useSearchQuery = () => {
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const initialSearch = searchParams.get("search") || "";
    setSearchValue(initialSearch);
  }, []);

  return [searchValue, setSearchValue] as const;
};
