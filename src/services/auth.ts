import { logoutUser } from "./api";

// بيسجّل الخروج فعليًا من السيرفر (يلغي الـ refreshToken) قبل ما يمسح
// بيانات الجلسة المحلية. لو الطلب فشل (مثلاً الشبكة واقعة) بنمسح المحلي
// برضه عشان المستخدم يقدر يخرج على أي حال.
export async function logout() {
  const refreshToken = localStorage.getItem("refreshToken");
  try {
    if (refreshToken) {
      await logoutUser(refreshToken);
    }
  } catch {
    // تجاهل: حتى لو فشل الطلب، نكمل ونمسح الجلسة المحلية
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("admin");
  }
}
