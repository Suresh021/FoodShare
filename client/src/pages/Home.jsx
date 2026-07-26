import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Truck, Users, Leaf, Zap, ShieldCheck, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const stats = [
  { value: '2,400+', label: 'Meals Shared' },
  { value: '180+', label: 'Active Donors' },
  { value: '95', label: 'NGO Partners' },
  { value: '4.9★', label: 'Avg Rating' },
];

const features = [
  {
    icon: Heart,
    color: 'from-orange-400 to-rose-500',
    bg: 'bg-orange-50',
    title: 'Donate Surplus Food',
    desc: 'Restaurants, cafes, and events easily post leftover food to prevent waste and feed communities.',
  },
  {
    icon: Truck,
    color: 'from-blue-400 to-cyan-500',
    bg: 'bg-blue-50',
    title: 'Volunteer Delivery',
    desc: 'Delivery partners claim and transport food directly from donors to those who need it most.',
  },
  {
    icon: Users,
    color: 'from-green-400 to-teal-500',
    bg: 'bg-green-50',
    title: 'Feed Communities',
    desc: 'NGOs and community centres receive quality food to distribute to people in need every day.',
  },
];

const howItWorks = [
  { step: '01', title: 'Register & Choose Role', desc: 'Sign up as a Donor, Delivery Partner, or NGO in under a minute.' },
  { step: '02', title: 'Post or Browse Food', desc: 'Donors post surplus food; partners browse and claim available listings.' },
  { step: '03', title: 'Deliver & Receive', desc: 'Food is collected, transported, and delivered to people in need.' },
  { step: '04', title: 'Rate & Repeat', desc: 'Build your reputation with ratings and continue making an impact.' },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background gradient blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>

        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div className="section-tag mx-auto">
            <Leaf className="h-3.5 w-3.5" />
            Reducing Food Waste, One Meal at a Time
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-[1.1]" style={{ fontFamily: 'Sora, sans-serif' }}>
            Share Food,{' '}
            <span className="gradient-text">Spread Hope</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Connecting surplus food from restaurants and events with people in need — through a simple, trusted network of volunteers and NGOs.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            {user ? (
              <>
                <Link to="/foods" className="btn-primary text-base px-8 py-3.5">
                  Browse Food Listings <ArrowRight className="h-5 w-5" />
                </Link>
                <Link to="/dashboard" className="btn-secondary text-base px-8 py-3.5">
                  My Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn-primary text-base px-8 py-3.5">
                  Get Started Free <ArrowRight className="h-5 w-5" />
                </Link>
                <Link to="/foods" className="btn-secondary text-base px-8 py-3.5">
                  Browse Food
                </Link>
              </>
            )}
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="bg-white/80 backdrop-blur rounded-2xl border border-slate-100 shadow-sm py-4 px-3">
                <div className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Sora, sans-serif' }}>{s.value}</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="section-tag mx-auto">
              <Zap className="h-3.5 w-3.5" />
              How It Helps
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Everyone has a role to play
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              FoodShare brings together donors, delivery partners, and NGOs in one seamless platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card p-7 group">
                <div className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center`}>
                    <f.icon className="h-4 w-4 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-green-400 bg-green-400/10 px-3 py-1.5 rounded-full mb-4">
              <ShieldCheck className="h-3.5 w-3.5" />
              Simple Process
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How FoodShare Works
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Four easy steps to make a real-world impact.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {howItWorks.map((item, i) => (
              <div key={item.step} className="relative text-center">
                {i < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-3/4 w-full h-0.5 bg-gradient-to-r from-green-500/50 to-transparent"></div>
                )}
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold mx-auto mb-4 shadow-lg shadow-green-500/30">
                  {item.step}
                </div>
                <h3 className="text-white font-bold mb-2 text-sm">{item.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-br from-green-50 to-teal-50 border border-green-100 rounded-3xl p-12">
            <Star className="h-10 w-10 text-amber-400 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Ready to make a difference?
            </h2>
            <p className="text-slate-500 mb-8">
              Join thousands of donors, volunteers, and NGOs already using FoodShare to fight hunger and reduce waste.
            </p>
            <Link to="/register" className="btn-primary text-base px-10 py-3.5 mx-auto">
              Start Today — It's Free <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
