export const KANBAN_COLUMNS = [
  { id: 'TODO', title: 'To Do', color: '#6b7280', badgeClass: 'badge-todo' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: '#d97706', badgeClass: 'badge-in_progress' },
  { id: 'REVIEW', title: 'Review', color: '#0284c7', badgeClass: 'badge-review' },
  { id: 'COMPLETED', title: 'Completed', color: '#15803d', badgeClass: 'badge-completed' },
];

export const PRIORITIES = [
  { id: 'Low', label: 'Low', color: '#10b981', badgeClass: 'badge-low' },
  { id: 'Medium', label: 'Medium', color: '#f59e0b', badgeClass: 'badge-medium' },
  { id: 'High', label: 'High', color: '#ef4444', badgeClass: 'badge-high' },
  { id: 'Urgent', label: 'Urgent', color: '#dc2626', badgeClass: 'badge-urgent' },
];

export const PROJECT_CATEGORIES = [
  'Web Development',
  'Mobile App',
  'UI/UX Design',
  'DevOps & Infrastructure',
  'Data & AI',
  'Marketing Tech',
];

export const PROJECT_STATUSES = ['Planning', 'In Progress', 'On Hold', 'Completed'];
