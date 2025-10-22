import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { publicRoutes } from "./publicRoutes";
import { privateRoutes } from "./privateRoutes";

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">Đang tải...</div>
);

export const AppRouter = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Routes>
      {publicRoutes.map((route, idx) => (
        <Route key={idx} path={route.path} element={route.element} />
      ))}
      {privateRoutes.map((route, idx) => (
        <Route key={`private-${idx}`} path={route.path} element={route.element} />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
);

export default AppRouter;
