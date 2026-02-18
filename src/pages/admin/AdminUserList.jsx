import { useState, useMemo } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { 
  ChevronLeft, ChevronRight, UserPlus, Search, Filter, MoreVertical, Trash2, Edit, Check, X,
  Mail, Phone, Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const AdminUserList = () => {
    const navigate = useNavigate();
    const { users, roles, deleteUser, bulkUpdateUsers, bulkDeleteUsers } = useAdmin();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  // View mode removed
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);
  
  // Modal State Removed
  
  const itemsPerPage = 10;
  
  // --- Filter Logic ---
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
        const matchesSearch = 
            (user.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.lastName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());
            
        const matchesRole = roleFilter === 'all' || user.roleId === roleFilter;
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        
        return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
      (currentPage - 1) * itemsPerPage, 
      currentPage * itemsPerPage
  );

  // --- Handlers ---
  const handleSelectAll = (e) => {
      if (e.target.checked) {
          setSelectedUsers(paginatedUsers.map(u => u.id));
      } else {
          setSelectedUsers([]);
      }
  };

  const handleSelectUser = (id) => {
      setSelectedUsers(prev => 
          prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
      );
  };

  const handleDelete = (id) => {
      if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
          deleteUser(id);
      }
  };
  
  const handleBulkDelete = () => {
      if (confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) {
          bulkDeleteUsers(selectedUsers);
          setSelectedUsers([]);
      }
  };

  const handleCreate = () => {
      navigate('/admin/users/new');
  };

  const handleEdit = (user) => {
      navigate(`/admin/users/edit/${user.id}`);
  };

  const getInitials = (first, last) => {
      return `${first?.charAt(0) || ''}${last?.charAt(0) || ''}`.toUpperCase();
  };

  const formatDate = (dateString) => {
      if (!dateString) return 'Never';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
  };

  const getStatusColor = (status) => {
      switch(status) {
          case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
          case 'inactive': return 'bg-slate-100 text-slate-600 border-slate-200';
          case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
          default: return 'bg-slate-100 text-slate-600 border-slate-200';
      }
  };

  const getRoleBadgeColor = (roleId) => {
      switch(roleId) {
          case 'admin': return 'bg-purple-100 text-purple-700 border-purple-200';
          case 'editor': return 'bg-blue-100 text-blue-700 border-blue-200';
          case 'viewer': return 'bg-cyan-100 text-cyan-700 border-cyan-200';
          default: return 'bg-slate-100 text-slate-600 border-slate-200';
      }
  };

  return (
    <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            {/* Search */}
            <div className="relative flex-1 w-full md:w-auto md:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search by name, email..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
                <select 
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-primary cursor-pointer hover:bg-slate-50"
                >
                    <option value="all">All Roles</option>
                    {roles.map(role => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                </select>

                <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-primary cursor-pointer hover:bg-slate-50"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                </select>

                <div className="h-6 w-px bg-slate-200 hidden md:block self-center"></div>

                <button 
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20"
                >
                    <UserPlus className="h-4 w-4" />
                    <span className="hidden sm:inline">New User</span>
                </button>
            </div>
        </div>

        {/* Bulk Actions Indicator */}
        {selectedUsers.length > 0 && (
            <div className="bg-primary/5 border border-primary/20 p-3 rounded-lg flex items-center justify-between text-sm animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2 text-primary font-medium">
                    <Check className="h-4 w-4" />
                    {selectedUsers.length} users selected
                </div>
                <div className="flex items-center gap-3">
                    <button className="text-slate-600 hover:text-primary font-medium transition-colors">Activate</button>
                    <button className="text-slate-600 hover:text-primary font-medium transition-colors">Deactivate</button>
                    <div className="h-4 w-px bg-slate-300"></div>
                    <button 
                        onClick={handleBulkDelete}
                        className="text-red-500 hover:text-red-600 font-medium transition-colors flex items-center gap-1"
                    >
                        <Trash2 className="h-3 w-3" /> Delete
                    </button>
                </div>
            </div>
        )}

        {/* List View */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100 text-xs uppercase text-slate-500 font-bold tracking-wider">
                            <th className="p-4 w-10">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-slate-300 text-primary focus:ring-primary/20"
                                    checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th className="p-4">User</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Last Login</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {paginatedUsers.length > 0 ? (
                            paginatedUsers.map(user => (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="p-4">
                                        <input 
                                            type="checkbox" 
                                            className="rounded border-slate-300 text-primary focus:ring-primary/20"
                                            checked={selectedUsers.includes(user.id)}
                                            onChange={() => handleSelectUser(user.id)}
                                        />
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm border border-slate-200">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt="" className="h-full w-full rounded-full object-cover" />
                                                ) : (
                                                    getInitials(user.firstName, user.lastName)
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-900">{user.firstName} {user.lastName}</div>
                                                <div className="text-xs text-slate-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.roleId)}`}>
                                            {user.role?.name || user.roleId}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(user.status)}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : user.status === 'inactive' ? 'bg-slate-400' : 'bg-amber-500'}`}></span>
                                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-slate-500">
                                        {formatDate(user.lastLogin)}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleEdit(user)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                                                title="Edit"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" 
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="p-12 text-center text-slate-500">
                                    <div className="flex flex-col items-center justify-center">
                                        <Search className="h-8 w-8 text-slate-300 mb-3" />
                                        <p className="font-medium">No users found</p>
                                        <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination */}
            {filteredUsers.length > 0 && (
                    <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 bg-slate-50/50">
                    <div className="text-xs text-slate-500 font-medium">
                        Showing <span className="text-slate-900 font-bold">{((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of <span className="text-slate-900 font-bold">{filteredUsers.length}</span>
                    </div>
                    
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-7 h-7 rounded-md text-xs font-bold transition-colors ${
                                    currentPage === page
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>


    </div>
  );
};

export default AdminUserList;
