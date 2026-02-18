import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Star, TrendingUp, Clock, PlayCircle, X, ChevronRight, FileText, Layers, Shield } from 'lucide-react';
import { useModules } from '../context/ModuleContext';
import DynamicIcon from '../components/DynamicIcon';
import CardSwap, { Card } from '../components/CardSwap';
import { Link, useLocation } from 'react-router-dom';

const Home = () => {
  const { modules } = useModules();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const location = useLocation();
  const searchContainerRef = useRef(null);
  
  const [heroTextIndex, setHeroTextIndex] = useState(0);
  const heroPhrases = ["Insurance Platform", "Claims Workflow", "Policy Engine", "Receipt Workflow"];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroTextIndex((prev) => (prev + 1) % heroPhrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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

  // Click outside to close search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        if (!searchTerm) {
             setIsSearchFocused(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchTerm]);


  const filteredModules = modules.filter(module =>
    module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Search Logic with "Exactly Where" context
  const getSearchResults = (term) => {
      if (!term.trim()) return [];
      const lowerTerm = term.toLowerCase();
      const results = [];

      modules.forEach(module => {
          // 1. Match Module
          if (module.title.toLowerCase().includes(lowerTerm) || module.description.toLowerCase().includes(lowerTerm)) {
              results.push({
                  type: 'module',
                  id: module.id,
                  title: module.title,
                  description: module.description,
                  icon: module.icon,
                  matchContext: 'Module'
              });
          }

          // 2. Match Guides & Steps
          module.guides?.forEach(guide => {
               // Match Guide Title/Desc
               if (guide.title.toLowerCase().includes(lowerTerm) || guide.description.toLowerCase().includes(lowerTerm)) {
                   results.push({
                       type: 'guide',
                       id: guide.id,
                       moduleId: module.id,
                       title: guide.title,
                       description: guide.description, // Use guide description
                       breadcrumb: module.title,
                       matchContext: 'Guide'
                   });
               }

               // Match Steps
               guide.steps?.forEach((step, index) => {
                   if (step.toLowerCase().includes(lowerTerm)) {
                       // Avoid duplicates if we already added this guide (optional, but "exactly where" implies specificity)
                       // Let's allow specific step matches even if guide matches, or maybe just list it as a deep link?
                       // For now, let's treat it as a unique result pointing to the specific context
                       results.push({
                           type: 'step',
                           id: guide.id, // Link to guide
                           moduleId: module.id,
                           title: guide.title,
                           description: step, // Show the step content
                           breadcrumb: `${module.title} > ${guide.title}`,
                           matchContext: `Step ${index + 1}`,
                           stepIndex: index + 1
                       });
                   }
               });
          });
      });
      return results;
  };

  const searchResults = getSearchResults(searchTerm);

  // Flatten all guides for featured/new sections
  const allGuides = modules.flatMap(m => m.guides || []);
  
  // Select specific guides for Featured section
  const featuredGuides = allGuides.filter(g => ['geo-management', 'sub-zone-management'].includes(g.id));
  
  // Fallback if not found
  if (featuredGuides.length === 0) {
      featuredGuides.push(...allGuides.slice(0, 2));
  }

  const newGuides = allGuides.slice(1, 3); 

  return (
    <div className="space-y-20 pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden transition-all duration-500 ease-in-out min-h-[600px] flex flex-col justify-center">
        {/* Background Decorative Elements */}
        
        <div className="max-w-7xl mx-auto px-4 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="order-2 lg:order-1 flex flex-col space-y-8 items-center lg:items-start text-center lg:text-left">
                
                {/* Intro Content */}
                <div className="flex flex-col items-center lg:items-start gap-8 w-full">
                             <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/50 text-blue-700 text-sm font-medium border border-blue-200 self-center lg:self-start"
                            >
                                <Star className="h-3.5 w-3.5 fill-secondary" />
                                <span>New Guide: AI Claims Processing</span>
                            </motion.div>

                            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-heading">
                            Master your <br/>
                            <div className="h-[1.2em] relative overflow-hidden inline-block min-w-[700px] text-left">
                                <AnimatePresence mode="popLayout">
                                    <motion.span 
                                        key={heroTextIndex}
                                        initial={{ y: 50, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -50, opacity: 0 }}
                                        transition={{ duration: 0.5, ease: "backOut" }}
                                        className="text-gradient absolute top-0 left-0 whitespace-nowrap"
                                    >
                                        {heroPhrases[heroTextIndex]}
                                    </motion.span>
                                </AnimatePresence>
                            </div>
                            </h1>
                            
                            <p className="text-xl text-slate-600 max-w-2xl leading-relaxed">
                            Expert guides, video tutorials, and step-by-step walkthroughs to help you navigate and succeed.
                            </p>
                </div>

                {/* Search Bar Container */}
                <div className={`w-full relative group z-30 transition-all duration-300 ${isSearchFocused ? 'max-w-xl' : 'max-w-lg'}`}>
                    <div className={`absolute inset-0 bg-primary/30 rounded-2xl blur-xl transition-opacity duration-300 ${isSearchFocused ? 'opacity-40' : 'opacity-20 group-hover:opacity-30'}`}></div>
                    <div 
                        className={`
                            relative glass-panel rounded-2xl flex items-center transition-all duration-300
                            ${isSearchFocused ? 'p-4 shadow-2xl ring-2 ring-primary/20 bg-white' : 'p-2 group-hover:scale-[1.01]'}
                        `}
                    >
                        <Search className={`h-6 w-6 ml-4 transition-colors ${isSearchFocused ? 'text-primary' : 'text-slate-400'}`} />
                        <input
                            type="text"
                            className="w-full bg-transparent border-none focus:ring-0 text-lg px-4 py-3 text-slate-900 placeholder-slate-400"
                            placeholder={isSearchFocused ? "Search for guides, steps, or modules..." : "Search for modules or guides..."}
                            value={searchTerm}
                            onFocus={() => setIsSearchFocused(true)}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {isSearchFocused && (
                            <button 
                                onClick={() => {
                                    setSearchTerm('');
                                    if(!searchTerm) setIsSearchFocused(false);
                                }}
                                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 mr-2"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>

                    {/* Search Results Dropdown */}
                    <AnimatePresence>
                        {isSearchFocused && searchTerm && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                                className="absolute top-full left-0 right-0 mt-4 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden z-20 max-h-[60vh] overflow-y-auto custom-scrollbar"
                            >
                                {searchResults.length > 0 ? (
                                    <div className="p-2">
                                        <div className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                            Found {searchResults.length} results
                                        </div>
                                        {searchResults.map((result, idx) => (
                                            <Link 
                                                to={
                                                    result.type === 'module' ? `/module/${result.id}` : 
                                                    result.type === 'step' ? `/module/${result.moduleId}/${result.id}#step-${result.stepIndex}` :
                                                    `/module/${result.moduleId}/${result.id}`
                                                }
                                                key={idx}
                                                className="block"
                                                onClick={() => setIsSearchFocused(false)} // Close on select
                                            >
                                                <div className="p-4 hover:bg-slate-50 rounded-xl transition-colors group cursor-pointer border border-transparent hover:border-slate-100">
                                                    <div className="flex items-start gap-4">
                                                        <div className="mt-1 h-8 w-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                            {result.type === 'module' ? <Layers className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h4 className="font-semibold text-heading group-hover:text-primary transition-colors">
                                                                    {result.title}
                                                                </h4>
                                                                {result.matchContext && (
                                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                                                                        {result.matchContext}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            
                                                            {result.breadcrumb && (
                                                                <div className="flex items-center gap-1 text-xs text-slate-400 mb-1">
                                                                    <span>{result.breadcrumb}</span>
                                                                </div>
                                                            )}
                                                            
                                                            <p className="text-sm text-slate-500 line-clamp-1">
                                                                {result.description}
                                                            </p>
                                                        </div>
                                                        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-slate-500">
                                        <p>No results found for "{searchTerm}"</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                     {/* Suggestions when focused but no term */}
                     <AnimatePresence>
                        {isSearchFocused && !searchTerm && (
                             <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ delay: 0.1 }}
                                className="absolute top-full left-0 right-0 mt-4 z-20"
                             >
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {['Policies', 'Claims', 'Users', 'Geo'].map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => setSearchTerm(tag)}
                                            className="px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-600 text-sm hover:bg-white hover:border-primary/30 hover:text-primary transition-colors shadow-sm"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                             </motion.div>
                        )}
                     </AnimatePresence>
                </div>
            </div>

            {/* Right Side */}
             <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="order-1 lg:order-2 hidden lg:flex h-[500px] items-center justify-center relative w-full perspective-1000"
            >
                         <div className="relative w-full h-[500px] flex items-center justify-center">
                             <CardSwap
                                cardDistance={40}
                                verticalDistance={30}
                                delay={4000}
                                skewAmount={2}
                                width={450}
                                height={280}
                            >
                                <Card customClass="flex flex-col rounded-2xl border border-blue-100 bg-white shadow-2xl cursor-pointer group ring-1 ring-blue-50/50">
                                     {/* Window Header */}
                                    <div className="h-10 border-b border-slate-100 flex items-center px-4 space-x-3 bg-slate-50/80 backdrop-blur-sm shrink-0 rounded-t-2xl">
                                        <div className="flex space-x-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-400 group-hover:bg-red-500 transition-colors" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 group-hover:bg-amber-500 transition-colors" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-400 group-hover:bg-green-500 transition-colors" />
                                        </div>
                                        <Shield className="w-3.5 h-3.5 text-slate-400 ml-2" />
                                        <span className="text-xs font-medium text-slate-600 tracking-wide font-sans">Geo_Management_Overview.mp4</span>
                                    </div>
                                    {/* Window Body */}
                                    <div className="relative flex-1 w-full bg-white flex items-center justify-center overflow-hidden">
                                        <video 
                                            src="/Geo Management (1).mp4" 
                                            autoPlay 
                                            muted 
                                            loop 
                                            playsInline 
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                </Card>

                                <Card customClass="flex flex-col rounded-2xl border border-blue-100 bg-white shadow-2xl cursor-pointer group ring-1 ring-blue-50/50">
                                    <div className="h-10 border-b border-slate-100 flex items-center px-4 space-x-3 bg-slate-50/80 backdrop-blur-sm shrink-0 rounded-t-2xl">
                                         <div className="flex space-x-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-white/20 group-hover:bg-red-500/50 transition-colors" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-white/10 group-hover:bg-yellow-500/50 transition-colors" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-white/10 group-hover:bg-green-500/50 transition-colors" />
                                        </div>
                                        <FileText className="w-3.5 h-3.5 text-white/40 ml-2" />
                                        <span className="text-xs font-medium text-slate-600 tracking-wide font-sans">Sub_Zone_Config.mp4</span>
                                    </div>
                                    <div className="relative flex-1 w-full bg-white flex items-center justify-center overflow-hidden rounded-b-2xl">
                                        <video 
                                            src="/Geo management - Manage Sub Zones (1).mp4" 
                                            autoPlay 
                                            muted 
                                            loop 
                                            playsInline 
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                </Card>

                                <Card customClass="flex flex-col rounded-2xl border border-blue-100 bg-white shadow-2xl cursor-pointer group ring-1 ring-blue-50/50">
                                    <div className="h-10 border-b border-slate-100 flex items-center px-4 space-x-3 bg-slate-50/80 backdrop-blur-sm shrink-0 rounded-t-2xl">
                                         <div className="flex space-x-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-white/20 group-hover:bg-red-500/50 transition-colors" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-white/10 group-hover:bg-yellow-500/50 transition-colors" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-white/10 group-hover:bg-green-500/50 transition-colors" />
                                        </div>
                                        <TrendingUp className="w-3.5 h-3.5 text-white/40 ml-2" />
                                        <span className="text-xs font-medium text-slate-600 tracking-wide font-sans">Analytics_Walkthrough.mp4</span>
                                    </div>
                                    <div className="relative flex-1 w-full bg-white flex items-center justify-center overflow-hidden rounded-b-2xl">
                                        {/* Reusing video #1 for variety */}
                                        <video 
                                            src="/Geo Management (1).mp4" 
                                            autoPlay 
                                            muted 
                                            loop 
                                            playsInline 
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                </Card>
                                
                                <Card customClass="flex flex-col rounded-2xl border border-blue-100 bg-white shadow-2xl cursor-pointer group ring-1 ring-blue-50/50">
                                    <div className="h-10 border-b border-slate-100 flex items-center px-4 space-x-3 bg-slate-50/80 backdrop-blur-sm shrink-0 rounded-t-2xl">
                                         <div className="flex space-x-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-white/20 group-hover:bg-red-500/50 transition-colors" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-white/10 group-hover:bg-yellow-500/50 transition-colors" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-white/10 group-hover:bg-green-500/50 transition-colors" />
                                        </div>
                                        <Star className="w-3.5 h-3.5 text-white/40 ml-2" />
                                        <span className="text-xs font-medium text-slate-600 tracking-wide font-sans">Feature_Highlight.mp4</span>
                                    </div>
                                    <div className="relative flex-1 w-full bg-white flex items-center justify-center overflow-hidden rounded-b-2xl">
                                        {/* Reusing video #2 for variety */}
                                        <video 
                                            src="/Geo management - Manage Sub Zones (1).mp4" 
                                            autoPlay 
                                            muted 
                                            loop 
                                            playsInline 
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                </Card>
                            </CardSwap>
                        </div>
                    </motion.div>
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
                        {module.description.length > 100 ? module.description.substring(0, 100) + '...' : module.description}
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
