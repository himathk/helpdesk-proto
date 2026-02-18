import { useState } from 'react';
import { Users, Shield, Plus } from 'lucide-react';
import AdminUserList from './AdminUserList';
import AdminRoleList from './AdminRoleList';
import { motion, AnimatePresence } from 'framer-motion';

const AdminCustomerManager = () => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           {/* Breadcrumbs could go here */}

          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Customer Management</h1>
          <p className="text-slate-500 mt-1">Manage users, roles, and access permissions.</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200">
        <div className="flex gap-6">
            <button
                onClick={() => setActiveTab('users')}
                className={`flex items-center gap-2 pb-3 px-1 text-sm font-bold border-b-2 transition-colors ${
                    activeTab === 'users' 
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
            >
                <Users className="h-4 w-4" />
                Users
            </button>
             <button
                onClick={() => setActiveTab('roles')}
                className={`flex items-center gap-2 pb-3 px-1 text-sm font-bold border-b-2 transition-colors ${
                    activeTab === 'roles' 
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
            >
                <Shield className="h-4 w-4" />
                Roles & Permissions
            </button>
        </div>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'users' ? (
            <motion.div
                key="users"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
            >
                <AdminUserList />
            </motion.div>
        ) : (
             <motion.div
                key="roles"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
            >
                <AdminRoleList />
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCustomerManager;
