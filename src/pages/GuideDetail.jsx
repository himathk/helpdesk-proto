import { useParams, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight, Play } from 'lucide-react';
import { modules as staticModules } from '../data/modules';
import { useModules } from '../context/ModuleContext';
import useVideoThumbnail from '../hooks/useVideoThumbnail';

const GuideDetail = () => {
  const { modules } = useModules();
  const { guideId, moduleId } = useParams();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Highlight effect
            element.classList.add('bg-primary/5', 'ring-2', 'ring-primary/20', 'rounded-xl', 'p-4', '-m-4');
            setTimeout(() => {
               element.classList.remove('bg-primary/5', 'ring-2', 'ring-primary/20', 'rounded-xl', 'p-4', '-m-4');
            }, 3000);
        }, 500);
      }
    }
  }, [location, guideId]); // Run when location or guide changes
  
  let guide = null;
  let parentModule = modules.find(m => m.id === moduleId);

  if (parentModule) {
      guide = parentModule.guides.find(g => g.id === guideId);
  }

  const thumbnail = useVideoThumbnail(guide?.videoUrl, 2);

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
      {/* Back Link */}
      <Link 
        to={`/module/${parentModule.id}`}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 hover:bg-white text-sm font-medium text-slate-600 hover:text-primary transition-all shadow-sm ring-1 ring-slate-100 backdrop-blur-md"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {parentModule.title}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
            <div className="space-y-6 max-w-4xl">
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl md:text-5xl font-bold text-heading tracking-tight leading-[1.1]"
                >
                    {guide.title}
                </motion.h1>
                <div className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl">
                  <p>{guide.description}</p>
                </div>
            </div>

            {/* Video Player Container */}
            <motion.div 
                className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 ring-1 ring-black/5 bg-black aspecto-video group"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
                <video 
                    className="w-full aspect-video object-cover"
                    controls
                    poster={thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"}
                    src={guide.videoUrl}
                >
                    Your browser does not support the video tag.
                </video>
            </motion.div>
        </div>

        <div className="lg:col-span-1 lg:relative">
            <motion.div
                className="glass-panel rounded-3xl p-1 flex flex-col lg:absolute lg:inset-0 lg:h-full"
            >
                <div className="bg-white/50 rounded-[20px] p-6 backdrop-blur-sm flex-1 flex flex-col min-h-0">
                    <h3 className="font-bold text-heading mb-6 flex items-center justify-between flex-shrink-0">
                        <span>Instructions</span>
                        <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded-full">{guide.steps.length} Steps</span>
                    </h3>
                    
                    <div className="space-y-6 overflow-y-auto custom-scrollbar pr-2 flex-1 p-2">
                        {guide.steps.map((step, index) => (
                            <div key={index} id={`step-${index + 1}`} className="flex gap-4 group scroll-mt-28">
                                <div className="relative">
                                    <div className="w-8 h-8 rounded-full bg-white border-2 border-primary/20 text-primary flex items-center justify-center font-bold text-sm shadow-sm group-hover:border-primary group-hover:scale-110 transition-all z-10 relative">
                                        {index + 1}
                                    </div>
                                    {/* Vertical line connection */}
                                    {index !== guide.steps.length - 1 && (
                                        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-full bg-slate-200 group-hover:bg-primary/20 transition-colors" />
                                    )}
                                </div>
                                <div className="pt-1">
                                    <div 
                                        className="text-slate-600 text-sm font-medium leading-relaxed group-hover:text-slate-900 transition-colors [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-2 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-2 [&>p]:mb-1 [&_a]:text-blue-600 [&_a]:underline hover:[&_a]:text-blue-800"
                                        dangerouslySetInnerHTML={{ __html: step }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GuideDetail;
