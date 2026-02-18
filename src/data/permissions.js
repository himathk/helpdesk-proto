export const PERMISSIONS = {
  PAGES: {
    label: 'Pages Management',
    actions: [
      { key: 'read:pages', label: 'Read Pages' },
      { key: 'write:pages', label: 'Write Pages' },
      { key: 'delete:pages', label: 'Delete Pages' },
      { key: 'publish:pages', label: 'Publish Pages' },
    ]
  },
  VIDEOS: {
    label: 'Video Management',
    actions: [
      { key: 'view:videos', label: 'View Videos' },
      { key: 'upload:videos', label: 'Upload Videos' },
      { key: 'edit:videos', label: 'Edit Videos' },
      { key: 'delete:videos', label: 'Delete Videos' },
    ]
  },
  MODULES: {
    label: 'Module Management',
    actions: [
      { key: 'view:modules', label: 'View Modules' },
      { key: 'create:modules', label: 'Create Modules' },
      { key: 'edit:modules', label: 'Edit Modules' },
      { key: 'delete:modules', label: 'Delete Modules' },
    ]
  },
  USERS: {
    label: 'User Management',
    actions: [
      { key: 'view:users', label: 'View Users' },
      { key: 'create:users', label: 'Create Users' },
      { key: 'edit:users', label: 'Edit Users' },
      { key: 'delete:users', label: 'Delete Users' },
      { key: 'manage:roles', label: 'Manage Roles' },
    ]
  },
  ANALYTICS: {
    label: 'Analytics',
    actions: [
      { key: 'view:analytics', label: 'View Analytics' },
      { key: 'export:analytics', label: 'Export Analytics' },
    ]
  },
  SETTINGS: {
    label: 'Settings',
    actions: [
      { key: 'edit:settings', label: 'Edit Settings' },
      { key: 'manage:integrations', label: 'Manage Integrations' },
    ]
  }
};
