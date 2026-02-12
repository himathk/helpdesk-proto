import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LifeBuoy, Search, Bell } from 'lucide-react';

const Navbar = ({ isHome }) => {
  const location = useLocation();

  const navLinks = [
    { name: 'Featured', path: '/#featured' },
    { name: 'New', path: '/#new' },
    { name: 'All Modules', path: '/#modules' }
  ];

  const variants = {
    home: {
      maxWidth: "56rem", // max-w-4xl
      y: 24, // Top spacing
      x: "-50%",
      left: "50%",
      borderRadius: "9999px",
      paddingLeft: "1.5rem",
      paddingRight: "1.5rem",
      backdropFilter: "blur(12px)",
      backgroundColor: "var(--color-glass-panel)",
      border: "1px solid var(--color-glass-border)",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
    },
    app: {
      maxWidth: "100%",
      y: 0,
      x: "0%",
      left: "0%",
      borderRadius: "0px",
      paddingLeft: "2rem",
      paddingRight: "2rem",
      backdropFilter: "blur(12px)",
      backgroundColor: "var(--color-glass-panel)",
      borderBottom: "1px solid var(--color-glass-border)",
      border: "none", // Remove full border, keep bottom
      boxShadow: "none"
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <motion.nav 
        initial={false}
        animate={isHome ? "home" : "app"}
        variants={variants}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }} // Elegant easing
        className="absolute w-full flex items-center justify-between pointer-events-auto h-16"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-linear-to-br from-primary to-secondary p-2 rounded-full text-white shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
            <LifeBuoy className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg tracking-tight text-heading group-hover:text-primary transition-colors">
            InsurHelp<span className="text-secondary">.</span>
          </span>
        </Link>

        {/* Center Navigation - Only on Home */}
        {isHome && (
          <div className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1.5 rounded-full border border-slate-100/50">
            {navLinks.map((link) => {
              // Active state logic - simplified for hash links or keep strictly for path?
              // For hash scrolling on same page, it's hard to track active state without scroll spy.
              // For now, let's just highlight if the hash matches, or no highlight if we are just scrolling.
              // This is a simple implementation:
              const isActive = location.hash === link.path.substring(1) || (link.path === '/' && location.pathname === '/' && !location.hash); 
              
              return (
                <Link
                  key={link.name}
                  to={link.path}
                   className="relative px-5 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white rounded-full shadow-sm"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className={`relative z-10 ${isActive ? 'text-primary' : 'text-slate-500 hover:text-slate-900'}`}>
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-100/80 rounded-full text-slate-500 transition-colors relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border-2 border-white"></span>
          </button>
          
          <div className="w-8 h-8 rounded-full bg-linear-to-r from-primary to-secondary p-0.5 cursor-pointer hover:shadow-lg transition-shadow">
             <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix" alt="User" className="w-full h-full rounded-full bg-white" />
          </div>
        </div>
      </motion.nav>
    </div>
  );
};

export default Navbar;
