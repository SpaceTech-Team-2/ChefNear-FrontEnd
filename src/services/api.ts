import axios from "axios";

const API_BASE_URL = "https://chefnear.runasp.net/api";

const client = axios.create({ baseURL: API_BASE_URL });

// يرفق التوكين (لو المستخدم مسجل دخول) مع كل الطلبات تلقائيًا
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

const fetchingApi = async (
  method: HttpMethod,
  endpoint: string,
  data: any = null
) => {
  try {
    const response =
      method === "get" || method === "delete"
        ? await client[method](`/${endpoint}`)
        : await client[method](`/${endpoint}`, data);

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const registerUser = (userData: any) => {
  return fetchingApi("post", "v1/Auth/register", userData);
};

export const loginUser = async (userData: any) => {
  return fetchingApi("post", "v1/Auth/login", userData);
};

export const refreshToken = async (userData: any) => {
  return fetchingApi("post", "v1/Auth/refresh-token", userData);
};

export const getCategories = async () => {
  return fetchingApi("get", "Categories");
};

export const getDishes = async (params?: {
  CategoryId?: string;
<<<<<<< HEAD
  MaxPrice?: number;
  ClientLatitude?: number;
  ClientLongitude?: number;
  MaxDistanceKm?: number;
=======
>>>>>>> 33fddb5e784a478661d2518bd2ab1fbd415003be
  PageNumber?: number;
  PageSize?: number;
}) => {
  const query = new URLSearchParams();
  if (params?.CategoryId) query.append("CategoryId", params.CategoryId);
  if (params?.PageNumber) query.append("PageNumber", params.PageNumber.toString());
  if (params?.PageSize) query.append("PageSize", params.PageSize.toString());
  
  const endpoint = query.toString() ? `Dishes?${query.toString()}` : "Dishes";
  return fetchingApi("get", endpoint);
};
