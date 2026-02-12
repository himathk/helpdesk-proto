import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Layers, LogOut, ChevronRight, Menu, Bell } from 'lucide-react';
import Grainient from '../Grainient';
import { motion } from 'framer-motion';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Modules', path: '/admin/modules', icon: Layers },
  ];
  
  // Clean up path for breadcrumbs
  const pathSegments = location.pathname.split('/').filter(Boolean).slice(1); // remove 'admin'

  return (
    <div className="flex h-screen bg-slate-50 relative overflow-hidden">
      {/* Background - Reusing Grainient for consistency but subtle */}
       <div className="fixed inset-0 -z-10 bg-slate-50">
        <Grainient
            color1="#f8fafc" // slate-50
            color2="#f1f5f9" // slate-100
            color3="#e2e8f0" // slate-200
            opacity={0.5}
            // ... keeping it very subtle
        />
       </div>

      {/* Sidebar */}
      <aside className="w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 flex flex-col z-20 shadow-xl shadow-slate-200/50">
        <div className="p-6 border-b border-slate-100/60">
            <div className="flex items-center gap-4 px-2">
                 <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-primary to-secondary p-0.5 shadow-lg shadow-primary/20">
                    <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Admin" alt="Admin" className="w-full h-full rounded-full bg-white object-cover" />
                 </div>
                 <div className="overflow-hidden">
                     <div className="font-bold text-slate-900 text-base truncate">Administrator</div>
                     <div className="text-xs text-slate-500 font-medium truncate">admin@helpdesk.com</div>
                 </div>
            </div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
           <div className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4 mb-4">Main Menu</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/25 translate-x-1'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                 {/* Active distinct background pattern could go here */}
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary'}`} />
                <span className="font-medium">{item.label}</span>
                {isActive && <ChevronRight className="h-4 w-4 ml-auto opacity-70" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-100/60">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors font-medium group"
          >
            <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative z-10 overflow-hidden">
        {/* Header */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-slate-200/60 bg-white/50 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-3 text-sm text-slate-500">
                <Link to="/admin/dashboard" className="hover:text-primary transition-colors">Home</Link>
                {pathSegments.map((segment, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <ChevronRight className="h-4 w-4 text-slate-300" />
                        <span className="capitalize text-slate-900 font-medium">{segment.replace('-', ' ')}</span>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-4">
                 <Link to="/" target="_blank" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors px-4 py-2 hover:bg-white rounded-lg">
                    View Site
                 </Link>
                 <div className="h-6 w-px bg-slate-200"></div>
                 <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-full transition-colors relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
                 </button>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
            <div className="max-w-6xl mx-auto space-y-8 pb-20">
                <Outlet />
            </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
