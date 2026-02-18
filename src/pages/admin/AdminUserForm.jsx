import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { 
    ChevronLeft, Save, Upload, Eye, EyeOff, User, 
    Shield, Building, Mail, Phone, Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdminUserForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { users, roles, addUser, updateUser } = useAdmin();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        department: '',
        roleId: 'viewer', // default
        status: 'active',
        portal: 'admin', // 'admin' or 'helpdesk'
        password: '',
        avatar: null, // Stores data URL or file object
        notes: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            const user = users.find(u => u.id === id);
            if (user) {
                setFormData({
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    company: user.company || '',
                    department: user.department || '',
                    roleId: user.roleId || 'viewer',
                    status: user.status || 'active',
                    portal: user.portal || (user.role?.isSystem ? 'admin' : 'helpdesk'), // Infer if not set
                    password: '', // Don't show existing password
                    avatar: user.avatar || null,
                    notes: user.notes || ''
                });
                setPreviewUrl(user.avatar);
            }
        }
    }, [id, users, isEditMode]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, avatar: reader.result }));
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
             newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
             newErrors.email = 'Invalid email format';
        }

        if (!isEditMode && !formData.password) {
            newErrors.password = 'Password is required for new users';
        }

        if (formData.password && formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        
        setIsSubmitting(true);
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            if (isEditMode) {
                updateUser(id, formData);
            } else {
                addUser(formData);
            }
            navigate('/admin/users');
        } catch (error) {
            console.error('Failed to save user', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Filter roles based on portal selection
    const availableRoles = roles.filter(role => {
        if (formData.portal === 'admin') {
            return role.id !== 'customer'; // Show everything except customer
        } else {
            return role.id === 'customer'; // Only show customer role
        }
    });

    // Auto-select first available role when portal changes
    const handlePortalChange = (portal) => {
        const newRoles = roles.filter(role => {
            if (portal === 'admin') return role.id !== 'customer';
            return role.id === 'customer';
        });
        
        setFormData(prev => ({
            ...prev, 
            portal,
            roleId: newRoles.length > 0 ? newRoles[0].id : ''
        }));
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link 
                    to="/admin/users" 
                    className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 transition-colors"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {isEditMode ? 'Edit User' : 'Create New User'}
                    </h1>
                    <p className="text-slate-500">
                        {isEditMode ? 'Update user details, permissions, and settings.' : 'Onboard a new user to the system.'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
                {/* Details Form */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-8 pb-2 border-b border-slate-100">
                            Personal Information
                        </h3>

                        {/* Centered Avatar Upload */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative inline-block mb-3">
                                <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-lg mx-auto group">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover transition-opacity group-hover:opacity-75" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <User className="h-12 w-12" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Upload className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                                <label className="absolute bottom-1 right-1 p-2 bg-primary text-white rounded-full cursor-pointer hover:bg-primary-hover shadow-md transition-all hover:scale-105">
                                    <Upload className="h-3.5 w-3.5" />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                </label>
                            </div>
                            <p className="text-xs text-slate-400 font-medium">Click to upload profile photo</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700">First Name <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                    className={`w-full px-3 py-2 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.firstName ? 'border-red-300' : 'border-slate-200'}`}
                                    placeholder="John"
                                />
                                {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
                            </div>
                            
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700">Last Name <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                    className={`w-full px-3 py-2 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.lastName ? 'border-red-300' : 'border-slate-200'}`}
                                    placeholder="Doe"
                                />
                                {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
                            </div>

                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-sm font-semibold text-slate-700">Email Address <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input 
                                        type="email" 
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className={`w-full pl-10 pr-3 py-2 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.email ? 'border-red-300' : 'border-slate-200'}`}
                                        placeholder="john.doe@company.com"
                                    />
                                </div>
                                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700">Phone (Optional)</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input 
                                        type="tel" 
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-sm font-semibold text-slate-700">Portal Access</label>
                                <div className="flex items-center gap-6 mt-1">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="portal" 
                                            value="admin" 
                                            checked={formData.portal === 'admin'}
                                            onChange={() => handlePortalChange('admin')}
                                            className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                                        />
                                        <span className="text-sm text-slate-700 font-medium">Admin Portal</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="portal" 
                                            value="helpdesk" 
                                            checked={formData.portal === 'helpdesk'}
                                            onChange={() => handlePortalChange('helpdesk')}
                                            className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                                        />
                                        <span className="text-sm text-slate-700 font-medium">Customer Portal</span>
                                    </label>
                                </div>
                            </div>
                            
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-sm font-semibold text-slate-700">Role</label>
                                <select 
                                    value={formData.roleId}
                                    onChange={(e) => setFormData({...formData, roleId: e.target.value})}
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    {availableRoles.map(role => (
                                        <option key={role.id} value={role.id}>{role.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Organization & Security */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-6 pb-2 border-b border-slate-100">
                            Organization & Security
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700">Company</label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input 
                                        type="text" 
                                        value={formData.company}
                                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                                        className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="Acme Corp"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700">Department</label>
                                <input 
                                    type="text" 
                                    value={formData.department}
                                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Engineering"
                                />
                            </div>

                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-sm font-semibold text-slate-700">
                                    {isEditMode ? 'New Password (Optional)' : 'Password'} <span className={isEditMode ? '' : 'text-red-500'}>*</span>
                                </label>
                                <div className="relative">
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        className={`w-full px-3 py-2 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.password ? 'border-red-300' : 'border-slate-200'}`}
                                        placeholder={isEditMode ? "Leave blank to keep current" : "Create a password"}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                            </div>

                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-sm font-semibold text-slate-700">Account Status</label>
                                <div className="flex items-center gap-6 mt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="status"
                                            value="active"
                                            checked={formData.status === 'active'}
                                            onChange={() => setFormData({...formData, status: 'active'})}
                                            className="w-4 h-4 text-emerald-500 focus:ring-emerald-500 border-gray-300"
                                        />
                                        <span className="text-sm text-slate-700">Active</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="status"
                                            value="inactive"
                                            checked={formData.status === 'inactive'}
                                            onChange={() => setFormData({...formData, status: 'inactive'})}
                                            className="w-4 h-4 text-slate-500 focus:ring-slate-500 border-gray-300"
                                        />
                                        <span className="text-sm text-slate-700">Inactive</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4">
                        <Link 
                            to="/admin/users"
                            className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </Link>
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-8 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover shadow-lg shadow-primary/25 transition-all flex items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? 'Saving...' : (
                                <>
                                    <Save className="h-4 w-4" />
                                    {isEditMode ? 'Update User' : 'Create User'}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AdminUserForm;
