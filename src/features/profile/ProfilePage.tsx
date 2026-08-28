import { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  ClipboardList,
  LogOut,
  MapPin,
  Settings2,
  KeyRound,
  Camera,
  Loader2,
} from "lucide-react";
import { getMyProfile, uploadProfileImage } from "../../services/api";
import { logout } from "../../services/auth";

// شكل الرد لسه مش موثّق في الـ swagger (GET /api/v1/profile/me بيرجع "OK" بس من
// غير schema)، فبنتعامل مع الحقول دي بشكل دفاعي (كلها اختيارية) بدل ما نفترض شكل ثابت.
interface Profile {
  id?: string;
  email?: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: string;
  profileImageUrl?: string;
}

interface ApiEnvelope<T> {
  data: T;
  isSuccess: boolean;
  message: string;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, isError } = useQuery<ApiEnvelope<Profile>>({
    queryKey: ["my-profile"],
    queryFn: getMyProfile,
  });

  const profile = data?.data;
  const displayName =
    profile?.displayName ||
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    "مستخدم ChefNear";

  const uploadImageMutation = useMutation({
    mutationFn: (file: File) => uploadProfileImage(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-profile"] }),
  });

  const handleAvatarClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadImageMutation.mutate(file);
    e.target.value = "";
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#FFF9F6] p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-black text-gray-900">الملف الشخصي</h1>

        {isLoading && (
          <div className="bg-white rounded-3xl border border-rose-100/80 shadow-sm p-6 animate-pulse space-y-4">
            <div className="w-20 h-20 rounded-full bg-gray-100" />
            <div className="h-4 w-1/3 bg-gray-100 rounded" />
            <div className="h-3 w-1/2 bg-gray-100 rounded" />
          </div>
        )}

        {isError && (
          <div className="text-center text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-4">
            تعذر تحميل بيانات الملف الشخصي. تأكد إنك مسجل دخول وحاول تاني.
          </div>
        )}

        {!isLoading && !isError && (
          <div className="bg-white rounded-3xl border border-rose-100/80 shadow-sm overflow-hidden">
            <div className="p-6 flex items-center gap-4 border-b border-gray-50">
              <button
                type="button"
                onClick={handleAvatarClick}
                disabled={uploadImageMutation.isPending}
                className="relative w-20 h-20 rounded-full shrink-0 group outline-none"
                title="تغيير الصورة الشخصية"
              >
                {profile?.profileImageUrl ? (
                  <img
                    src={profile.profileImageUrl}
                    alt={displayName}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-amber-700 text-white flex items-center justify-center text-2xl font-black">
                    {displayName.trim().slice(0, 1)}
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  {uploadImageMutation.isPending ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5 text-white" />
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </button>
              <div>
                <h2 className="text-xl font-black text-gray-900">{displayName}</h2>
                {profile?.role && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full mt-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {profile.role}
                  </span>
                )}
              </div>
            </div>

            <div className="p-6 space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{profile?.email || "—"}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Phone className="w-4 h-4 text-gray-400" />
                <span dir="ltr">{profile?.phoneNumber || "—"}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <User className="w-4 h-4 text-gray-400" />
                <span>{profile?.id || "—"}</span>
              </div>
            </div>
          </div>
        )}

        {/* روابط سريعة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/orders"
            className="flex items-center gap-3 bg-white rounded-2xl border border-rose-100/80 shadow-sm p-4 hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm">طلباتي</div>
              <div className="text-xs text-gray-500">تتبع طلباتك السابقة</div>
            </div>
          </Link>

          <Link
            to="/addresses"
            className="flex items-center gap-3 bg-white rounded-2xl border border-rose-100/80 shadow-sm p-4 hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm">العناوين</div>
              <div className="text-xs text-gray-500">إدارة عناوين التوصيل</div>
            </div>
          </Link>

          <Link
            to="/preferences"
            className="flex items-center gap-3 bg-white rounded-2xl border border-rose-100/80 shadow-sm p-4 hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center">
              <Settings2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm">تفضيلاتك</div>
              <div className="text-xs text-gray-500">الأطباق والإشعارات ونطاق البحث</div>
            </div>
          </Link>

          <Link
            to="/change-password"
            className="flex items-center gap-3 bg-white rounded-2xl border border-rose-100/80 shadow-sm p-4 hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm">تغيير كلمة المرور</div>
              <div className="text-xs text-gray-500">حدّثي كلمة مرور حسابك</div>
            </div>
          </Link>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-white border border-red-100 text-red-600 font-bold py-3 rounded-2xl hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
}
