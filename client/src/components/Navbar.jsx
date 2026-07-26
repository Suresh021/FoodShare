import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, LogOut, LayoutDashboard, UtensilsCrossed, PlusCircle, Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
              <span className="text-slate-900">Food</span>
              <span className="text-green-600">Share</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/foods"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                isActive('/foods')
                  ? 'bg-green-50 text-green-700'
                  : 'text-slate-600 hover:text-green-700 hover:bg-slate-50'
              }`}
            >
              <UtensilsCrossed className="h-4 w-4" />
              Browse Food
            </Link>

            {user && (
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  isActive('/dashboard')
                    ? 'bg-green-50 text-green-700'
                    : 'text-slate-600 hover:text-green-700 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {user.role === 'donor' && (
                  <Link to="/foods/create" className="btn-primary text-sm">
                    <PlusCircle className="h-4 w-4" />
                    Post Food
                  </Link>
                )}
                <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold text-slate-800 leading-tight">{user.name}</span>
                    <span className="text-xs text-slate-400 capitalize">{user.role}</span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={logout}
                    title="Logout"
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-green-700 transition-colors px-3 py-2">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-2">
          <Link to="/foods" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-green-50 hover:text-green-700" onClick={() => setMobileOpen(false)}>
            <UtensilsCrossed className="h-4 w-4" /> Browse Food
          </Link>
          {user && (
            <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-green-50 hover:text-green-700" onClick={() => setMobileOpen(false)}>
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
          )}
          {user?.role === 'donor' && (
            <Link to="/foods/create" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold bg-green-600 text-white" onClick={() => setMobileOpen(false)}>
              <PlusCircle className="h-4 w-4" /> Post Food
            </Link>
          )}
          {user ? (
            <button onClick={() => { logout(); setMobileOpen(false); }} className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/login" className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-700" onClick={() => setMobileOpen(false)}>Log in</Link>
              <Link to="/register" className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold bg-green-600 text-white" onClick={() => setMobileOpen(false)}>Sign up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
