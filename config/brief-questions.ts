export interface BriefQuestion {
  id: string
  text: string
  type: 'text_input' | 'textarea' | 'single_select' | 'multi_select'
  options?: { id: string; label: string }[]
  hint?: string
  saveKey: string
  minSentences?: number
}

export const briefQuestions: BriefQuestion[] = [
  {
    id: 'Q1',
    text: 'What is your project called?',
    type: 'text_input',
    saveKey: 'projectName',
    hint: 'e.g., E-Commerce Redesign, FinTech App',
  },
  {
    id: 'Q2',
    text: 'In one sentence, what are you building?',
    type: 'textarea',
    saveKey: 'projectDescription',
    hint: 'Describe your project in detail. What problem does it solve? What is the vision?',
    minSentences: 2,
  },
  {
    id: 'Q3',
    text: 'What type of project is this?',
    type: 'single_select',
    options: [
      { id: 'website', label: 'Website / Landing page' },
      { id: 'mobile_app', label: 'Mobile Application' },
      { id: 'web_app', label: 'Web Application / SaaS' },
      { id: 'branding', label: 'Branding / Brand Identity' },
      { id: 'ecommerce', label: 'E-commerce Platform' },
    ],
    saveKey: 'projectCategory',
  },
  {
    id: 'Q4',
    text: 'What is the primary goal of this project?',
    type: 'textarea',
    saveKey: 'primaryGoal',
    hint: 'e.g., Increase conversion, improve UX, launch product',
    minSentences: 2,
  },
  {
    id: 'Q5',
    text: 'Who is your target audience?',
    type: 'textarea',
    saveKey: 'targetAudience',
    hint: 'Describe your ideal customer. Age, profession, habits, needs.',
    minSentences: 2,
  },
  {
    id: 'Q6',
    text: 'What problems need to be solved?',
    type: 'textarea',
    saveKey: 'painPoints',
    hint: 'List the main pain points and challenges your users face.',
    minSentences: 2,
  },
  {
    id: 'Q7',
    text: 'What is your timeline?',
    type: 'single_select',
    options: [
      { id: 'asap', label: 'ASAP (1-2 weeks)' },
      { id: '1month', label: '1 month' },
      { id: '2-3months', label: '2-3 months' },
      { id: 'flexible', label: 'Flexible / No rush' },
    ],
    saveKey: 'timeline',
  },
  {
    id: 'Q8',
    text: 'What is your budget?',
    type: 'single_select',
    options: [
      { id: 'low', label: '$500 - $2,000' },
      { id: 'medium', label: '$2,000 - $5,000' },
      { id: 'high', label: '$5,000 - $15,000' },
      { id: 'premium', label: '$15,000+' },
    ],
    saveKey: 'budget',
  },
  {
    id: 'Q9',
    text: 'What is the primary industry / sector?',
    type: 'textarea',
    saveKey: 'industry',
    hint: 'e.g., FinTech, SaaS, E-commerce, Healthcare, Education',
  },
  {
    id: 'Q10',
    text: 'What are the main colors in your brand palette?',
    type: 'textarea',
    saveKey: 'colorPalette',
    hint: 'e.g., Primary: #8D35FF, Secondary: #FF6B35. Or describe: "dark purple and orange"',
  },
  {
    id: 'Q11',
    text: 'What are the main deliverables needed?',
    type: 'multi_select',
    options: [
      { id: 'ui_design', label: 'UI Design' },
      { id: 'wireframes', label: 'Wireframes' },
      { id: 'prototype', label: 'Prototype' },
      { id: 'frontend', label: 'Frontend Code' },
      { id: 'backend', label: 'Backend / API' },
      { id: 'mobile', label: 'Mobile App' },
      { id: 'branding', label: 'Logo / Branding' },
      { id: 'copywriting', label: 'Copywriting' },
    ],
    saveKey: 'deliverables',
  },
  {
    id: 'Q12',
    text: 'What are the technical requirements?',
    type: 'multi_select',
    options: [
      { id: 'responsive', label: 'Responsive Design' },
      { id: 'seo', label: 'SEO Optimized' },
      { id: 'wcag', label: 'Accessibility (WCAG)' },
      { id: 'pwa', label: 'PWA Support' },
      { id: 'i18n', label: 'Multi-language' },
      { id: 'analytics', label: 'Analytics Integration' },
      { id: 'cms', label: 'CMS Integration' },
      { id: 'auth', label: 'Authentication / Auth' },
    ],
    saveKey: 'technicalRequirements',
  },
]
