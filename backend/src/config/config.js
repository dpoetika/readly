import dotenv from "dotenv";
dotenv.config(); // Sadece burada çağırıyoruz

const config = {
  PORT: process.env.PORT || 3000,
  TOP_URL:process.env.TOP_URL,
  QUERY_URL:process.env.QUERY_URL,
  GET_BOOK_URI:process.env.GET_BOOK_URI,
  GET_CATEGORIES_URI:process.env.GET_CATEGORIES_URI,
  GET_CATEGORY_BOOKS:process.env.GET_CATEGORY_BOOKS,
};

export default config;
