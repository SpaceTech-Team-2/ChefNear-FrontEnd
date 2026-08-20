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
  return fetchingApi("get", "v1/Categories");
};

export interface GetDishesParams {
  Search?: string;
  CategoryId?: string;
  MaxPrice?: number;
  ClientLatitude?: number;
  ClientLongitude?: number;
  MaxDistanceKm?: number;
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

export const getDishesID = async (ID: string) => {
  return fetchingApi("get", `v1/Dishes/${ID}`);
};

// ===== Profile (محتاج تسجيل دخول) =====
export const getMyProfile = async () => {
  return fetchingApi("get", "v1/profile/me");
};

// ===== Addresses (محتاج تسجيل دخول) =====
export const getMyAddresses = async () => {
  return fetchingApi("get", "v1/Addresses/my");
};

export interface CreateAddressPayload {
  label?: string;
  city?: string;
  details?: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
}

export const createAddress = async (payload: CreateAddressPayload) => {
  return fetchingApi("post", "v1/Addresses", payload);
};

// ===== Orders (محتاج تسجيل دخول) =====
// ملحوظة: الـ backend حالياً معندوش endpoint لجلب "طلباتي" أو "تفاصيل طلب" (GET) —
// اللي متاح بس هو إنشاء الطلب (checkout) وإجراءات عليه (cancel/accept/...).
// فبنخزن نتيجة كل عملية checkout ناجحة محليًا (localStorage) عشان نقدر نعرض
// "طلباتي" و"تتبع الطلب"، وأي تحديث حالة (زي الإلغاء) بيتم فعليًا عبر الـ API.
export interface OrderItemPayload {
  dishId: string;
  quantity: number;
}

export type PaymentGateway = "Paymob" | "Stripe";
export type OrderFulfillmentType = "Delivery" | "Pickup";

export interface CheckoutPayload {
  idempotencyKey: string;
  items: OrderItemPayload[];
  notes?: string;
  deliveryAddressId?: string;
  paymentGateway: PaymentGateway;
  orderFulfillmentType: OrderFulfillmentType;
}

export const checkoutOrder = async (payload: CheckoutPayload) => {
  return fetchingApi("post", "v1/Orders/checkout", payload);
};

export type CancellationReasonType =
  | "ClientChangedMind"
  | "ClientOrderDelayed"
  | "ClientIncorrectDetails"
  | "ClientOther"
  | "ChefOutofIngredients"
  | "ChefKitchenBusy"
  | "ChefPersonalEmergency"
  | "ChefOther";

export interface CancelOrderPayload {
  reasonType: CancellationReasonType;
  reasonFreeText?: string;
}

export const cancelOrder = async (
  orderId: string,
  payload: CancelOrderPayload
) => {
  return fetchingApi("put", `v1/Orders/${orderId}/cancel`, payload);
};
