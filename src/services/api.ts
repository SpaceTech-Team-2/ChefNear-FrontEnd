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
  return fetchingApi("get", "Categories");
};