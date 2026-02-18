import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, ArrowLeft } from 'lucide-react';
import Grainient from '../components/Grainient';
import { motion } from 'framer-motion';

const CustomerLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = (e) => {
    e.preventDefault();
    // For customer login, we might want different validation or a different auth method later.
    // For now, reusing the existing login structure.
    if (login(username, password)) {
      navigate(from, { replace: true });
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center font-sans overflow-hidden">
      {/* Background - Glassmorphism Style */}
      <div className="absolute inset-0 -z-10 bg-white">
        <Grainient
            color1="#cde6f6ff"
            color2="#c1d7feff"
            color3="#abafecff"
            timeSpeed={0.25}
            colorBalance={-0.22}
            warpStrength={1.95} 
            warpFrequency={2.3}
            warpSpeed={1.6}
            warpAmplitude={50}
            blendAngle={0}
            blendSoftness={0.62}
            rotationAmount={500}
            noiseScale={4}
            grainAmount={0}
            grainScale={0.2}
            grainAnimated={false}
            contrast={1.5}
            gamma={1}
            saturation={1}
            centerX={0}
            centerY={0}
            zoom={0.9}
        />
      </div>

      <div className="absolute top-8 left-8">
        <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg p-8 sm:p-10"
      >
        <div className="glass-panel rounded-3xl p-8 sm:p-10 shadow-2xl shadow-primary/10 border border-white/50 backdrop-blur-xl relative overflow-hidden">
            {/* Decorative glow blobs */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 text-center mb-10">
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                    className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-primary/30"
                >
                    <User className="h-8 w-8" />
                </motion.div>
                <h1 className="text-3xl font-bold text-heading tracking-tight mb-2">Welcome</h1>
                <p className="text-slate-500 text-lg">Sign in to access your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="p-4 bg-red-50/80 border border-red-100 text-red-600 text-sm rounded-xl text-center font-medium backdrop-blur-sm"
                    >
                    {error}
                    </motion.div>
                )}
                
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 ml-1">Username</label>
                    <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-5 py-3.5 bg-white/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder-slate-400 font-medium text-slate-900"
                    placeholder="Enter your username"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 ml-1">Password</label>
                    <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-3.5 bg-white/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder-slate-400 font-medium text-slate-900"
                    placeholder="Enter your password"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 mt-2"
                >
                    Sign In
                </button>
            </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CustomerLogin;
