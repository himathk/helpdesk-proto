import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Shield, Edit, Trash2, Plus, Users, Search, Copy } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import RoleModal from '../../components/admin/RoleModal';

const AdminRoleList = () => {
    const { roles, deleteRole, addRole } = useAdmin(); // addRole needed for duplication logic
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [roleToEdit, setRoleToEdit] = useState(null);

    const filteredRoles = roles.filter(role => 
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = () => {
        setRoleToEdit(null);
        setIsModalOpen(true);
    };

    const handleEdit = (role) => {
        setRoleToEdit(role);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this role? This might affect users assigned to it.')) {
            deleteRole(id);
        }
    };

    const handleDuplicate = (role) => {
        const newRole = {
            ...role,
            name: `${role.name} (Copy)`,
            isSystem: false,
            userCount: 0
        };
        // We use the modal to "finish" the duplication so user can rename it immediately
        setRoleToEdit(newRole);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
             <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative flex-1 w-full md:w-auto md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search roles..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>
                
                <button 
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20"
                >
                    <Shield className="h-4 w-4" />
                    <span className="hidden sm:inline">New Role</span>
                </button>
            </div>

            {/* Role List Table */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-xs uppercase text-slate-500 font-bold tracking-wider">
                                <th className="p-4">Role Name</th>
                                <th className="p-4">Description</th>
                                <th className="p-4">Users</th>
                                <th className="p-4">Permissions</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredRoles.map(role => (
                                <tr key={role.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${role.isSystem ? 'bg-slate-100 text-slate-500' : 'bg-blue-50 text-primary'}`}>
                                                <Shield className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900">
                                                    {role.name}
                                                    {role.isSystem && (
                                                        <span className="ml-2 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                                                            System
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-slate-500 max-w-xs truncate">
                                        {role.description}
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 text-slate-600 text-xs font-medium border border-slate-200">
                                            <Users className="h-3 w-3" />
                                            {role.userCount}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 text-slate-600 text-xs font-medium border border-slate-200">
                                            <Shield className="h-3 w-3" />
                                            {role.permissions?.length || (role.isSystem ? 'All' : 0)}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleDuplicate(role)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Duplicate Role"
                                            >
                                                <Copy className="h-4 w-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleEdit(role)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            {!role.isSystem && (
                                                <button 
                                                    onClick={() => handleDelete(role.id)}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <RoleModal 
                        isOpen={isModalOpen} 
                        onClose={() => setIsModalOpen(false)} 
                        roleToEdit={roleToEdit}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminRoleList;
