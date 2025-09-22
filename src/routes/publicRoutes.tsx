import { RouteObject } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import About from "../pages/About";
import FamilyTreeDemo from "../pages/FamilyTreeDemo/FamiLyTreeDemo";
import Register from "../pages/Register/index"; // Thử import rõ ràng hơn
import UserDetail from "../pages/Userdetail";
import Dashboard from "../pages/Dashboard";
import EventsPage from "../pages/Events";
import PhotosPage from "../pages/Photos";
import DocumentsPage from "../pages/Documents";
import StoriesPage from "../pages/Stories";
import MembersPage from "../pages/Members";
import Logout from "@/pages/Logout/Logout";
import SnapshotEditor from "@/pages/SnapshotEditor";

export const publicRoutes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/about", element: <About /> },
  { path: "/family-tree-demo", element: <FamilyTreeDemo /> },
  { path: "/user-detail", element: <UserDetail /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/events", element: <EventsPage /> },
  { path: "/photos", element: <PhotosPage /> },
  { path: "/documents", element: <DocumentsPage /> },
  { path: "/stories", element: <StoriesPage /> },
  { path: "/members", element: <MembersPage /> },
  { path: "/logout", element: <Logout /> },
  { path: "/snapshot-editor", element: <SnapshotEditor /> },
];

export default publicRoutes;
