import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = "https://chefnear.runasp.net/api";
const client = axios.create({ baseURL: API_BASE_URL });

// يرفق التوكين (لو المستخدم مسجل دخول) مع كل الطلبات تلقائيًا
client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.set("Authorization", `Bearer ${token}`);
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

export const getCategories = async () => {
  return fetchingApi("get", "v1/Categories");
};

// ===== Categories CRUD (أدمن فقط) =====
export interface CategoryPayload {
  name: string;
  description?: string;
}

export const createCategory = async (payload: CategoryPayload) => {
  return fetchingApi("post", "v1/Categories", payload);
};

export const updateCategory = async (categoryId: string, payload: CategoryPayload) => {
  return fetchingApi("put", `v1/Categories/${categoryId}`, payload);
};

export const deleteCategory = async (categoryId: string) => {
  return fetchingApi("delete", `v1/Categories/${categoryId}`);
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

export const updateAddress = async (
  addressId: string,
  payload: CreateAddressPayload
) => {
  return fetchingApi("put", `v1/Addresses/${addressId}`, payload);
};

export const deleteAddress = async (addressId: string) => {
  return fetchingApi("delete", `v1/Addresses/${addressId}`);
};

// ===== Orders (محتاج تسجيل دخول) =====
export interface GetOrdersParams {
  IsActive?: boolean;
  PageNumber?: number;
  PageSize?: number;
}

// "طلباتي" الحقيقية من السيرفر (بدل الاعتماد على localStorage بس)
export const getMyOrders = async (params: GetOrdersParams = {}) => {
  const query = new URLSearchParams(
    Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null && value !== "")
      .map(([key, value]) => [key, String(value)])
  ).toString();

  return fetchingApi("get", `v1/Orders${query ? `?${query}` : ""}`);
};

export const getOrderById = async (orderId: string) => {
  return fetchingApi("get", `v1/Orders/${orderId}`);
};

// إجراءات دورة حياة الطلب (جانب الشيف)
export const acceptOrder = async (orderId: string) => {
  return fetchingApi("put", `v1/Orders/${orderId}/accept`);
};

export interface StartPreparingPayload {
  estimatedCookingTime: string; // TimeSpan بصيغة "HH:mm:ss"
}

export const startPreparingOrder = async (
  orderId: string,
  payload: StartPreparingPayload
) => {
  return fetchingApi("put", `v1/Orders/${orderId}/start-preparing`, payload);
};

export interface MarkOrderReadyPayload {
  estimatedDeliveryTime: string; // TimeSpan بصيغة "HH:mm:ss"
  deliveryFee: number;
}

export const markOrderReady = async (
  orderId: string,
  payload: MarkOrderReadyPayload
) => {
  return fetchingApi("put", `v1/Orders/${orderId}/mark-as-ready`, payload);
};

export const markOrderDelivered = async (orderId: string) => {
  return fetchingApi("put", `v1/Orders/${orderId}/mark-as-delivered`);
};

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

// ===== Dishes CRUD (جانب الشيف — محتاج تسجيل دخول) =====
export interface IngredientPayload {
  name: string;
  quantity: string;
}

export interface CreateDishPayload {
  categoryId: string;
  name: string;
  description: string;
  price: number;
  quantityAvailable: number;
  allergenInfo?: string;
  imageUrls?: string[];
  ingredients?: IngredientPayload[];
}

export const createDish = async (payload: CreateDishPayload) => {
  return fetchingApi("post", "v1/Dishes", payload);
};

export type DishStatus = "Available" | "Unavailable" | "RemovedByAdmin";

export interface UpdateDishPayload {
  categoryId: string;
  name: string;
  description: string;
  price: number;
  quantityAvailable: number;
  allergenInfo?: string;
  status: DishStatus;
}

export const updateDish = async (dishId: string, payload: UpdateDishPayload) => {
  return fetchingApi("put", `v1/Dishes/${dishId}`, payload);
};

export const deleteDish = async (dishId: string) => {
  return fetchingApi("delete", `v1/Dishes/${dishId}`);
};

// ===== صور الأطباق (DishImage) =====
export const getDishImages = async (dishId: string) => {
  return fetchingApi("get", `v1/DishImage/${dishId}`);
};

// الـ swagger واصف الـ endpoint ده بـ content-type "application/json" بس
// حقوله فيها ملف (File بصيغة binary) وencoding من نوع form — ده تلقائيًا
// يعني إنه لازم يتبعت كـ multipart/form-data فعليًا (حاجة شائعة إن الـ
// Swashbuckle يوصفها غلط للـ [FromForm] endpoints)، فبنستخدم FormData
// وaxios بيظبط الـ Content-Type والـ boundary لوحده.
export const uploadDishImage = async (params: {
  dishId: string;
  file: File;
  isPrimary?: boolean;
}) => {
  const formData = new FormData();
  formData.append("DishId", params.dishId);
  formData.append("File", params.file);
  if (params.isPrimary) formData.append("IsPrimary", "true");
  return fetchingApi("post", "v1/DishImage", formData);
};

export const setPrimaryDishImage = async (imageId: string) => {
  return fetchingApi("put", "v1/DishImage/primary", { imageId });
};

export const deleteDishImage = async (imageId: string) => {
  return fetchingApi("delete", `v1/DishImage/${imageId}`);
};

// ===== مكوّنات الطبق (Ingredients) =====
export const getIngredients = async (dishId: string) => {
  return fetchingApi("get", `v1/Ingredients/${dishId}`);
};

export const addIngredient = async (payload: {
  dishId: string;
  name: string;
  quantity: string;
}) => {
  return fetchingApi("post", "v1/Ingredients", payload);
};

export const updateIngredient = async (payload: {
  ingredientId: string;
  name: string;
  quantity: string;
}) => {
  return fetchingApi("put", "v1/Ingredients", payload);
};

export const deleteIngredient = async (ingredientId: string) => {
  return fetchingApi("delete", `v1/Ingredients/${ingredientId}`);
};

// ===== Reviews (التقييمات الحقيقية) =====
export const getDishReviews = async (
  dishId: string,
  params: { pageNumber?: number; pageSize?: number } = {}
) => {
  const query = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)])
  ).toString();
  return fetchingApi("get", `v1/Review/dish/${dishId}${query ? `?${query}` : ""}`);
};

export const getDishRating = async (dishId: string) => {
  return fetchingApi("get", `v1/Review/dish/${dishId}/rating`);
};

export interface CreateReviewPayload {
  orderId: string;
  dishId: string;
  rating: number;
  comment: string;
}

export const createReview = async (payload: CreateReviewPayload) => {
  return fetchingApi("post", "v1/Review", payload);
};

// ===== Wallet (جانب الشيف) =====
export const getMyWallet = async () => {
  return fetchingApi("get", "v1/Wallets/my-wallet");
};

export type PayoutMethod = "VodafoneCash" | "EtisalatCash" | "OrangeCash" | "BankCard";

export interface WalletWithdrawPayload {
  amount: number;
  payoutMethod: PayoutMethod;
}

export const withdrawFromWallet = async (payload: WalletWithdrawPayload) => {
  return fetchingApi("put", "v1/Wallets/withdraw", payload);
};

// ===== Notifications =====
export const getNotifications = async (
  params: { pageNumber?: number; pageSize?: number } = {}
) => {
  const query = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)])
  ).toString();
  return fetchingApi("get", `v1/Notifications${query ? `?${query}` : ""}`);
};

export const deleteNotification = async (id: string) => {
  return fetchingApi("delete", `v1/Notifications/${id}`);
};

export const clearNotifications = async () => {
  return fetchingApi("delete", "v1/Notifications/clear");
};

// ===== تسجيل الخروج الحقيقي (بيلغي التوكين من السيرفر مش بس من المتصفح) =====
export const logoutUser = async (refreshToken: string) => {
  return fetchingApi("post", "v1/Auth/logout", { refreshToken });
};
