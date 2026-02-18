import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, ArrowLeft } from 'lucide-react';
import Grainient from '../../components/Grainient';
import { motion } from 'framer-motion';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate(from, { replace: true });
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center font-sans overflow-hidden bg-slate-50">
      {/* Background - Simplified for Admin cleanliness */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-slate-50"></div>
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-blue-50/50 to-transparent"></div>
      </div>

      <div className="absolute top-8 left-8">
        <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md p-6"
      >
        <div className="bg-white rounded-[2rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
            <div className="relative z-10 text-center mb-10">
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                    className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-primary/30"
                >
                    <Lock className="h-8 w-8" />
                </motion.div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Welcome Back</h1>
                <p className="text-slate-500 text-lg">Sign in to manage your helpdesk</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl text-center font-medium"
                    >
                    {error}
                    </motion.div>
                )}
                
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide ml-1">Username</label>
                    <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder-slate-400 font-medium text-slate-900"
                    placeholder="Enter your username"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide ml-1">Password</label>
                    <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder-slate-400 font-medium text-slate-900"
                    placeholder="Enter your password"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 mt-4"
                >
                    Sign In
                </button>
            </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
