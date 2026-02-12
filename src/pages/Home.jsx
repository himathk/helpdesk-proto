import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Star, TrendingUp, Clock, PlayCircle } from 'lucide-react';
import { modules as staticModules } from '../data/modules'; // Keep for structure ref if needed, but we replace usage
import { useModules } from '../context/ModuleContext';
import DynamicIcon from '../components/DynamicIcon';
import ThreeDHero from '../components/ThreeDHero';
import { Link, useLocation } from 'react-router-dom';

const Home = () => {
  const { modules } = useModules();
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();

  // Scroll to hash on mount or hash change
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  const filteredModules = modules.filter(module =>
    module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Flatten all guides for featured/new sections (Simulated selection)
  const allGuides = modules.flatMap(m => m.guides || []);
  
  // Select specific guides for Featured section
  const featuredGuides = allGuides.filter(g => ['geo-management', 'sub-zone-management'].includes(g.id));
  
  // Fallback if not found (e.g. during development/testing paths)
  if (featuredGuides.length === 0) {
      featuredGuides.push(...allGuides.slice(0, 2));
  }

  const newGuides = allGuides.slice(1, 3); // Take next 2 as new for demo

  return (
    <div className="space-y-20 pb-20">
      {/* Hero */}
      <section className="text-center space-y-8 py-10 relative overflow-hidden">
        {/* Background Decorative Elements */}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto px-4">
            <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
                 <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/50 text-blue-700 text-sm font-medium border border-blue-200"
                >
                    <Star className="h-3.5 w-3.5 fill-secondary" />
                    <span>New Guide: AI Claims Processing</span>
                </motion.div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-heading">
                Master your <br/>
                <span className="text-gradient">Insurance Platform</span>
                </h1>
                
                <p className="text-xl text-slate-600 max-w-2xl leading-relaxed">
                Expert guides, video tutorials, and step-by-step walkthroughs to help you navigate and succeed.
                </p>

                <div className="w-full max-w-lg relative group">
                <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative glass-panel rounded-2xl p-2 flex items-center transition-transform transform group-hover:scale-[1.01] duration-300">
                    <Search className="h-6 w-6 text-slate-400 ml-4" />
                    <input
                    type="text"
                    className="w-full bg-transparent border-none focus:ring-0 text-lg px-4 py-3 text-slate-900 placeholder-slate-400"
                    placeholder="Search for modules or guides..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        if(!window.location.hash.includes('modules') && e.target.value) {
                            // Optional: scroll to modules if searching
                            const el = document.getElementById('modules');
                            if(el) el.scrollIntoView({ behavior: 'smooth' });
                        }
                    }}
                    />
                </div>
                </div>
            </div>

            <div className="order-1 lg:order-2 h-[400px] flex items-center justify-center relative">
                 <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                 <ThreeDHero />
            </div>
        </div>
      </section>

      {/* Featured Videos */}
      <section id="featured" className="scroll-mt-28">
        <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-3xl font-bold text-heading flex items-center gap-3">
                <Star className="h-7 w-7 text-secondary fill-secondary" />
                Featured Videos
            </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredGuides.map((guide) => (
                <div key={guide.id} className="glass-card p-6 rounded-3xl flex flex-col gap-4 group hover:bg-white/80 transition-all">
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-xl transition-all">
                        <video 
                            src={guide.videoUrl} 
                            className="absolute inset-0 w-full h-full object-cover"
                            autoPlay 
                            muted 
                            loop 
                            playsInline
                        />
                        {/* Overlay removed to keep 'hovered' look (bright/active) as default */}
                        
                        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md p-2 rounded-full text-white">
                             <PlayCircle className="h-5 w-5" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-heading group-hover:text-primary transition-colors">{guide.title}</h3>
                        <p className="text-slate-500 mt-2 line-clamp-2">{guide.description}</p>
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* Newly Added */}
      <section id="new" className="scroll-mt-28">
         <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-3xl font-bold text-heading flex items-center gap-3">
                <Clock className="h-7 w-7 text-primary" />
                Newly Added
            </h2>
        </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newGuides.map((guide) => (
                <Link to={`/module/policy-management`} key={guide.id} className="block group"> 
                {/* Note: In real app link to specific guide/module */}
                    <div className="glass-card p-5 rounded-2xl h-full hover:bg-white/90 transition-all border border-slate-100 hover:border-blue-100">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                                <PlayCircle className="h-6 w-6" />
                            </div>
                            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">New</span>
                        </div>
                        <h3 className="font-bold text-lg text-heading mb-2 group-hover:text-primary transition-colors">{guide.title}</h3>
                        <p className="text-sm text-slate-500 line-clamp-2">{guide.description}</p>
                    </div>
                </Link>
            ))}
        </div>
      </section>
      
      {/* All Modules */}
      <section id="modules" className="scroll-mt-28">
        <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-3xl font-bold text-heading flex items-center gap-3">
                <TrendingUp className="h-7 w-7 text-primary" />
                All Modules
            </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredModules.map((module, index) => {
             return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/module/${module.id}`} className="block h-full">
                  <div className="h-full glass-card rounded-3xl p-8 relative overflow-hidden group flex flex-col items-start bg-white hover:bg-white/90 transition-colors border border-slate-100/50 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5">
                    <div className="absolute -right-10 -top-10 bg-linear-to-br from-primary/20 to-secondary/20 rounded-full opacity-50 blur-2xl w-48 h-48 group-hover:scale-125 transition-transform duration-500 pointer-events-none"></div>
                    
                    <div className="relative z-10 bg-white shadow-sm ring-1 ring-slate-100 p-4 rounded-2xl mb-6 group-hover:-translate-y-1 transition-transform">
                        <DynamicIcon name={module.icon} className="h-8 w-8 text-primary" />
                    </div>

                    <h3 className="text-xl font-bold text-heading mb-4 group-hover:text-primary transition-colors z-10">
                        {module.title}
                    </h3>
                    
                    <p className="text-slate-500 mb-8 flex-grow leading-relaxed z-10 text-base">
                        {module.description}
                    </p>

                    <div className="flex items-center justify-between w-full mt-auto z-10">
                        <div className="flex items-center gap-2">
                           <div className="flex -space-x-2">
                                {[...Array(Math.min(3, module.guides?.length || 0))].map((_, i) => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-primary/10 flex items-center justify-center">
                                        <PlayCircle className="h-4 w-4 text-primary" />
                                    </div>
                                ))}
                            </div>
                            {(module.guides?.length || 0) > 0 && (
                                <span className="text-sm font-medium text-slate-500 pl-2">{module.guides.length} {module.guides.length === 1 ? 'Guide' : 'Guides'}</span>
                            )}
                        </div>
                        
                        <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-45">
                             <ArrowRight className="h-5 w-5" />
                        </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
             );
          })}
        </div>
      </section>
    </div>
  );
};

export default Home;
