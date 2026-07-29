import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Phone, MapPin, Building, Truck, Users, Star, CheckCircle, Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    profileImage: user?.profileImage || '',
    address: user?.address || '',
    servingTarget: user?.servingTarget || '',
    businessType: user?.businessType || '',
    vehicleType: user?.vehicleType || ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await api.put('/users/profile', formData);
      if (res.data?.success) {
        setMessage('Profile updated successfully!');
        // Update local auth user state
        const updatedUser = res.data.data;
        const token = localStorage.getItem('token');
        login(token, updatedUser);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-green-600 font-medium mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        {/* Profile Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-green-950 p-8 text-white relative">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-green-400 to-teal-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-white/20 shadow-xl overflow-hidden flex-shrink-0">
              {formData.profileImage ? (
                <img src={formData.profileImage} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name?.charAt(0).toUpperCase()
              )}
            </div>

            <div className="text-center md:text-left flex-grow">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <h1 className="text-2xl font-extrabold">{user.name}</h1>
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/30 uppercase">
                  {user.role}
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-1">{user.email}</p>

              {/* Stats badges */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
                <div className="bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 text-xs">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-white">{user.rating?.toFixed(1) || '5.0'}</span>
                  <span className="text-slate-400">({user.ratingCount || 0} ratings)</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 text-xs">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span className="font-bold text-white">{user.totalDeliveries || 0}</span>
                  <span className="text-slate-400">{user.role === 'donor' ? 'Donations' : 'Deliveries'} Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="p-4 sm:p-8">
          {message && <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-2xl mb-6 text-sm flex items-center gap-2">✅ {message}</div>}
          {error && <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl mb-6 text-sm">⚠ {error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3" style={{ fontFamily: 'Sora, sans-serif' }}>
              Personal & Organization Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="label flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-400" /> Full Name / Org Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="label flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400" /> Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="+91 9876543210"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="label flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-400" /> Profile Image URL
                </label>
                <input
                  type="url"
                  name="profileImage"
                  value={formData.profileImage}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

              <div>
                <label className="label flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400" /> Address / Pickup Location
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Street name, landmark, City"
                />
              </div>
            </div>

            {/* Role Specific Section */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-4">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                {user.role === 'ngo' ? <Users className="h-4 w-4 text-green-600" /> :
                 user.role === 'donor' ? <Building className="h-4 w-4 text-amber-600" /> :
                 <Truck className="h-4 w-4 text-blue-600" />}
                {user.role === 'ngo' ? 'NGO Beneficiary Profile' : user.role === 'donor' ? 'Donor Business Info' : 'Delivery Partner Info'}
              </h3>

              {user.role === 'ngo' && (
                <div>
                  <label className="label text-xs">Whom the NGO is Serving (Beneficiary Target Audience)</label>
                  <input
                    type="text"
                    name="servingTarget"
                    value={formData.servingTarget}
                    onChange={handleChange}
                    className="input-field bg-white"
                    placeholder="e.g. Serves 200 daily meals to orphanage children & homeless individuals"
                  />
                  <p className="text-xs text-slate-400 mt-1">This helps restaurants & donors understand the impact of their food donations.</p>
                </div>
              )}

              {user.role === 'donor' && (
                <div>
                  <label className="label text-xs">Restaurant / Catering / Event Business Type</label>
                  <input
                    type="text"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="input-field bg-white"
                    placeholder="e.g. Fine Dining Restaurant / Wedding Caterer / Bakery"
                  />
                </div>
              )}

              {user.role === 'partner' && (
                <div>
                  <label className="label text-xs">Vehicle Type & License Info</label>
                  <input
                    type="text"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    className="input-field bg-white"
                    placeholder="e.g. Scooter / Electric Bike / Van (KA 01 AB 1234)"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center text-base py-3.5 shadow-lg shadow-green-200"
            >
              {loading ? (
                <span>Saving Profile...</span>
              ) : (
                <><Save className="h-5 w-5" /> Save Profile Changes</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
