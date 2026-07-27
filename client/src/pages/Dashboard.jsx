import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Link } from 'react-router-dom';
import {
  Package, Truck, CheckCircle, Clock, PlusCircle,
  TrendingUp, UtensilsCrossed, Star, ArrowRight, Leaf
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <div className="card p-6 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center flex-shrink-0`}>
      <Icon className={`h-5 w-5 ${color}`} />
    </div>
    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-slate-900 mt-0.5" style={{ fontFamily: 'Sora, sans-serif' }}>{value}</p>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    available: 'badge-available',
    claimed: 'badge-claimed',
    delivered: 'badge-delivered',
    pending: 'badge-claimed',
    completed: 'badge-available',
  };
  const dot = {
    available: 'bg-emerald-500', claimed: 'bg-amber-500',
    delivered: 'bg-slate-400', pending: 'bg-amber-500', completed: 'bg-emerald-500',
  };
  return (
    <span className={map[status] || 'badge-delivered'}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot[status] || 'bg-slate-400'}`}></span>
      {status}
    </span>
  );
};

const roleConfig = {
  donor: {
    title: 'Donor Dashboard',
    subtitle: 'Track and manage your food donations',
    gradient: 'from-orange-500 to-amber-500',
    bg: 'bg-orange-50',
    accent: 'text-orange-600',
    icon: UtensilsCrossed,
  },
  partner: {
    title: 'Partner Dashboard',
    subtitle: 'Manage your delivery assignments',
    gradient: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50',
    accent: 'text-blue-600',
    icon: Truck,
  },
  ngo: {
    title: 'NGO Dashboard',
    subtitle: 'Track incoming food deliveries',
    gradient: 'from-green-500 to-teal-500',
    bg: 'bg-green-50',
    accent: 'text-green-600',
    icon: Package,
  },
};

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ratingModal, setRatingModal] = useState(null);
  const [ratingData, setRatingData] = useState({ rating: 5, feedback: '' });

  const config = roleConfig[user.role] || roleConfig.donor;
  const RoleIcon = config.icon;

  useEffect(() => { fetchDashboardData(); }, [user.role]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      let response;
      if (user.role === 'donor') {
        response = await api.get('/foods');
        const foods = Array.isArray(response.data) ? response.data : response.data.data || [];
        setData(foods.filter(f => {
          const donorId = typeof f.donorId === 'object' ? f.donorId?._id : f.donorId;
          return donorId === user._id;
        }));
      } else {
        response = await api.get('/deliveries/my-deliveries');
        const deliveries = Array.isArray(response.data) ? response.data : response.data.data || [];
        setData(deliveries);
      }
    } catch (err) {
      setError('Failed to load dashboard data');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteDelivery = async (deliveryId) => {
    try {
      await api.put(`/deliveries/${deliveryId}/complete`);
      fetchDashboardData();
    } catch {
      alert('Failed to complete delivery');
    }
  };

  const submitRating = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/deliveries/${ratingModal._id}/rate`, {
        rating: ratingData.rating,
        feedback: ratingData.feedback
      });
      setRatingModal(null);
      fetchDashboardData();
    } catch (err) {
      alert('Failed to submit rating');
    }
  };

  const totalItems = data.length;
  const activeItems = data.filter(d => ['available', 'pending'].includes(d.status)).length;
  const completedItems = data.filter(d => ['delivered', 'completed'].includes(d.status)).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 mb-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <div className={`w-full h-full bg-gradient-to-br ${config.gradient} rounded-full translate-x-1/3 -translate-y-1/3`}></div>
        </div>
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg`}>
              <RoleIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">Welcome back,</p>
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>{user.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${config.gradient} text-white capitalize`}>
                  {user.role}
                </span>
                <span className="text-slate-500 text-xs">{user.email}</span>
              </div>
            </div>
          </div>
          {user.role === 'donor' && (
            <Link to="/foods/create" className="btn-primary flex-shrink-0">
              <PlusCircle className="h-4 w-4" />
              Post New Food
            </Link>
          )}
          {user.role === 'partner' && (
            <Link to="/foods" className="btn-outline flex-shrink-0 border-white/30 text-white hover:bg-white/10 hover:text-white">
              Browse Available Food <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={Package} label="Total" value={totalItems} color="text-slate-600" bg="bg-slate-100" />
        <StatCard icon={Clock} label="Active" value={activeItems} color="text-amber-600" bg="bg-amber-50" />
        <StatCard icon={CheckCircle} label="Completed" value={completedItems} color="text-emerald-600" bg="bg-emerald-50" />
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl mb-6 text-sm">{error}</div>}

      {/* Data Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Sora, sans-serif' }}>
              {user.role === 'donor' ? 'Your Listings' : user.role === 'partner' ? 'Your Deliveries' : 'Incoming Deliveries'}
            </h2>
            <p className="text-slate-500 text-sm mt-0.5">
              {totalItems} total {user.role === 'donor' ? 'food postings' : 'deliveries'}
            </p>
          </div>
          {user.role === 'partner' && (
            <Link to="/foods" className="text-sm text-green-600 font-semibold hover:underline flex items-center gap-1">
              Find more food <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-slate-200"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded-lg w-1/3"></div>
                  <div className="h-3 bg-slate-100 rounded-lg w-1/4"></div>
                </div>
                <div className="h-6 w-20 bg-slate-100 rounded-full"></div>
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="p-16 text-center">
            <div className={`w-16 h-16 rounded-2xl ${config.bg} flex items-center justify-center mx-auto mb-4`}>
              <RoleIcon className={`h-8 w-8 ${config.accent}`} />
            </div>
            <h3 className="text-slate-700 font-bold mb-1">No activity yet</h3>
            <p className="text-slate-400 text-sm">
              {user.role === 'donor' ? 'Post your first food listing to get started.' : 'Claim food from the listings page to start delivering.'}
            </p>
            <Link to={user.role === 'donor' ? '/foods/create' : '/foods'} className="btn-primary mt-4 inline-flex">
              {user.role === 'donor' ? 'Post Food' : 'Browse Food'}
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {data.map((item) => (
              <div key={item._id} className="flex items-center gap-4 p-5 hover:bg-slate-50/60 transition-colors">
                <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
                  <RoleIcon className={`h-4 w-4 ${config.accent}`} />
                </div>
                <div className="flex-grow min-w-0">
                  {user.role === 'donor' ? (
                    <>
                      <p className="font-semibold text-slate-900 capitalize truncate">{item.foodType}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.quantity} servings · Posted {new Date(item.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-slate-900">Delivery #{item._id.substring(0, 8)}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{new Date(item.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <StatusBadge status={item.status} />
                  
                  {user.role === 'partner' && item.status === 'pending' && (
                    <button
                      onClick={() => handleCompleteDelivery(item._id)}
                      className="text-xs font-semibold bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Mark Complete
                    </button>
                  )}

                  {user.role === 'ngo' && item.status === 'completed' && item.rating === 0 && (
                    <button
                      onClick={() => {
                        setRatingModal(item);
                        setRatingData({ rating: 5, feedback: '' });
                      }}
                      className="text-xs font-semibold bg-amber-500 text-white px-3 py-1.5 rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-1"
                    >
                      <Star className="h-3 w-3" fill="currentColor" /> Rate
                    </button>
                  )}

                  {item.rating > 0 && (
                    <span className="flex items-center gap-1 text-amber-500 text-xs font-bold bg-amber-50 px-2 py-1 rounded-md">
                      <Star className="h-3 w-3" fill="currentColor" /> {item.rating}/5
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {ratingModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>Rate this Delivery</h3>
            <p className="text-sm text-slate-500 mb-6">How was the food quality and delivery experience?</p>
            
            <form onSubmit={submitRating}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Rating (1-5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingData({ ...ratingData, rating: star })}
                      className={`p-2 rounded-xl transition-all ${ratingData.rating >= star ? 'text-amber-500 bg-amber-50' : 'text-slate-300 bg-slate-50 hover:bg-slate-100'}`}
                    >
                      <Star className="h-6 w-6" fill={ratingData.rating >= star ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Feedback (Optional)</label>
                <textarea
                  value={ratingData.feedback}
                  onChange={(e) => setRatingData({ ...ratingData, feedback: e.target.value })}
                  placeholder="Share your thoughts about the food..."
                  className="w-full rounded-xl border-slate-200 focus:border-green-500 focus:ring-green-500 bg-slate-50 p-3"
                  rows="3"
                ></textarea>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setRatingModal(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-slate-700 font-semibold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-xl text-white font-semibold bg-green-600 hover:bg-green-700 transition-colors"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
