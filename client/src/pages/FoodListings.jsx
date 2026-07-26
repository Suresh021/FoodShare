import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Clock, Tag, UtensilsCrossed, Search, Filter, ChevronDown, Leaf } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const map = {
    available: 'badge-available',
    claimed: 'badge-claimed',
    delivered: 'badge-delivered',
  };
  const dot = {
    available: 'bg-emerald-500',
    claimed: 'bg-amber-500',
    delivered: 'bg-slate-400',
  };
  return (
    <span className={map[status] || 'badge-delivered'}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot[status] || 'bg-slate-400'}`}></span>
      {status}
    </span>
  );
};

const FoodListings = () => {
  const [foods, setFoods] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ngos, setNgos] = useState([]);
  const { user } = useAuth();

  useEffect(() => { 
    fetchFoods(); 
    if (user?.role === 'partner') {
      api.get('/users?role=ngo')
        .then(res => setNgos(Array.isArray(res.data) ? res.data : res.data.data || []))
        .catch(err => console.error('Failed to fetch NGOs', err));
    }
  }, [user?.role]);

  useEffect(() => {
    let result = foods;
    if (search) result = result.filter(f => f.foodType?.toLowerCase().includes(search.toLowerCase()) || f.description?.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter !== 'all') result = result.filter(f => f.status === statusFilter);
    setFiltered(result);
  }, [foods, search, statusFilter]);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const response = await api.get('/foods');
      // API returns { success: true, data: [...] }
      setFoods(Array.isArray(response.data) ? response.data : response.data.data || []);
    } catch (err) {
      setError('Failed to load food listings');
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (foodId, ngoId) => {
    try {
      await api.put(`/foods/${foodId}/claim`);
      await api.post('/deliveries', { foodListingId: foodId, ngoId });
      fetchFoods();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to claim food');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="section-tag">
            <UtensilsCrossed className="h-3.5 w-3.5" />
            Food Donations
          </div>
          <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Sora, sans-serif' }}>
            Available Food
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Browse and claim surplus food donations near you</p>
        </div>
        {user?.role === 'donor' && (
          <Link to="/foods/create" className="btn-primary">
            + Post Food Donation
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by food type or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'available', 'claimed', 'delivered'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all duration-200 ${
                statusFilter === s
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-green-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm">{error}</div>
      )}

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card overflow-hidden animate-pulse">
              <div className="w-full h-48 bg-slate-200"></div>
              <div className="p-5 space-y-3">
                <div className="h-5 bg-slate-200 rounded-lg w-2/3"></div>
                <div className="h-4 bg-slate-100 rounded-lg w-full"></div>
                <div className="h-4 bg-slate-100 rounded-lg w-4/5"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
          <UtensilsCrossed className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">No food listings found</p>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((food) => (
            <div key={food._id} className="card overflow-hidden flex flex-col group">
              {food.image ? (
                <div className="relative overflow-hidden">
                  <img
                    src={food.image}
                    alt={food.foodType}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={food.status} />
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-48 bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center">
                  <div className="text-center">
                    <Leaf className="h-12 w-12 text-green-200 mx-auto mb-2" />
                    <span className="text-sm text-green-300 font-medium capitalize">{food.foodType}</span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={food.status} />
                  </div>
                </div>
              )}

              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-slate-900 capitalize mb-2">{food.foodType}</h3>
                <p className="text-slate-500 text-sm mb-4 flex-grow leading-relaxed line-clamp-2">{food.description}</p>

                <div className="space-y-2 mb-5 border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                      <Tag className="h-3.5 w-3.5 text-amber-600" />
                    </div>
                    <span><strong className="text-slate-700">{food.quantity}</strong> servings available</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Clock className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                    <span>Expires {new Date(food.expiryTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  </div>
                </div>

                {user?.role === 'partner' && food.status === 'available' && (
                  <div className="space-y-2 mt-auto pt-2">
                    <select 
                      id={`ngo-${food._id}`} 
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      defaultValue=""
                    >
                      <option value="" disabled>Select NGO to deliver to...</option>
                      {ngos.map(ngo => (
                        <option key={ngo._id} value={ngo._id}>{ngo.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => {
                        const ngoId = document.getElementById(`ngo-${food._id}`).value;
                        if (!ngoId) return alert('Please select an NGO first');
                        handleClaim(food._id, ngoId);
                      }}
                      className="btn-primary w-full justify-center"
                    >
                      Claim & Deliver
                    </button>
                  </div>
                )}
                {(!user || user?.role !== 'partner') && food.status === 'available' && (
                  <div className="text-center py-2 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-400 font-medium">
                    Sign in as Delivery Partner to claim
                  </div>
                )}
                {food.status !== 'available' && (
                  <div className={`text-center py-2 px-4 rounded-xl text-xs flex flex-col items-center gap-1 font-semibold ${
                    food.status === 'claimed' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'
                  }`}>
                    {food.status === 'claimed' ? '🚚 Being delivered...' : '✅ Successfully delivered'}
                    {food.status === 'claimed' && user?.role === 'partner' && food.claimedBy === user._id && (
                      <span className="text-[10px] text-amber-500 font-normal">Go to Dashboard to Mark Complete</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Count */}
      {!loading && (
        <p className="text-center text-sm text-slate-400 mt-8">
          Showing {filtered.length} of {foods.length} listings
        </p>
      )}
    </div>
  );
};

export default FoodListings;
