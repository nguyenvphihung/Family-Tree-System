import { RouteObject } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import About from "../pages/About";
import FamilyTreeDemo from "../pages/FamilyTreeDemo/FamiLyTreeDemo";
import Register from "../pages/Register/index";


/**
 * Public Routes - Không yêu cầu đăng nhập
 * Các route này có thể truy cập tự do mà không cần authentication
 */
export const publicRoutes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/about", element: <About /> },
  { path: "/family-tree-demo", element: <FamilyTreeDemo /> },
 
];

export default publicRoutes;
