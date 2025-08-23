import { RouteObject } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import About from "../pages/About";
import FamilyTreeDemo from "../pages/FamilyTreeDemo";
import Register from "../pages/Register";
import UserDetail from "../pages/Userdetail";
export const publicRoutes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/about", element: <About /> },
  { path: "/family-tree-demo", element: <FamilyTreeDemo /> },
  { path: "/user-detail", element: <UserDetail /> },
];

export default publicRoutes;
