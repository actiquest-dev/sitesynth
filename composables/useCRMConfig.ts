/**
 * CRM Configuration
 * Define your NocoBase collection names here
 */

export const useCRMConfig = () => {
  return {
    // Collection names - UPDATE THESE WITH YOUR ACTUAL TABLE NAMES
    collections: {
      projects: 'projects', // Change to 'requests', 'orders', etc. if different
      templates: 'templates', // Change if using different name
      tasks: 'tasks', // Change if using different name
      clients: 'clients', // Optional: if you have clients table
    },

    // Project statuses
    projectStatuses: [
      { value: 'queue', label: 'In Queue', color: '#FFB92C' },
      { value: 'pending', label: 'Pending', color: '#1890FF' },
      { value: 'in_progress', label: 'In Progress', color: '#52C41A' },
      { value: 'completed', label: 'Completed', color: '#52C41A' },
      { value: 'archived', label: 'Archived', color: '#D9D9D9' },
    ],

    // Template types
    templateTypes: [
      { value: 'web_design', label: 'Web Design' },
      { value: 'ecommerce', label: 'E-commerce' },
      { value: 'landing_page', label: 'Landing Page' },
      { value: 'portfolio', label: 'Portfolio' },
      { value: 'blog', label: 'Blog' },
    ],

    // Project fields to display in table
    projectTableFields: [
      'title',
      'status',
      'template',
      'budget',
      'created_at',
      'updated_at',
    ],

    // Project fields for form
    projectFormFields: [
      'title',
      'description',
      'template',
      'status',
      'budget',
      'deadline',
    ],
  }
}
