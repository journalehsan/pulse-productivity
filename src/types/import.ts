export type ImportRow = Record<string, string | number | null>;

export type ImportMapping = {
  title: string;
  description?: string;
  status?: string;
  dueDate?: string;
  startDate?: string;
  tags?: string;
  assignees?: string;
  priority?: string;
  parentTask?: string;
  parentId?: string;
  taskId?: string;
};

export type ImportIssue = {
  rowIndex: number;
  severity: 'error' | 'warning';
  message: string;
};

export type ImportStep = 'upload' | 'map' | 'preview' | 'validate' | 'import';

export type FileType = 'csv' | 'xlsx';

export interface ImportState {
  step: ImportStep;
  fileType: FileType;
  file: File | null;
  rows: ImportRow[];
  columns: string[];
  mapping: ImportMapping;
  issues: ImportIssue[];
  validRows: number;
  warningRows: number;
  errorRows: number;
}

export const TASK_FIELD_OPTIONS: readonly { value: string; label: string; required?: boolean }[] = [
  { value: '', label: 'Do not import' },
  { value: 'title', label: 'Task Title', required: true },
  { value: 'description', label: 'Description' },
  { value: 'status', label: 'Status' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'startDate', label: 'Start Date' },
  { value: 'tags', label: 'Tags' },
  { value: 'assignees', label: 'Assignees' },
  { value: 'priority', label: 'Priority' },
  { value: 'parentTask', label: 'Parent Task (by title)' },
  { value: 'parentId', label: 'Parent ID' },
  { value: 'taskId', label: 'Task ID' },
];

export const COLUMN_AUTO_MAP: Record<string, keyof ImportMapping> = {
  title: 'title',
  task: 'title',
  name: 'title',
  'task name': 'title',
  'task title': 'title',
  desc: 'description',
  description: 'description',
  status: 'status',
  state: 'status',
  due: 'dueDate',
  'due date': 'dueDate',
  'due_date': 'dueDate',
  duedate: 'dueDate',
  start: 'startDate',
  'start date': 'startDate',
  'start_date': 'startDate',
  startdate: 'startDate',
  tags: 'tags',
  tag: 'tags',
  labels: 'tags',
  assignee: 'assignees',
  assignees: 'assignees',
  owner: 'assignees',
  assigned: 'assignees',
  'assigned to': 'assignees',
  priority: 'priority',
  parent: 'parentTask',
  'parent task': 'parentTask',
  'parent_task': 'parentTask',
  'parent id': 'parentId',
  'parent_id': 'parentId',
  parentid: 'parentId',
  id: 'taskId',
  'task id': 'taskId',
  'task_id': 'taskId',
  taskid: 'taskId',
};

export const STATUS_MAP: Record<string, 'backlog' | 'in_progress' | 'review' | 'done'> = {
  backlog: 'backlog',
  'to do': 'backlog',
  todo: 'backlog',
  'not started': 'backlog',
  open: 'backlog',
  new: 'backlog',
  'in progress': 'in_progress',
  'in_progress': 'in_progress',
  inprogress: 'in_progress',
  doing: 'in_progress',
  active: 'in_progress',
  started: 'in_progress',
  review: 'review',
  'in review': 'review',
  'in_review': 'review',
  testing: 'review',
  done: 'done',
  complete: 'done',
  completed: 'done',
  finished: 'done',
  closed: 'done',
};

export const PRIORITY_MAP: Record<string, 'low' | 'medium' | 'high' | 'urgent'> = {
  low: 'low',
  l: 'low',
  '1': 'low',
  medium: 'medium',
  med: 'medium',
  m: 'medium',
  '2': 'medium',
  normal: 'medium',
  high: 'high',
  h: 'high',
  '3': 'high',
  urgent: 'urgent',
  critical: 'urgent',
  u: 'urgent',
  '4': 'urgent',
};
