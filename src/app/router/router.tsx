import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import HomeFeed from '../../features/auth/pages/HomePage';
import { ProtectedRoute } from "./ProtectedRoute"; 
import { GuestRoute } from './GuestRoute';
import {AdminRoute} from './auth/AdminRoute'
import { AdminLayout } from '../../features/auth/pages/admin/AdminLayout';

// Lazy loading للصفحة من مجلد الـ features
const App = lazy(() => import('../../App'));
const LoginPage = lazy(() => import('../../features/auth/pages/LoginPage'));
const Specialties = lazy(() => import('../../features/auth/pages/Specialties'));
const HowItWorks = lazy(() => import('../../features/auth/pages/HowItWorks'));
const HelpCenter = lazy(() => import('../../features/auth/pages/HelpCenter'));
const ReportIssue = lazy(() => import("../../features/auth/pages/ReportIssue"));
const RegistrationPage = lazy(() => import('../../features/auth/pages/RegistrationPage'));

const ChefDashboardLayout = lazy(() => import('../../features/chef-dashboard/ChefDashboardLayout'));
const DashboardOverview = lazy(() => import('../../features/chef-dashboard/pages/DashboardOverview'));
const Order = lazy(() => import("../../features/chef-dashboard/pages/orders"));
const ChefProfilePage = lazy(() => import("../../features/orders/ChefProfilePage"));
const DishDetailsModal = lazy(() => import("../../features/orders/DishDetailsModal"));

const MenuManagement = lazy(
  () => import("../../features/chef-dashboard/pages/menu")
);

const KitchenSettings = lazy(() => import("../../features/chef-dashboard/pages/KitchenSettings"));
const SalesAnalytics = lazy(() => import("../../features/chef-dashboard/pages/SalesAnalytics"));

const ChefsList = lazy(() => import("../../features/discovery/ChefsList"));




export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<div>جاري التحميل...</div>}>
        <App />
      </Suspense>
    ),
    children: [
      {
        element: <GuestRoute />,
        children: [
          // صفحات متاحة فقط للزوار غير المسجلين
          {
            path: "/login",
            element: (
              <Suspense fallback={<div>جاري التحميل...</div>}>
                <LoginPage />
              </Suspense>
            ),
          },
          {
            path: "/register",
            element: (
              <Suspense fallback={<div>جاري التحميل...</div>}>
                <RegistrationPage />
              </Suspense>
            ),
          },
        ],
      },

      {
        index: true,
        element: (
          <Suspense fallback={<div>جاري التحميل...</div>}>
            <HomeFeed />
          </Suspense>
        ),
      },
      {
        path: "/catering",
        element: (
          <Suspense fallback={<div>جاري التحميل...</div>}>
            <HomeFeed />
          </Suspense>
        ),
      },
      {
        path: "/HelpCenter",
        element: (
          <Suspense fallback={<div>جاري التحميل...</div>}>
            <HelpCenter />
          </Suspense>
        ),
      },
      {
        path: "/report-issue",
        element: (
          <Suspense fallback={<div>جاري التحميل...</div>}>
            <ReportIssue />
          </Suspense>
        ),
      },
      {
        path: "/ChefProfilePage",
        element: (
          <Suspense fallback={<div>جاري التحميل...</div>}>
            <ChefProfilePage />
          </Suspense>
        ),
      },
      {
        path: "/specialities",
        element: (
          <Suspense fallback={<div>جاري التحميل...</div>}>
            <Specialties />
          </Suspense>
        ),
      },
      {
        path: "/how-it-works",
        element: (
          <Suspense fallback={<div>جاري التحميل...</div>}>
            <HowItWorks />
          </Suspense>
        ),
      },
      {
        path: "/DishDetailsModal",
        element: (
          <Suspense fallback={<div>جاري التحميل...</div>}>
            <DishDetailsModal />
          </Suspense>
        ),
      },
      {
        path: "/chefs",
        element: (
          <Suspense fallback={<div>جاري التحميل...</div>}>
            <ChefsList />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: (
          <Suspense fallback={<div>جاري التحميل...</div>}>
            <div>الصفحة غير موجودة</div>
          </Suspense>
        ),
      },
    ],
  },

  // المسارات المحمية ( admin لا يمكن دخولها بدون تسجيل دخول )

  {
    element: <AdminRoute />,
    children: [
      {
        path: "/adminDashboard",
        element: (
          <Suspense fallback={<div>جاري التحميل...</div>}>
            <AdminLayout />
          </Suspense>
        ),
      },
    ],
  },

  // المسارات المحمية (لا يمكن دخولها بدون تسجيل دخول)

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/chef",
        element: (
          <Suspense fallback={<div>جاري التحميل...</div>}>
            <ChefDashboardLayout />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<div>جاري التحميل...</div>}>
                <DashboardOverview />
              </Suspense>
            ),
          },
          {
            path: "/chef/orders",
            element: (
              <Suspense fallback={<div>جاري التحميل...</div>}>
                <Order />
              </Suspense>
            ),
          },
          {
            path: "/chef/menu",
            element: (
              <Suspense fallback={<div>جاري التحميل...</div>}>
                <MenuManagement />
              </Suspense>
            ),
          },
          {
            path: "/chef/settings",
            element: (
              <Suspense fallback={<div>جاري التحميل...</div>}>
                <KitchenSettings />
              </Suspense>
            ),
          },
          {
            path: "/chef/analytics",
            element: (
              <Suspense fallback={<div>جاري التحميل...</div>}>
                <SalesAnalytics />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
]);