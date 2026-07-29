import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Leaf, LogOut, LayoutDashboard, UtensilsCrossed, PlusCircle, Menu, X, User, Bell } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/deliveries/notifications');
      setNotifications(res.data?.data || []);
    } catch {
      // silent
    }
  };

  const markRead = async () => {
    try {
      await api.put('/deliveries/notifications/read');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch {
      // silent
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

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

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifs(!showNotifs);
                      if (unreadCount > 0) markRead();
                    }}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 relative transition-colors"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown Drawer */}
                  {showNotifs && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-100 shadow-2xl p-4 z-50 max-h-96 overflow-y-auto">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-2">
                        <span className="font-bold text-xs uppercase text-slate-500">Notifications</span>
                        <span className="text-[10px] text-green-600 font-semibold">{notifications.length} total</span>
                      </div>
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-6">No notifications yet</p>
                      ) : (
                        <div className="space-y-2">
                          {notifications.map((n) => (
                            <div key={n._id} className={`p-2.5 rounded-xl text-xs ${n.isRead ? 'bg-slate-50 text-slate-600' : 'bg-green-50 text-green-900 font-semibold'}`}>
                              <p className="leading-snug">{n.message}</p>
                              <span className="text-[10px] text-slate-400 mt-1 block">
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                  <Link to="/profile" className="flex items-center gap-2 group">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow group-hover:scale-105 transition-transform overflow-hidden">
                      {user.profileImage ? (
                        <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-semibold text-slate-800 leading-tight group-hover:text-green-600 transition-colors">{user.name}</span>
                      <span className="text-[10px] text-slate-400 capitalize font-medium">{user.role}</span>
                    </div>
                  </Link>

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
            <>
              <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-green-50 hover:text-green-700" onClick={() => setMobileOpen(false)}>
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Link>
              <Link to="/profile" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-green-50 hover:text-green-700" onClick={() => setMobileOpen(false)}>
                <User className="h-4 w-4" /> Profile
              </Link>
            </>
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
