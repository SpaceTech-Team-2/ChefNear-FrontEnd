// الـ backend فيه GET /Orders و GET /Orders/{id} فعليًا (شوف services/api.ts:
// getMyOrders / getOrderById)، لكن شكل الرد لسه مش موثّق رسميًا. عشان نضمن
// تفاصيل كاملة (زي أسماء الأصناف اللي المستخدم شافها وقت الطلب) بنسجل كل طلب
// اتعمل فعليًا محليًا برضه، وبندمج المصدرين في صفحة "طلباتي" — لو الطلب مش
// موجود محليًا (جهاز تاني مثلاً) بنجيب تفاصيله من السيرفر مباشرة.
import type { CartItem } from "./CartContext";

export interface StoredOrder {
  localId: string;
  serverOrderId: string | null;
  createdAt: string;
  items: CartItem[];
  total: number;
  notes?: string;
  paymentGateway: string;
  orderFulfillmentType: string;
  status: "Placed" | "Cancelled";
  cancellationReason?: string;
  rawResponse: any;
}

const ORDERS_STORAGE_KEY = "chefnear_order_history";

function readOrders(): StoredOrder[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeOrders(orders: StoredOrder[]) {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

// بيحاول يلاقي الـ order id من رد السيرفر أيًا كان شكل الاستجابة (الـ endpoint
// معرفش شكل الرد بالظبط في الـ swagger)، وإلا بيرجع null.
function extractServerOrderId(rawResponse: any): string | null {
  const candidates = [
    rawResponse?.data?.id,
    rawResponse?.data?.orderId,
    rawResponse?.id,
    rawResponse?.orderId,
  ];
  const found = candidates.find(
    (v) => typeof v === "string" && v.length > 0
  );
  return found ?? null;
}

export function saveOrder(params: {
  items: CartItem[];
  total: number;
  notes?: string;
  paymentGateway: string;
  orderFulfillmentType: string;
  rawResponse: any;
}): StoredOrder {
  const order: StoredOrder = {
    localId: crypto.randomUUID(),
    serverOrderId: extractServerOrderId(params.rawResponse),
    createdAt: new Date().toISOString(),
    items: params.items,
    total: params.total,
    notes: params.notes,
    paymentGateway: params.paymentGateway,
    orderFulfillmentType: params.orderFulfillmentType,
    status: "Placed",
    rawResponse: params.rawResponse,
  };
  const orders = readOrders();
  orders.unshift(order);
  writeOrders(orders);
  return order;
}

export function getOrders(): StoredOrder[] {
  return readOrders();
}

export function getOrderByLocalId(localId: string): StoredOrder | undefined {
  return readOrders().find((o) => o.localId === localId);
}

export function markOrderCancelled(localId: string, reason?: string) {
  const orders = readOrders();
  const updated = orders.map((o) =>
    o.localId === localId
      ? { ...o, status: "Cancelled" as const, cancellationReason: reason }
      : o
  );
  writeOrders(updated);
}
