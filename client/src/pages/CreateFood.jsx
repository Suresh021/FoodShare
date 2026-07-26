import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, ArrowLeft, UtensilsCrossed, Clock, Tag, FileText, Image, Leaf } from 'lucide-react';

const foodTypes = ['Rice', 'Bread', 'Biryani', 'Curry', 'Roti', 'Sweets', 'Snacks', 'Fruits', 'Vegetables', 'Protein', 'Mixed Meals', 'Soup', 'Desserts', 'Other'];

const CreateFood = () => {
  const [formData, setFormData] = useState({
    foodType: '',
    quantity: '',
    description: '',
    image: '',
    expiryTime: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user?.role !== 'donor') {
    return (
      <div className="max-w-md mx-auto text-center py-24 px-4">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <UtensilsCrossed className="h-8 w-8 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Access Denied</h2>
        <p className="text-slate-500 mb-6">Only donors can post food listings.</p>
        <Link to="/dashboard" className="btn-primary">Back to Dashboard</Link>
      </div>
    );
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/foods', { ...formData, quantity: Number(formData.quantity) });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post food listing');
    } finally {
      setLoading(false);
    }
  };

  // Get min datetime (now)
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const minDateTime = now.toISOString().slice(0, 16);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-green-600 font-medium mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200">
          <PlusCircle className="h-7 w-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Sora, sans-serif' }}>
            Post Food Donation
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Help reduce waste by sharing your surplus food</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm">
                ⚠ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Food Type */}
              <div>
                <label className="label flex items-center gap-2">
                  <Tag className="h-4 w-4 text-slate-400" /> Food Type
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {foodTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, foodType: type })}
                      className={`px-3 py-1.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                        formData.foodType === type
                          ? 'bg-green-600 text-white border-green-600 shadow-md'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-green-400 hover:text-green-600'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  name="foodType"
                  value={formData.foodType}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Or type a custom food type..."
                  required
                />
              </div>

              {/* Quantity & Expiry */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label flex items-center gap-2">
                    <UtensilsCrossed className="h-4 w-4 text-slate-400" /> Quantity (servings)
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g. 50"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="label flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" /> Expiry Time
                  </label>
                  <input
                    type="datetime-local"
                    name="expiryTime"
                    value={formData.expiryTime}
                    onChange={handleChange}
                    className="input-field"
                    min={minDateTime}
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="label flex items-center gap-2">
                  <FileText className="h-4 w-4 text-slate-400" /> Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="input-field resize-none"
                  placeholder="Describe the food (preparation, dietary info, pickup location, etc.)"
                  required
                ></textarea>
              </div>

              {/* Image URL */}
              <div>
                <label className="label flex items-center gap-2">
                  <Image className="h-4 w-4 text-slate-400" /> Image URL{' '}
                  <span className="text-xs text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://example.com/photo.jpg"
                />
                {formData.image && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-slate-200 h-36">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center text-base py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    Posting...
                  </span>
                ) : (
                  <><PlusCircle className="h-5 w-5" /> Post Food Donation</>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar Tips */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-green-50 to-teal-50 border border-green-100 rounded-3xl p-6">
            <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
              <Leaf className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-bold text-slate-800 mb-3 text-sm">Tips for a great listing</h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              {[
                'Be specific about food type and quantity',
                'Set an accurate expiry time',
                'Add a clear photo to attract partners',
                'Include any dietary info (veg/non-veg)',
                'Mention the pickup location or timing',
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-green-500 text-white text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                    {i + 1}
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-3xl p-5">
            <p className="text-xs font-bold text-amber-700 mb-1">⏱ Act Fast!</p>
            <p className="text-xs text-amber-600 leading-relaxed">
              Listings with shorter expiry windows get claimed 3x faster. Post as soon as food is ready.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateFood;
