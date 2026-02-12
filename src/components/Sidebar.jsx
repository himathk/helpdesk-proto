import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Settings, HelpCircle, ChevronLeft, Menu } from 'lucide-react';
import { useModules } from '../context/ModuleContext';
import DynamicIcon from './DynamicIcon';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const { modules } = useModules();
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
            <div className="mb-8">
                {!isCollapsed && (
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-3 opacity-100 transition-opacity">
                        Modules
                    </h3>
                )}
                <div className="space-y-1">
                    {modules.map((module) => {
                        return (
                            <NavLink
                                key={module.id}
                                to={`/module/${module.id}`}
                                className={({ isActive }) => `
                                    flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
                                    ${isActive 
                                        ? 'bg-primary/10 text-primary font-semibold shadow-sm' 
                                        : 'text-slate-600 hover:bg-white hover:text-slate-900 font-medium'
                                    }
                                    ${isCollapsed ? 'justify-center' : ''}
                                `}
                            >
                                <DynamicIcon name={module.icon} className="h-5 w-5 min-w-[1.25rem]" />
                                {!isCollapsed && (
                                    <>
                                        <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">{module.title}</span>
                                        <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </div>
            </div>

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
