import axios, { AxiosInstance } from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "https://readly-alpha.vercel.app";

export const createApiClient = ():AxiosInstance => {
    const api = axios.create({
        baseURL: `${API_BASE_URL}`,
        timeout: 5000,
        headers: {
            "Content-Type": "application/json",
        },
    })

    return api;
};

export const bookApi = {
    getBooks: (api: AxiosInstance) => api.get("/books"),
    searchBooks: (api: AxiosInstance, query: string) => api.get(`/books/search?query=${query}`),
    getBookById: (api: AxiosInstance, id: string) => api.get(`/books/${id}`),
};

export const categoryApi = {
    getCategories: (api: AxiosInstance) => api.get("/categories"),
    getBooksByCategory: (api: AxiosInstance, id: string) => api.get(`/categories/${id}`),
};



