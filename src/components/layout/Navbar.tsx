import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isfamilytreedemo = location.pathname === '/family-tree-demo';
  return (
    <nav className={isHome ? "fixed inset-x-0 top-0 z-20 bg-transparent" : "bg-[hsl(var(--background))] shadow-lg"}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/familytreedemo" className="flex-shrink-0 flex items-center">

              <span className={isfamilytreedemo ? "ml-2 text-xl font text-slate-100" : "ml-2 text-xl font text-[hsl(var(--foreground))]"}>
                Family Tree
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={isHome ? "text-slate-100/90 hover:text-white px-3 py-2 rounded-md text-sm font-medium" : "text-[hsl(var(--foreground))]/80 hover:text-[hsl(var(--foreground))] px-3 py-2 rounded-md text-sm font-medium"}
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              className={isHome ? "text-slate-100/90 hover:text-white px-3 py-2 rounded-md text-sm font-medium" : "text-[hsl(var(--foreground))]/80 hover:text-[hsl(var(--foreground))] px-3 py-2 rounded-md text-sm font-medium"}
            >
              Dashboard
            </Link>
            <Link
              to="/about"
              className={isHome ? "text-slate-100/90 hover:text-white px-3 py-2 rounded-md text-sm font-medium" : "text-[hsl(var(--foreground))]/80 hover:text-[hsl(var(--foreground))] px-3 py-2 rounded-md text-sm font-medium"}
            >
              About
            </Link>
           
            <Link
              to="/vnpay"
              className={isHome ? "text-slate-100/90 hover:text-white px-3 py-2 rounded-md text-sm font-medium" : "text-[hsl(var(--foreground))]/80 hover:text-[hsl(var(--foreground))] px-3 py-2 rounded-md text-sm font-medium"}
            >
              Payment
            </Link>
            <Link
              to="/logout"
              className={isHome ? "bg-[hsl(var(--primary))] hover:opacity-90 text-[hsl(var(--primary-foreground))] px-4 py-2 rounded-md text-sm font-medium" : "bg-[hsl(var(--primary))] hover:opacity-90 text-[hsl(var(--primary-foreground))] px-4 py-2 rounded-md text-sm font-medium"}
            >
              Logout
            </Link>
            {/* <Link
              to="/register"
              className={isHome ? "border border-[hsl(var(--border))] text-slate-100 hover:bg-white/10 px-4 py-2 rounded-md text-sm font-medium" : "border border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))] px-4 py-2 rounded-md text-sm font-medium"}
            >
              Register
            </Link> */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 