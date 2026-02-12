// Icons are now referenced by string name
export const modules = [
  {
    id: 'policy-management',
    title: 'Policy Management',
    description: 'Learn how to create, update, and manage insurance policies efficiently.',
    icon: 'Shield',
    guides: [
      {
        id: 'create-policy',
        title: 'Creating a New Policy',
        description: 'Step-by-step guide to issuing a new insurance policy.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        steps: [
          'Navigate to the "Policies" tab in the main dashboard.',
          'Click on the "New Policy" button in the top right corner.',
          'Select the policy type (e.g., Auto, Home, Health).',
          'Fill in the customer details and coverage requirements.',
          'Review the calculated premium and click "Issue Policy".'
        ]
      },
      {
        id: 'renew-policy',
        title: 'Renewing an Existing Policy',
        description: 'How to process policy renewals and handle expirations.',
        videoUrl: 'https://www.w3schools.com/html/movie.mp4',
        steps: [
          'Search for the policy using the policy number or customer name.',
          'Open the policy details page.',
          'Click on the "Renew" action button.',
          'Verify current details and update if necessary.',
          'Confirm payment details and process the renewal.'
        ]
      }
    ]
  },
  {
    id: 'claims-processing',
    title: 'Claims Processing',
    description: 'Guide to handling claims from initiation to settlement.',
    icon: 'FileText',
    guides: [
      {
        id: 'file-claim',
        title: 'Filing a New Claim',
        description: 'Initiate a claim request for a customer.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        steps: [
          'Go to the "Claims" module.',
          'Click "File Claim" and associate it with an active policy.',
          'Enter incident details (date, time, description).',
          'Upload supporting documents and photos.',
          'Submit the claim for review.'
        ]
      }
    ]
  },
  {
    id: 'user-administration',
    title: 'User Administration',
    description: 'Manage user roles, permissions, and access controls.',
    icon: 'Users',
    guides: [
      {
        id: 'add-user',
        title: 'Adding a New User',
        description: 'Onboard a new employee to the system.',
        videoUrl: 'https://www.w3schools.com/html/movie.mp4',
        steps: [
          'Access the "Admin" panel.',
          'Select "User Management".',
          'Click "Invite User" and enter their email address.',
          'Assign appropriate role (e.g., Agent, Manager).',
          'Send the invitation.'
        ]
      }
    ]
  },
  {
    id: 'billing-payments',
    title: 'Billing & Payments',
    description: 'Understand billing cycles, invoices, and payment processing.',
    icon: 'BookOpen',
    guides: []
  },
  {
    id: 'system-settings',
    title: 'System Settings',
    description: 'Configure global settings and preferences for the application.',
    icon: 'Settings',
    guides: [
       {
        id: 'geo-management',
        title: 'Geo Management',
        description: 'Comprehensive guide to managing geographical zones and regions.',
        videoUrl: '/Geo Management (1).mp4',
        steps: [
          'Navigate to System Settings > Geo Management.',
          'View the map of active zones.',
          'Click "Add Zone" to define a new geographical area.',
          'Set zone parameters and assign agents.'
        ]
      },
      {
        id: 'sub-zone-management',
        title: 'Sub Zone Management',
        description: 'Detailed instructions on creating and maintaining sub-zones.',
        videoUrl: '/Geo management - Manage Sub Zones (1).mp4',
        steps: [
          'Select a primary zone from the dashboard.',
          'Click "Manage Sub Zones".',
          'Define boundaries for the sub-zone.',
          'Configure specific rules for the selected area.'
        ]
      }
    ]
  },
  {
    id: 'support-center',
    title: 'Support Center',
    description: 'Resources for troubleshooting and contacting technical support.',
    icon: 'HelpCircle',
    guides: []
  }
];
