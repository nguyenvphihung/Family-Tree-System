import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { useAuthStore } from "../store";
import MainLayout from "../components/Layout/MainLayout";
import { publicRoutes } from "./publicRoutes";
import { privateRoutes } from "./privateRoutes";

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirect if authenticated)
interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Main App Router
export const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public routes */}
        {publicRoutes.map((route, index) => {
          const isAuthRoute = [
            "/login",
            "/register",
            "/forgot-password",
            "/reset-password",
          ].includes(route.path || "");

          return (
            <Route
              key={index}
              path={route.path}
              element={
                isAuthRoute ? (
                  <PublicRoute>{route.element}</PublicRoute>
                ) : (
                  <MainLayout>{route.element}</MainLayout>
                )
              }
            />
          );
        })}

        {/* Private routes */}
        {privateRoutes.map((route, index) => (
          <Route
            key={`private-${index}`}
            path={route.path}
            element={
              <ProtectedRoute>
                <MainLayout>{route.element}</MainLayout>
              </ProtectedRoute>
            }
          />
        ))}

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
