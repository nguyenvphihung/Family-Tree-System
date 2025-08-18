import { RouteObject } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import About from "../pages/About";
import FamilyTreeDemo from "../pages/FamilyTreeDemo";

export const publicRoutes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/about", element: <About /> },
  { path: "/family-tree-demo", element: <FamilyTreeDemo /> },
];

export default publicRoutes;
