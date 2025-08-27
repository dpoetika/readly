import { useQuery } from "@tanstack/react-query";
import { createApiClient, bookApi } from "../utils/api";
import { Book } from "@/types";


export function useBooks() {
  const api = createApiClient();

  return useQuery<Book[], Error>({
    queryKey: ["books"],
    queryFn: () => bookApi.getBooks(api).then(res => res.data).then(res=>{return Object.values(res.data)}),
    staleTime: 1000 * 60 * 5,
  });
}

// 🔍 Kitap arama
export function useSearchBooks(query: string) {
  const api = createApiClient();
  return useQuery<Book[], Error>({
    queryKey: ["books", "search", query],
    queryFn: () => bookApi.searchBooks(api, query).then(res => res.data).then(res=>{return Object.values(res.data)}),
    enabled: false,
    staleTime: 1000 * 60 * 5,
  });
}

// 📖 ID ile kitap
export function useBookById(id: string) {
  const api = createApiClient();

  return useQuery({
    queryKey: ["books", id],
    queryFn: () => bookApi.getBookById(api, id).then(res => res.data),
    enabled: !!id, // id yoksa çalışmaz
    staleTime: 1000 * 60 * 5,
  });
}
