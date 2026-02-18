import { createContext, useContext, useState, useEffect } from 'react';
// Simple UUID generator since we don't have the uuid package installed
const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

const AdminContext = createContext();

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};

// --- Mock Data ---

const MOCK_ROLES = [
    {
        id: 'admin',
        name: 'Admin',
        description: 'Full access to all resources',
        isSystem: true,
        permissions: ['*'], // specific permissions will be expanded in real implementation
        userCount: 3
    },
    {
        id: 'editor',
        name: 'Editor',
        description: 'Can manage content and users',
        isSystem: true,
        permissions: ['view:policy-management', 'view:claims-processing', 'view:user-administration', 'view:system-settings'],
        userCount: 5
    },
    {
        id: 'viewer',
        name: 'Viewer',
        description: 'Read-only access to policies and claims',
        isSystem: true,
        permissions: ['view:policy-management', 'view:claims-processing'],
        userCount: 12
    },
    {
        id: 'customer',
        name: 'Customer',
        description: 'Standard customer access',
        isSystem: true,
        permissions: ['view:policy-management:create-policy', 'view:support-center'],
        userCount: 45
    }
];

const MOCK_USERS = [
    {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        avatar: null,
        roleId: 'admin',
        status: 'active',
        lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        phone: '+1 (555) 123-4567',
        company: 'Acme Corp',
        department: 'IT',
        createdAt: '2025-01-15T08:00:00Z',
        permissionsOverride: {}
    },
    {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@company.com',
        avatar: null,
        roleId: 'editor',
        status: 'active',
        lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
        phone: '+1 (555) 987-6543',
        company: 'Tech Solutions',
        department: 'Support',
        createdAt: '2025-02-10T11:30:00Z',
        permissionsOverride: {}
    },
    {
        id: '3',
        firstName: 'Bob',
        lastName: 'Wilson',
        email: 'bob@example.com',
        avatar: null,
        roleId: 'viewer',
        status: 'inactive',
        lastLogin: '2025-01-10T09:15:00Z',
        company: 'StartupXYZ',
        department: 'Sales',
        createdAt: '2024-12-05T14:45:00Z',
        permissionsOverride: {}
    },
    {
        id: '4',
        firstName: 'Alice',
        lastName: 'Brown',
        email: 'alice.brown@example.com',
        avatar: null,
        roleId: 'editor',
        status: 'pending',
        lastLogin: null,
        company: 'Innovate Inc',
        department: 'Design',
        createdAt: new Date().toISOString(),
        permissionsOverride: {}
    }
];

export const AdminProvider = ({ children }) => {
    const [users, setUsers] = useState(() => {
        const saved = localStorage.getItem('admin_users');
        return saved ? JSON.parse(saved) : MOCK_USERS;
    });

    const [roles, setRoles] = useState(() => {
        const saved = localStorage.getItem('admin_roles');
        return saved ? JSON.parse(saved) : MOCK_ROLES;
    });

    // Persist to localStorage whenever state changes
    useEffect(() => {
        localStorage.setItem('admin_users', JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        localStorage.setItem('admin_roles', JSON.stringify(roles));
    }, [roles]);

    // --- Actions ---

    const addUser = (userData) => {
        const newUser = {
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            lastLogin: null,
            permissionsOverride: {},
            avatar: null, // Placeholder for now
            ...userData
        };
        setUsers(prev => [newUser, ...prev]);
        return newUser;
    };

    const updateUser = (id, updates) => {
        setUsers(prev => prev.map(user => 
            user.id === id ? { ...user, ...updates } : user
        ));
    };

    const deleteUser = (id) => {
        setUsers(prev => prev.filter(user => user.id !== id));
    };

    const bulkUpdateUsers = (ids, updates) => {
        setUsers(prev => prev.map(user => 
            ids.includes(user.id) ? { ...user, ...updates } : user
        ));
    };

    const bulkDeleteUsers = (ids) => {
        setUsers(prev => prev.filter(user => !ids.includes(user.id)));
    };

    const addRole = (roleData) => {
        const newRole = {
            id: uuidv4(),
            isSystem: false,
            userCount: 0,
            ...roleData
        };
        setRoles(prev => [...prev, newRole]);
        return newRole;
    };

    const updateRole = (id, updates) => {
        setRoles(prev => prev.map(role => 
            role.id === id ? { ...role, ...updates } : role
        ));
    };

    const deleteRole = (id) => {
        // Prevent deleting system roles
        const role = roles.find(r => r.id === id);
        if (role && role.isSystem) return;
        
        setRoles(prev => prev.filter(role => role.id !== id));
    };

    // Derived Helper to get full user object with role details
    const getUsersWithRoles = () => {
        return users.map(user => {
            const role = roles.find(r => r.id === user.roleId) || roles.find(r => r.id === 'viewer');
            return { ...user, role };
        });
    };

    return (
        <AdminContext.Provider value={{
            users: getUsersWithRoles(),
            roles,
            addUser,
            updateUser,
            deleteUser,
            bulkUpdateUsers,
            bulkDeleteUsers,
            addRole,
            updateRole,
            deleteRole
        }}>
            {children}
        </AdminContext.Provider>
    );
};
