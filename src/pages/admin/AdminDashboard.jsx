import { useModules } from '../../context/ModuleContext';
import { Layers, FileText, Video, TrendingUp, Users, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { modules } = useModules();
  
  const totalGuides = modules.reduce((acc, curr) => acc + (curr.guides?.length || 0), 0);
  const totalVideos = modules.reduce((acc, curr) => 
    acc + (curr.guides?.filter(g => g.videoUrl)?.length || 0), 0
  );

  const stats = [
    { 
        label: 'Total Modules', 
        value: modules.length, 
        icon: Layers, 
        gradient: 'from-blue-500 to-indigo-600',
        bg: 'bg-blue-50',
        textColor: 'text-blue-600',
        trend: '+2 this week'
    },
    { 
        label: 'Published Guides', 
        value: totalGuides, 
        icon: FileText, 
        gradient: 'from-emerald-500 to-teal-600',
        bg: 'bg-emerald-50',
        textColor: 'text-emerald-600',
        trend: '+5 this week' 
    },
    { 
        label: 'Video Resources', 
        value: totalVideos, 
        icon: Video, 
        gradient: 'from-violet-500 to-purple-600',
        bg: 'bg-purple-50',
        textColor: 'text-purple-600',
        trend: '+1 this week' 
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-10"
    >
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
            <p className="text-slate-500 mt-1 text-lg">Detailed performance of your helpdesk content.</p>
        </div>
        <div className="flex gap-3">
             <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                Download Report
             </button>
             <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25">
                Add Content
             </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div 
                key={stat.label} 
                variants={item}
                whileHover={{ y: -5 }}
                className="relative group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden"
            >
                {/* Decorative background blob */}
                <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700`}></div>
                
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg shadow-primary/20`}>
                            <Icon className="h-6 w-6" />
                        </div>
                        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.bg} ${stat.textColor}`}>
                            <TrendingUp className="h-3 w-3" />
                            {stat.trend}
                        </div>
                    </div>
                    
                    <div className="space-y-1">
                        <div className="text-4xl font-extrabold text-slate-900 tracking-tight">{stat.value}</div>
                        <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</div>
                    </div>
                </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div variants={item} className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8">
            <div className="flex items-center justify-between mb-8">
                 <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
                 <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">View All</button>
            </div>
            
            <div className="space-y-6">
                {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-start gap-4 group">
                        <div className="relative mt-1">
                             <div className="h-2 w-2 rounded-full bg-slate-200 ring-4 ring-white relative z-10 group-hover:bg-primary transition-colors"></div>
                             {i !== 2 && <div className="absolute top-2 left-1/2 -translate-x-1/2 w-px h-full bg-slate-100 -z-0"></div>}
                        </div>
                        <div className="flex-1 pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                            <p className="text-sm text-slate-600 font-medium">
                                <span className="text-slate-900 font-bold hover:text-primary transition-colors cursor-pointer">Admin</span> updated the <span className="text-slate-900 font-bold hover:text-primary transition-colors cursor-pointer">Claims Processing</span> module.
                            </p>
                            <p className="text-xs text-slate-400 mt-1">2 hours ago</p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>

        <motion.div variants={item} className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] shadow-2xl shadow-slate-900/20 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full mix-blend-overlay filter blur-[100px] opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-overlay filter blur-[100px] opacity-20"></div>
            
            <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                     <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl w-fit mb-6">
                        <Users className="h-6 w-6 text-white" />
                     </div>
                     <h2 className="text-2xl font-bold mb-2">Team Access</h2>
                     <p className="text-slate-400 leading-relaxed">Manage permissions and roles for your support team members.</p>
                </div>
                
                <div className="mt-8">
                     <div className="flex items-center -space-x-4 mb-6 pl-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-800 bg-slate-700 flex items-center justify-center text-xs font-bold shadow-lg">
                                {i === 4 ? '+5' : <div className="w-full h-full bg-gradient-to-br from-slate-400 to-slate-600 rounded-full"></div>}
                            </div>
                        ))}
                     </div>
                     <button className="w-full py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 group">
                        Manage Team
                        <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                     </button>
                </div>
            </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
