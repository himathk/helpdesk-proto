import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useModules } from '../../context/ModuleContext';
import * as Icons from 'lucide-react';
import { ArrowLeft, Save, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminModuleForm = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { modules, addModule, updateModule } = useModules();
  
  const isEditing = !!moduleId;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    iconName: 'Box'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get all valid icon names from lucide-react, filtering out duplicates ending with 'Icon'
  const allIconNames = Object.keys(Icons).filter(key => {
    if (key === 'createLucideIcon' || key === 'default') return false;
    // Lucide exports both 'IconName' and 'IconNameIcon', we only want the former
    if (key.endsWith('Icon') && Icons[key.slice(0, -4)]) return false;
    return true;
  });
  
  // Filter icons based on search
  const filteredIcons = allIconNames.filter(name => 
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (isEditing) {
      const moduleToEdit = modules.find(m => m.id === moduleId);
      if (moduleToEdit) {
        setFormData({
          title: moduleToEdit.title,
          description: moduleToEdit.description,
          iconName: moduleToEdit.icon || 'Box' 
        });
      }
    }
  }, [isEditing, moduleId, modules]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network delay for effect
    await new Promise(resolve => setTimeout(resolve, 600));

    const moduleData = {
      title: formData.title,
      description: formData.description,
      icon: formData.iconName
    };

    if (isEditing) {
      updateModule(moduleId, moduleData);
    } else {
      addModule(moduleData);
    }
    navigate('/admin/modules');
  };



  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
         <div className="space-y-1">
             <Link to="/admin/modules" className="inline-flex items-center text-slate-400 hover:text-slate-900 transition-colors font-medium mb-2 group">
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Modules
             </Link>
             <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                {isEditing ? 'Edit Module' : 'Create New Module'}
             </h1>
             <p className="text-slate-500">
                {isEditing ? 'Update your helpdesk category details.' : 'Add a new category to your helpdesk.'}
             </p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-2 space-y-6">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8"
            >
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide ml-1">Module Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            placeholder="e.g. Getting Started"
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder-slate-400 font-medium text-lg text-slate-900"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide ml-1">Description</label>
                        <textarea
                            required
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Briefly describe what this module covers..."
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder-slate-400 font-medium text-slate-600 resize-none"
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide ml-1">Icon Selection</label>
                        </div>
                        
                        {/* Search Input - Detached and clean */}
                        <div className="relative group">
                            <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search Icons (e.g. user, shield, mail)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder-slate-300 font-medium text-slate-700"
                            />
                        </div>

                        {/* Icon Grid Container - Blue border style from reference */}
                        <div className="border border-blue-100 bg-white/50 rounded-2xl p-2 relative">
                            {/* Scrollable Icon Grid */}
                            <div className="max-h-64 overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
                                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-3 p-2">
                                    {filteredIcons.slice(0, 100).map(iconName => { 
                                        const Icon = Icons[iconName];
                                        if (!Icon) return null;
                                        
                                        const isSelected = formData.iconName === iconName;
                                        return (
                                        <button
                                            key={iconName}
                                            type="button"
                                            onClick={() => setFormData({...formData, iconName})}
                                            title={iconName}
                                            className={`relative p-3 rounded-xl flex items-center justify-center transition-all duration-200 aspect-square group ${
                                            isSelected
                                                ? 'text-white' 
                                                : 'bg-white border border-slate-200 text-slate-400 hover:border-primary/50 hover:text-primary hover:shadow-md'
                                            }`}
                                        >
                                            {/* Animated Background */}
                                            {isSelected && (
                                                <motion.div 
                                                    layoutId="icon-selection-bg"
                                                    className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/30 z-0" 
                                                    initial={false}
                                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                                />
                                            )}
                                            
                                            <Icon className="h-6 w-6 relative z-10" />
                                        </button>
                                        );
                                    })}
                                    {filteredIcons.length === 0 && (
                                        <div className="col-span-full py-12 text-center flex flex-col items-center text-slate-400 justify-center">
                                            <Icons.SearchX className="h-8 w-8 mb-2 opacity-50" />
                                            <p>No icons found for "{searchTerm}"</p>
                                        </div>
                                    )}
                                </div>
                            
                            {filteredIcons.length > 100 && (
                                    <div className="text-center py-4 text-xs font-medium text-slate-400">
                                        Showing top 100 matches...
                                    </div>
                            )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/modules')}
                            className="px-6 py-3 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-5 w-5" />
                                    {isEditing ? 'Save Changes' : 'Create Module'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-24">
                <div className="flex items-center gap-2 mb-4 text-sm font-bold text-slate-500 uppercase tracking-wide">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Live Preview
                </div>
                
                {/* Preview Card */}
                <div className="bg-white rounded-[2rem] border border-blue-50/50 shadow-xl shadow-blue-500/5 p-8 relative overflow-hidden group">
                    {/* Background Gradient Blob */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-400/20 transition-colors duration-500"></div>
                    
                    <div className="relative z-10 flex flex-col h-full">
                        {/* Icon Box */}
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                             {(() => {
                                const PreviewIcon = Icons[formData.iconName] || Icons.Box;
                                return <PreviewIcon className="h-8 w-8 text-primary" strokeWidth={1.5} />;
                            })()}
                        </div>

                        {/* Text Content */}
                        <div className="space-y-3 mb-8">
                            <h3 className="text-xl font-bold text-slate-900 leading-tight">
                                {formData.title || 'Policy Management'}
                            </h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                {formData.description ? (formData.description.length > 100 ? formData.description.substring(0, 100) + '...' : formData.description) : 'Learn how to create, update, and manage insurance policies efficiently.'}
                            </p>
                        </div>

                        {/* Footer Info */}
                        <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {/* Overlapping Guide Icons */}
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 border-2 border-white flex items-center justify-center text-primary-600">
                                        <Icons.PlayCircle className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-blue-50 border-2 border-white flex items-center justify-center text-primary-600">
                                         <Icons.PlayCircle className="h-4 w-4 text-primary" />
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-slate-400">2 Guides</span>
                            </div>
                            
                             {/* Arrow Button */}
                            <div className="w-10 h-10 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300">
                                <Icons.ArrowRight className="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50/50 border border-blue-100 rounded-xl text-sm text-blue-700/80">
                    <p><strong>Note:</strong> This is how the module will appear on the user dashboard. Make sure the title is concise and the description is helpful.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminModuleForm;
