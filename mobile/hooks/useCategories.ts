import { useQuery } from "@tanstack/react-query";
import { createApiClient, bookApi, categoryApi } from "../utils/api";
import { Book, Category } from "@/types";


export function useCategories() {
  const api = createApiClient();

  return useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: () => categoryApi.getCategories(api).then(res => res.data).then(res=>{return Object.values(res.data)}),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCategoryById(id: string) {
  const api = createApiClient();
  return useQuery<Book[], Error>({
    queryKey: ["category", id],
    queryFn: () => categoryApi.getBooksByCategory(api, id).then(res => res.data).then(res=>{return Object.values(res.data)}),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}
