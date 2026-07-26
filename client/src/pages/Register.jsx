import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Eye, EyeOff, Leaf, ArrowRight, UtensilsCrossed, Truck, Users } from 'lucide-react';

const roles = [
  {
    value: 'donor',
    label: 'Donor',
    icon: UtensilsCrossed,
    desc: 'Restaurant / Cafe / Event',
    color: 'border-orange-400 bg-orange-50 text-orange-700',
    activeColor: 'border-orange-500 bg-orange-100 ring-2 ring-orange-300',
  },
  {
    value: 'partner',
    label: 'Delivery Partner',
    icon: Truck,
    desc: 'Volunteer / Gig Worker',
    color: 'border-blue-400 bg-blue-50 text-blue-700',
    activeColor: 'border-blue-500 bg-blue-100 ring-2 ring-blue-300',
  },
  {
    value: 'ngo',
    label: 'NGO',
    icon: Users,
    desc: 'Community Centre / NGO',
    color: 'border-green-400 bg-green-50 text-green-700',
    activeColor: 'border-green-500 bg-green-100 ring-2 ring-green-300',
  },
];

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', role: 'donor' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await register(formData);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Failed to register');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 py-12 bg-slate-50">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-200">
            <UserPlus className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Sora, sans-serif' }}>
            Create your account
          </h1>
          <p className="text-slate-500 text-sm mt-1">Join FoodShare and start making an impact</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100 p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm">
              ⚠ {error}
            </div>
          )}

          {/* Role Selector */}
          <div className="mb-6">
            <label className="label mb-3">I am a...</label>
            <div className="grid grid-cols-3 gap-3">
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: r.value })}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                    formData.role === r.value ? r.activeColor : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${formData.role === r.value ? r.color : 'bg-slate-100 text-slate-500'}`}>
                    <r.icon className="h-4 w-4" />
                  </div>
                  <span className={`text-xs font-bold leading-tight text-center ${formData.role === r.value ? 'text-slate-800' : 'text-slate-500'}`}>
                    {r.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="label">Full Name</label>
                <input
                  type="text" name="name" value={formData.name}
                  onChange={handleChange} className="input-field" placeholder="John Doe" required
                />
              </div>
              <div className="col-span-2">
                <label className="label">Email Address</label>
                <input
                  type="email" name="email" value={formData.email}
                  onChange={handleChange} className="input-field" placeholder="you@example.com" required
                />
              </div>
              <div>
                <label className="label">Phone Number</label>
                <input
                  type="text" name="phone" value={formData.phone}
                  onChange={handleChange} className="input-field" placeholder="9876543210" required
                />
              </div>
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'} name="password" value={formData.password}
                    onChange={handleChange} className="input-field pr-10" placeholder="••••••••" required minLength="6"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="btn-primary w-full justify-center text-base py-3.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Creating account...
                </span>
              ) : (
                <>Create Account <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-green-600 font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
