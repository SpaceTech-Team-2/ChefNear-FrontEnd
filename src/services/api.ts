import axios from "axios";

const API_BASE_URL = "https://chefnear.runasp.net/api";

type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

const fetchingApi = async (
  method: HttpMethod,
  endpoint: string,
  data: any = null
) => {
  try {
    const response =
      method === "get"
        ? await axios.get(`${API_BASE_URL}/${endpoint}`)
        : await axios[method](`${API_BASE_URL}/${endpoint}`, data);

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

export const getCategories = async () => {
  return fetchingApi("get", "v1/Categories");
};

export interface GetDishesParams {
  Search?: string;
  CategoryId?: string;
  MaxPrice?: number;
  PageNumber?: number;
  PageSize?: number;
}

export const getDishes = async (params: GetDishesParams = {}) => {
  const query = new URLSearchParams(
    Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null && value !== "")
      .map(([key, value]) => [key, String(value)])
  ).toString();

  return fetchingApi("get", `v1/Dishes${query ? `?${query}` : ""}`);
};