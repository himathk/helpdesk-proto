import { useState, useEffect } from 'react';
import { X, Save, AlertCircle, CheckSquare, Square, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../../context/AdminContext';
// import { PERMISSIONS } from '../../data/permissions'; // Removed
import { modules } from '../../data/modules';

const RoleModal = ({ isOpen, onClose, roleToEdit = null }) => {
    const { addRole, updateRole } = useAdmin();
    
    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        permissions: [] // Array of permission keys
    });

    const [expandedCategories, setExpandedCategories] = useState(
        modules.reduce((acc, module) => ({ ...acc, [module.id]: true }), {})
    );

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Populate form on edit
    useEffect(() => {
        if (roleToEdit) {
            setFormData({
                name: roleToEdit.name || '',
                description: roleToEdit.description || '',
                permissions: roleToEdit.permissions || []
            });
        } else {
            setFormData({
                name: '',
                description: '',
                permissions: []
            });
        }
        setErrors({});
    }, [roleToEdit, isOpen]);

    if (!isOpen) return null;

    const togglePermission = (key) => {
        setFormData(prev => {
            const hasPermission = prev.permissions.includes(key);
            if (hasPermission) {
                return { ...prev, permissions: prev.permissions.filter(p => p !== key) };
            } else {
                return { ...prev, permissions: [...prev.permissions, key] };
            }
        });
    };

    const toggleExpand = (categoryKey) => {
        setExpandedCategories(prev => ({ ...prev, [categoryKey]: !prev[categoryKey] }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Role name is required';
        if (formData.permissions.length === 0) newErrors.permissions = 'Select at least one permission';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        
        setIsSubmitting(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            if (roleToEdit) {
                updateRole(roleToEdit.id, formData);
            } else {
                addRole(formData);
            }
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getTotalPermissionCount = () => formData.permissions.length;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            {roleToEdit ? 'Edit Role' : 'Create New Role'}
                        </h2>
                        <p className="text-sm text-slate-500">
                            Configure access levels and permissions.
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    <form id="role-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700">Role Name <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className={`w-full px-3 py-2 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.name ? 'border-red-300' : 'border-slate-200'}`}
                                    placeholder="e.g. Content Manager"
                                />
                                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700">Description</label>
                                <textarea 
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Describe what this role can do..."
                                    rows={2}
                                />
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                                    Permissions Matrix
                                </h3>
                                <span className="text-xs font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded-md">
                                    {getTotalPermissionCount()} Selected
                                </span>
                            </div>

                            {errors.permissions && <p className="text-xs text-red-500 mb-2">{errors.permissions}</p>}

                            <div className="space-y-2">
                                {modules.map((module) => {
                                    const categoryKey = module.id;
                                    const isExpanded = expandedCategories[categoryKey];
                                    
                                    // Generate permissions for this module
                                    // 1. View Module Permission (base)
                                    const viewModulePermission = `view:${module.id}`;
                                    
                                    // 2. Guide Permissions
                                    const guidePermissions = module.guides.map(guide => `view:${module.id}:${guide.id}`);
                                    
                                    const allModulePermissions = [viewModulePermission, ...guidePermissions];
                                    
                                    // Check selection state
                                    const selectedCount = allModulePermissions.filter(p => formData.permissions.includes(p)).length;
                                    const isAllSelected = selectedCount === allModulePermissions.length;
                                    const isPartiallySelected = selectedCount > 0 && !isAllSelected;

                                    // Toggle Logic
                                    const handleToggleCategory = () => {
                                        setFormData(prev => {
                                            if (isAllSelected) {
                                                // Deselect all
                                                return { 
                                                    ...prev, 
                                                    permissions: prev.permissions.filter(p => !allModulePermissions.includes(p)) 
                                                };
                                            } else {
                                                // Select all
                                                const otherPermissions = prev.permissions.filter(p => !allModulePermissions.includes(p));
                                                return { ...prev, permissions: [...otherPermissions, ...allModulePermissions] };
                                            }
                                        });
                                    };

                                    return (
                                        <div key={categoryKey} className="border border-slate-200 rounded-xl overflow-hidden">
                                            <div className="bg-slate-50 px-4 py-3 flex items-center justify-between cursor-pointer select-none" onClick={() => toggleExpand(categoryKey)}>
                                                <div className="flex items-center gap-3">
                                                    <button 
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); handleToggleCategory(); }}
                                                        className={`text-slate-400 hover:text-primary transition-colors`}
                                                    >
                                                        {isAllSelected ? (
                                                            <CheckSquare className="h-5 w-5 text-primary" />
                                                        ) : isPartiallySelected ? (
                                                            <div className="h-5 w-5 bg-primary relative rounded flex items-center justify-center">
                                                                <div className="w-3 h-0.5 bg-white rounded-full"></div>
                                                            </div>
                                                        ) : (
                                                            <Square className="h-5 w-5" />
                                                        )}
                                                    </button>
                                                    <span className="font-semibold text-slate-700">{module.title}</span>
                                                </div>
                                                <div className="text-slate-400">
                                                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                                </div>
                                            </div>

                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div 
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="p-4 bg-white border-t border-slate-100 space-y-3">
                                                            {/* Module Level Permission */}
                                                            <div 
                                                                className={`flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer border ${formData.permissions.includes(viewModulePermission) ? 'bg-blue-50 border-blue-100' : 'hover:bg-slate-50 border-transparent'}`}
                                                                onClick={() => togglePermission(viewModulePermission)}
                                                            >
                                                                <div className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${formData.permissions.includes(viewModulePermission) ? 'bg-primary border-primary' : 'border-slate-300 bg-white'}`}>
                                                                    {formData.permissions.includes(viewModulePermission) && <CheckSquare className="h-3 w-3 text-white" />}
                                                                </div>
                                                                <span className={`text-sm ${formData.permissions.includes(viewModulePermission) ? 'text-blue-700 font-medium' : 'text-slate-600'}`}>
                                                                    Access Entire Module
                                                                </span>
                                                            </div>

                                                            {/* Guide Level Permissions */}
                                                            {module.guides.length > 0 && (
                                                                <div className="pl-6 space-y-2 border-l-2 border-slate-100 ml-2">
                                                                    {module.guides.map(guide => {
                                                                        const permissionKey = `view:${module.id}:${guide.id}`;
                                                                        return (
                                                                            <div 
                                                                                key={guide.id} 
                                                                                className={`flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer border ${formData.permissions.includes(permissionKey) ? 'bg-blue-50 border-blue-100' : 'hover:bg-slate-50 border-transparent'}`}
                                                                                onClick={() => togglePermission(permissionKey)}
                                                                            >
                                                                                <div className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${formData.permissions.includes(permissionKey) ? 'bg-primary border-primary' : 'border-slate-300 bg-white'}`}>
                                                                                    {formData.permissions.includes(permissionKey) && <CheckSquare className="h-3 w-3 text-white" />}
                                                                                </div>
                                                                                <span className={`text-sm ${formData.permissions.includes(permissionKey) ? 'text-blue-700 font-medium' : 'text-slate-600'}`}>
                                                                                    {guide.title}
                                                                                </span>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}
                                                            
                                                            {module.guides.length === 0 && (
                                                                <p className="text-xs text-slate-400 italic pl-2">No specific guides available, only module access.</p>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </form>
                </div>

                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 rounded-b-2xl">
                    <button 
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-lg transition-colors text-sm"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        form="role-form"
                        className={`px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover shadow-lg shadow-primary/25 transition-all flex items-center gap-2 text-sm ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : (
                            <>
                                <Save className="h-4 w-4" />
                                {roleToEdit ? 'Save Role' : 'Create Role'}
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default RoleModal;
