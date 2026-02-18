import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useModules } from '../../context/ModuleContext';
import { Trash, Plus, ArrowLeft, Save, Loader2, PlayCircle, GripVertical } from 'lucide-react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';

// Extracted Step Item Component for Drag Controls
import Editor, { BtnBold, BtnItalic, BtnBulletList, BtnNumberedList, BtnLink, Toolbar, Separator } from 'react-simple-wysiwyg';

// ... (existing imports)

const StepItem = ({ step, index, handleStepChange, removeStep }) => {
    const controls = useDragControls();

    return (
        <Reorder.Item 
            value={step}
            dragListener={false}
            dragControls={controls}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -10, height: 0 }}
            className="group relative flex gap-4 transition-all duration-300"
        >
            {/* Step Number Node - Transparent wrapper to show line */}
            <div className="flex-none relative py-3">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-200 text-slate-400 flex items-center justify-center text-sm font-bold group-hover:border-primary group-hover:text-primary group-hover:scale-110 transition-all shadow-sm z-10 relative">
                    {index + 1}
                </div>
            </div>

            {/* Content Card */}
            <div className="flex-1">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl group-hover:border-primary/30 group-hover:shadow-md group-hover:bg-white transition-all flex gap-3 items-start overflow-hidden">
                    {/* Drag Handle - Only this initiates drag */}
                    <div 
                        className="p-4 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing touch-none self-stretch flex items-center bg-slate-100/50 border-r border-slate-100"
                        onPointerDown={(e) => controls.start(e)}
                    >
                        <GripVertical className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0 pr-2 py-2">
                         <Editor
                            value={step.content} 
                            onChange={(e) => handleStepChange(step.id, e.target.value)}
                            placeholder={`Describe step ${index + 1}...`}
                            containerProps={{ style: { border: 'none', background: 'transparent', minHeight: '80px' } }}
                         >
                            <Toolbar>
                                <BtnBold />
                                <BtnItalic />
                                <Separator />
                                <BtnBulletList />
                                <BtnNumberedList />
                                <Separator />
                                <BtnLink />
                            </Toolbar>
                         </Editor>
                         <style>{`
                            .rsw-toolbar { background: transparent !important; margin-bottom: 0.5rem !important; }
                            .rsw-btn { color: #64748b !important; }
                            .rsw-btn:hover { background: #e2e8f0 !important; color: #0f172a !important; }
                            .rsw-btn[data-active="true"] { background: #e0e7ff !important; color: #4f46e5 !important; }
                            .rsw-editor { min-height: 80px; outline: none !important; font-size: 0.875rem; color: #334155; }
                            .rsw-ce { min-height: 80px; }
                            /* Fix for list styles inside editor */
                            .rsw-editor ul { list-style-type: disc !important; padding-left: 1.5rem !important; margin-bottom: 0.5rem; }
                            .rsw-editor ol { list-style-type: decimal !important; padding-left: 1.5rem !important; margin-bottom: 0.5rem; }
                         `}</style>
                    </div>

                    <button
                        type="button"
                        onClick={() => removeStep(step.id)}
                        className="m-2 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all self-start"
                        title="Remove Step"
                    >
                        <Trash className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </Reorder.Item>
    );
};

const AdminGuideForm = () => {
  const { moduleId, guideId } = useParams();
  const navigate = useNavigate();
  const { modules, addGuide, updateGuide } = useModules();
  
  const isEditing = !!guideId;
  const module = modules.find(m => m.id === moduleId);
  
  // Local state for steps with unique IDs for framer-motion Reorder
  const [steps, setSteps] = useState([{ id: '1', content: '' }]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing && module) {
      const guideToEdit = module.guides?.find(g => g.id === guideId);
      if (guideToEdit) {
        setFormData({
          title: guideToEdit.title,
          description: guideToEdit.description,
          videoUrl: guideToEdit.videoUrl || ''
        });
        
        // Convert string steps to object steps with IDs
        if (guideToEdit.steps?.length) {
            setSteps(guideToEdit.steps.map((step, index) => ({
                id: `step-${index}-${Math.random().toString(36).substr(2, 9)}`,
                content: step
            })));
        }
      }
    }
  }, [isEditing, moduleId, guideId, module]);

  if (!module) return <div>Module not found</div>;

  const handleStepChange = (id, newContent) => {
    setSteps(steps.map(step => 
        step.id === id ? { ...step, content: newContent } : step
    ));
  };

  const addStep = () => {
    setSteps([...steps, { id: `new-${Date.now()}`, content: '' }]);
  };

  const removeStep = (id) => {
    setSteps(steps.filter(step => step.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 600));

    const guideData = {
      ...formData,
      steps: steps.map(s => s.content).filter(content => content.trim() !== '')
    };

    if (isEditing) {
      updateGuide(moduleId, guideId, guideData);
    } else {
      addGuide(moduleId, guideData);
    }
    navigate(`/admin/modules/${moduleId}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <div className="space-y-1">
             <Link to={`/admin/modules/${moduleId}`} className="inline-flex items-center text-slate-400 hover:text-slate-900 transition-colors font-medium mb-2 group">
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to {module.title}
             </Link>
             <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                {isEditing ? 'Edit Guide' : 'Add New Guide'}
             </h1>
             <p className="text-slate-500">
                Create comprehensive step-by-step instructions.
             </p>
         </div>
         
         <div className="flex items-center gap-3">
            <button
                type="button"
                onClick={() => navigate(`/admin/modules/${moduleId}`)}
                className="px-6 py-3 rounded-xl text-slate-600 font-medium hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all"
            >
                Cancel
            </button>
            <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                {isEditing ? 'Save Changes' : 'Publish Guide'}
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Details & Video */}
        <div className="lg:col-span-5 space-y-6">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8 space-y-6 sticky top-24"
            >
                <div>
                    <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">01</span>
                        Basic Details
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Title</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                placeholder="e.g. How to Reset Password"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Description</label>
                            <textarea
                                required
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                placeholder="Brief overview of this guide..."
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium resize-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                         <span className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-sm">02</span>
                        Video Content
                    </h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Video URL (Optional)</label>
                            <div className="relative">
                                <PlayCircle className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input
                                    type="url"
                                    value={formData.videoUrl}
                                    onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                                    placeholder="https://example.com/video.mp4"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all font-medium"
                                />
                            </div>
                        </div>

                        {formData.videoUrl ? (
                            <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-lg shadow-slate-200">
                                <video 
                                    src={formData.videoUrl} 
                                    className="w-full h-full object-cover"
                                    controls
                                />
                            </div>
                        ) : (
                            <div className="aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 gap-2">
                                <PlayCircle className="h-8 w-8 opacity-50" />
                                <span className="text-sm font-medium">No video added</span>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>

        {/* Right Column: Steps */}
        <div className="lg:col-span-7 space-y-6">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8 min-h-[600px]"
            >
                 <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">03</span>
                        Instructions
                    </h2>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{steps.length} Steps</span>
                 </div>

                 <div className="relative">
                    {/* Connecting Line - Positioned to align with dot centers */}
                    <div className="absolute left-[19px] top-4 bottom-6 w-0.5 bg-slate-200 z-0"></div>

                    <Reorder.Group axis="y" values={steps} onReorder={setSteps} className="space-y-6 relative z-10">
                        {steps.map((step, index) => (
                            <StepItem 
                                key={step.id} 
                                step={step} 
                                index={index}
                                handleStepChange={handleStepChange}
                                removeStep={removeStep}
                            />
                        ))}
                    </Reorder.Group>
                 </div>

                 <motion.button
                    layout
                    type="button"
                    onClick={addStep}
                    className="mt-6 ml-14 w-[calc(100%-3.5rem)] py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all font-bold flex items-center justify-center gap-2 text-sm"
                >
                    <Plus className="h-4 w-4" />
                    Add Next Step
                </motion.button>
            </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminGuideForm;
