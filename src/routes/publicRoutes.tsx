import { RouteObject } from "react-router-dom";
import Login from "../pages/Login";

import Home from "../pages/Home";
import About from "../pages/About";
import OnboardingDemo from "../pages/OnboardingDemo";
import Events from "../pages/Events";

export const publicRoutes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },

  { path: "/about", element: <About /> },
  { path: "/onboarding-demo", element: <OnboardingDemo /> },
  { path: "/events", element: <Events /> },
];

export default publicRoutes;
