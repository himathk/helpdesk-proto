import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, ChevronRight, Play } from 'lucide-react';
import { modules as staticModules } from '../data/modules';
import { useModules } from '../context/ModuleContext';

const GuideDetail = () => {
  const { modules } = useModules();
  const { guideId } = useParams();
  
  let guide = null;
  let parentModule = null;

  for (const mod of modules) {
    const g = mod.guides.find(g => g.id === guideId);
    if (g) {
      guide = g;
      parentModule = mod;
      break;
    }
  }

  if (!guide) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Guide not found</h2>
        <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium mt-4 inline-block">Go back home</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm font-medium text-slate-500 bg-white/50 w-fit px-4 py-2 rounded-full backdrop-blur-md shadow-sm ring-1 ring-slate-100">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link to={`/module/${parentModule.id}`} className="hover:text-primary transition-colors">{parentModule.title}</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-900">{guide.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
                <motion.h1 
                    className="text-4xl font-extrabold text-heading tracking-tight"
                >
                    {guide.title}
                </motion.h1>
                <p className="text-xl text-slate-600">{guide.description}</p>
            </div>

            {/* Video Player Container */}
            <motion.div 
                className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 ring-1 ring-black/5 bg-black aspecto-video group"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
                <video 
                    className="w-full aspect-video object-cover"
                    controls
                    poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"
                    src={guide.videoUrl}
                >
                    Your browser does not support the video tag.
                </video>
            </motion.div>
        </div>

        {/* Floating Steps Sidebar */}
        <div className="lg:col-span-1">
            <motion.div
                className="sticky top-28 glass-panel rounded-3xl p-1"
            >
                <div className="bg-white/50 rounded-[20px] p-6 backdrop-blur-sm">
                    <h3 className="font-bold text-heading mb-6 flex items-center justify-between">
                        <span>Instructions</span>
                        <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded-full">{guide.steps.length} Steps</span>
                    </h3>
                    
                    <div className="space-y-6">
                        {guide.steps.map((step, index) => (
                            <div key={index} className="flex gap-4 group">
                                <div className="relative">
                                    <div className="w-8 h-8 rounded-full bg-white border-2 border-primary/20 text-primary flex items-center justify-center font-bold text-sm shadow-sm group-hover:border-primary group-hover:scale-110 transition-all z-10 relative">
                                        {index + 1}
                                    </div>
                                    {index !== guide.steps.length - 1 && (
                                        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-full bg-slate-200 group-hover:bg-primary/20 transition-colors" />
                                    )}
                                </div>
                                <div className="pt-1">
                                    <p className="text-slate-600 text-sm font-medium leading-relaxed group-hover:text-slate-900 transition-colors">{step}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-8 bg-slate-900 text-white font-medium py-3 rounded-xl hover:bg-black hover:scale-[1.02] transition-all active:scale-[0.98] shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2">
                         <CheckCircle2 className="h-5 w-5" />
                         Mark as Complete
                    </button>
                </div>
            </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GuideDetail;
