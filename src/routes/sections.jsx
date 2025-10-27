import { Outlet, useRoutes } from 'react-router-dom';

import { lazy } from 'react';

import DashboardLayout from 'src/layouts/dashboard';
import ResetPasswordNewPage from 'src/pages/passwordNew';

import ProtectedRoute from './ProtectedRoute';

export const HomePage = lazy(() => import('src/pages/app'));
export const MedicationsPage = lazy(() => import('src/pages/medications'));
export const CustomersPage = lazy(() => import('src/pages/customers'));
export const ClaimsPage = lazy(() => import('src/pages/claims'));
export const SettingsPage = lazy(() => import('src/pages/settings'));
export const OrdersPage = lazy(() => import('src/pages/orders'));
export const TestResultPage = lazy(() => import('src/pages/test_results'));
export const WithDrawPage = lazy(() => import('src/pages/Withdraw'));
export const DiscountPage = lazy(() => import('src/pages/discount'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const SignUpPage = lazy(() => import('src/pages/sign-up'));
export const RequestEmail = lazy(() => import('src/pages/requestEmail'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const ErrorPage = lazy(() => import('src/pages/Error'));
export const FaqPage = lazy(() => import('src/pages/faq'))

export default function Router() {
  const routes = useRoutes([
    {
      path: '/',
      element: (
        <ProtectedRoute requiresAuth>
          <DashboardLayout>
            <Outlet />
          </DashboardLayout>
        </ProtectedRoute>
      ),
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'appointments', element: <MedicationsPage /> },
        { path: 'patients', element: <CustomersPage /> },
        { path: 'claims', element: <ClaimsPage /> },
        { path: 'orders', element: <OrdersPage /> },
        { path: 'session', element: <TestResultPage /> },
        { path: 'wallet', element: <WithDrawPage /> },
        { path: 'discounts', element: <DiscountPage /> },
        { path: 'settings', element: <SettingsPage /> },
        {path: 'faq', element: <FaqPage />}
      ],
    },
    {
      path: 'login',
      element: (
        <ProtectedRoute requiresAuth={false}>
          <LoginPage />
        </ProtectedRoute>
      ),
    },
    {
      path: 'sign-up',
      element: (
        <ProtectedRoute requiresAuth={false}>
          <SignUpPage />
        </ProtectedRoute>
      ),
    },
    {
      path: 'reset-password',
      children: [
        {
          path: 'email',
          element: (
            <ProtectedRoute requiresAuth={false}>
              <RequestEmail />
            </ProtectedRoute>
          ),
        },
        {
          path: 'new',
          element: (
            <ProtectedRoute requiresAuth={false}>
              <ResetPasswordNewPage />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: '*',
      element: <Page404 />,
    },
  ]);

  return routes;
}
