// الـ backend حالياً معندوش endpoint لتفضيلات المستخدم (الغذائية أو
// المطبخية)، فبنخزنها محليًا (localStorage) وبتتطبق فورًا من غير ما تحتاج
// اتصال بالسيرفر. الملف ده مشترك بين صفحة "تفضيلاتك" وصفحة "التخصصات"
// عشان الاتنين يقروا/يكتبوا في نفس المكان.
export const PREFERENCES_STORAGE_KEY = "chefnear:preferences";

export interface LocalPreferences {
  dietary: string[];
  specialties: string[];
  notifyOrderUpdates: boolean;
  notifyOffers: boolean;
  searchRadiusKm: number;
}

export const defaultPreferences: LocalPreferences = {
  dietary: [],
  specialties: [],
  notifyOrderUpdates: true,
  notifyOffers: false,
  searchRadiusKm: 10,
};

export function loadPreferences(): LocalPreferences {
  try {
    const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (!raw) return defaultPreferences;
    return { ...defaultPreferences, ...JSON.parse(raw) };
  } catch {
    return defaultPreferences;
  }
}

export function savePreferences(prefs: LocalPreferences) {
  localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(prefs));
}
