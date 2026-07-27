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

  const [ratingDelivery, setRatingDelivery] = useState(null);
  const [ratingStars, setRatingStars] = useState(5);
  const [hoverStars, setHoverStars] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);

  const handleOpenRatingModal = (delivery) => {
    setRatingDelivery(delivery);
    setRatingStars(delivery.rating || 5);
    setFeedback(delivery.feedback || '');
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    if (!ratingDelivery) return;
    try {
      setSubmittingRating(true);
      await api.put(`/deliveries/${ratingDelivery._id}/rate`, {
        rating: ratingStars,
        feedback
      });
      setRatingDelivery(null);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmittingRating(false);
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
                      <p className="font-semibold text-slate-900">
                        {item.foodListingId?.foodType ? `${item.foodListingId.foodType} Delivery` : `Delivery #${item._id.substring(0, 8)}`}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {item.partnerId?.name ? `Partner: ${item.partnerId.name} · ` : ''}
                        {new Date(item.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                      </p>
                      {item.feedback && (
                        <p className="text-xs text-slate-500 italic mt-1 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                          "{item.feedback}"
                        </p>
                      )}
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
                  {user.role === 'ngo' && item.status === 'completed' && (
                    item.rating > 0 ? (
                      <button
                        onClick={() => handleOpenRatingModal(item)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
                      >
                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                        <span>{item.rating}/5</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenRatingModal(item)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-amber-500 text-white hover:bg-amber-600 shadow-sm transition-all hover:scale-105"
                      >
                        <Star className="h-3.5 w-3.5 text-white fill-white" />
                        <span>Rate Delivery</span>
                      </button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* NGO Rating Modal */}
      {ratingDelivery && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 transform transition-all animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center">
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Sora, sans-serif' }}>
                    Rate Delivery
                  </h3>
                  <p className="text-xs text-slate-400">Share feedback for the delivery partner</p>
                </div>
              </div>
              <button
                onClick={() => setRatingDelivery(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitRating} className="space-y-4">
              {/* Star Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">
                  Select Rating
                </label>
                <div className="flex items-center justify-center gap-2 py-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingStars(star)}
                      onMouseEnter={() => setHoverStars(star)}
                      onMouseLeave={() => setHoverStars(0)}
                      className="p-1 focus:outline-none transition-transform hover:scale-125"
                    >
                      <Star
                        className={`h-8 w-8 transition-colors ${
                          star <= (hoverStars || ratingStars)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200 fill-slate-100'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-center text-xs font-medium text-amber-600 mt-1">
                  {['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][(hoverStars || ratingStars) - 1]}
                </p>
              </div>

              {/* Feedback Text */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Feedback & Comments (Optional)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="How was the food condition and partner service?"
                  rows="3"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm text-slate-900 transition-all resize-none"
                ></textarea>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRatingDelivery(null)}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRating}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm hover:from-amber-600 hover:to-orange-600 shadow-md shadow-amber-500/20 transition-all disabled:opacity-60"
                >
                  {submittingRating ? 'Submitting...' : 'Submit Rating'}
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
