import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Settings, HelpCircle, ChevronLeft, ChevronDown } from 'lucide-react';
import { useModules } from '../context/ModuleContext';
import DynamicIcon from './DynamicIcon';
import { useState, useEffect } from 'react';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const { modules } = useModules();
  const location = useLocation();
  const [expandedModules, setExpandedModules] = useState({});

  // Auto-expand module if current path is within it
  useEffect(() => {
    const currentModuleId = location.pathname.split('/')[2];
    if (currentModuleId && !isCollapsed) {
      setExpandedModules(prev => ({ ...prev, [currentModuleId]: true }));
    }
  }, [location.pathname, isCollapsed]);

  const toggleModule = (moduleId, e) => {
    e.preventDefault(); // Prevent navigation if clicking the toggle, let the NavLink handle main nav
    if (isCollapsed) return;
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  return (
    <motion.aside 
      initial={{ x: -280, opacity: 0 }}
      animate={{ 
          x: 0, 
          opacity: 1,
          width: isCollapsed ? 80 : 288
      }}
      exit={{ x: -280, opacity: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="fixed left-0 top-16 bottom-0 bg-glass-panel backdrop-blur-xl border-r border-glass-border overflow-y-auto z-40 hidden lg:block overflow-x-hidden"
    >
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <div className={`p-4 flex ${isCollapsed ? 'justify-center' : 'justify-end'}`}>
            <button 
                onClick={toggleSidebar}
                className="p-2 hover:bg-white/80 rounded-lg text-slate-500 transition-colors"
                title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
                {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
        </div>

        <div className="p-3 flex-1">
            {/* Knowledge Base Section */}
             <div className="mb-8">
                {!isCollapsed && (
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-3 opacity-100 transition-opacity">
                        Knowledge Base
                    </h3>
                )}
                <div className="space-y-1">
                    {modules.map((module) => {
                        const isExpanded = expandedModules[module.id];
                        const hasGuides = module.guides && module.guides.length > 0;
                        
                        return (
                            <div key={module.id} className="group/item">
                                <NavLink
                                    to={`/module/${module.id}`}
                                    end
                                    className={({ isActive }) => `
                                        flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative
                                        ${isActive 
                                            ? 'bg-primary/10 text-primary font-semibold shadow-sm' 
                                            : 'text-slate-600 hover:bg-white hover:text-slate-900 font-medium'
                                        }
                                        ${isCollapsed ? 'justify-center' : ''}
                                    `}
                                    onClick={(e) => {
                                        // If collapsing sidebar, let link work normally.
                                        // If expanded and has guides, toggle expand on click
                                        if (!isCollapsed && hasGuides) {
                                           // Optional: prevent default if you ONLY want to toggle but not navigate
                                           // But user likely wants to go to module overview AND expand
                                           setExpandedModules(prev => ({ ...prev, [module.id]: true }));
                                        }
                                    }}
                                >
                                    <DynamicIcon name={module.icon} className="h-5 w-5 min-w-[1.25rem]" />
                                    
                                    {!isCollapsed && (
                                        <>
                                            <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">{module.title}</span>
                                            {hasGuides && (
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Stop nav link click
                                                        e.preventDefault();
                                                        toggleModule(module.id, e);
                                                    }}
                                                    className="p-1 rounded-md hover:bg-slate-200/50 text-slate-400 hover:text-slate-600 transition-colors"
                                                >
                                                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                                                </button>
                                            )}
                                        </>
                                    )}
                                </NavLink>

                                {/* Sub-menu for Guides */}
                                <AnimatePresence>
                                    {!isCollapsed && isExpanded && hasGuides && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pl-4 pr-2 py-1 space-y-1 ml-3 border-l-2 border-slate-100">
                                                {module.guides.map(guide => (
                                                    <NavLink
                                                        key={guide.id}
                                                        to={`/module/${module.id}/${guide.id}`}
                                                        className={({ isActive }) => `
                                                            block px-3 py-2 text-sm rounded-lg transition-colors truncate
                                                            ${isActive 
                                                                ? 'text-primary bg-primary/5 font-medium' 
                                                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                                            }
                                                        `}
                                                    >
                                                        {guide.title}
                                                    </NavLink>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* System Section */}
            <div>
                 {!isCollapsed && (
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-3 opacity-100 transition-opacity">
                        System
                    </h3>
                 )}
                <div className="space-y-1">
                    <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-white hover:text-slate-900 font-medium transition-all ${isCollapsed ? 'justify-center' : 'text-left'}`}>
                        <Settings className="h-5 w-5 min-w-[1.25rem]" />
                        {!isCollapsed && <span>Settings</span>}
                    </button>
                     <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-white hover:text-slate-900 font-medium transition-all ${isCollapsed ? 'justify-center' : 'text-left'}`}>
                        <HelpCircle className="h-5 w-5 min-w-[1.25rem]" />
                        {!isCollapsed && <span>Help Center</span>}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
