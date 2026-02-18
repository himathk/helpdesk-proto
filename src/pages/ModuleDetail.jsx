import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, PlayCircle, FileText, ChevronRight, Clock } from 'lucide-react';
import { modules as staticModules } from '../data/modules';
import { useModules } from '../context/ModuleContext';
import DynamicIcon from '../components/DynamicIcon';

const ModuleDetail = () => {
  const { modules } = useModules();
  const { moduleId } = useParams();
  const module = modules.find(m => m.id === moduleId);

  if (!module) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Module not found</h2>
        <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium mt-4 inline-block">Go back home</Link>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="relative">
         <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 hover:bg-white text-sm font-medium text-slate-600 hover:text-primary transition-all shadow-sm ring-1 ring-slate-100 mb-8 backdrop-blur-md">
            <ArrowLeft className="h-4 w-4" />
            Back to Modules
          </Link>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <motion.div 
                className="bg-white/80 p-6 rounded-3xl shadow-xl shadow-primary/10 ring-1 ring-white"
            >
               <DynamicIcon name={module.icon} className="h-16 w-16 text-primary" />
            </motion.div>
            <div className="space-y-4 max-w-2xl">
              <motion.h1 
                className="text-4xl md:text-5xl font-extrabold text-heading tracking-tight"
              >
                {module.title}
              </motion.h1>
              <motion.p 
                className="text-xl text-slate-500 leading-relaxed"
              >
                {module.description}
              </motion.p>
              
              <div className="flex items-center gap-4 pt-2">
                 <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500 bg-white/60 px-3 py-1 rounded-full border border-white/50 shadow-sm backdrop-blur-sm">
                    <FileText className="h-4 w-4 text-primary" />
                    {module.guides.length} {module.guides.length === 1 ? 'Guide' : 'Guides'}
                 </div>
                 <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500 bg-white/60 px-3 py-1 rounded-full border border-white/50 shadow-sm backdrop-blur-sm">
                    <Clock className="h-4 w-4 text-secondary" />
                    Updated 2 days ago
                 </div>
              </div>
            </div>
          </div>
      </div>

      {/* Guides Grid */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Available Guides</h2>
        
        {module.guides.length > 0 ? (
            <div className="grid gap-4">
              {module.guides.map((guide, index) => (
                <motion.div
                >
                  <Link 
                    key={guide.id}
                    to={`/module/${moduleId}/${guide.id}`}
                    className="block group glass-card rounded-2xl p-6 flex items-center justify-between hover:scale-[1.01] transition-transform"
                  >
                    <div className="flex items-center gap-6">
                      <div className="h-16 w-16 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                         <PlayCircle className="h-8 w-8 text-slate-400 group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-heading mb-1">
                          {guide.title}
                        </h3>
                        <p className="text-slate-500 text-sm">
                          {guide.description.length > 120 
                            ? `${guide.description.slice(0, 120)}...` 
                            : guide.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-slate-400">
                        <span className="hidden sm:inline-block text-sm font-medium">{guide.steps.length} Steps</span>
                        <div className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-secondary group-hover:text-secondary transition-colors">
                            <ChevronRight className="h-5 w-5" />
                        </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
             <div className="glass-panel rounded-2xl p-12 text-center text-slate-500 border-dashed border-2 border-slate-300 bg-transparent">
                <p>No guides available for this module yet.</p>
             </div>
          )}
      </div>
    </div>
  );
};

export default ModuleDetail;
