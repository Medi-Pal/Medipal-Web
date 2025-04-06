"use client";
import { createContext, useContext } from "react";

// Create a context to share the search query across components
export const SearchContext = createContext({
  searchQuery: '',
  setSearchQuery: (query: string) => { },
});

export function useSearch() {
  return useContext(SearchContext);
} 