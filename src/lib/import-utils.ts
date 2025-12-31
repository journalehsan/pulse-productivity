import { Task, Tag, User } from '@/types';
import {
  ImportRow,
  ImportMapping,
  ImportIssue,
  COLUMN_AUTO_MAP,
  STATUS_MAP,
  PRIORITY_MAP,
} from '@/types/import';
import { tags as mockTags, users as mockUsers } from '@/data/mockData';

// Generate UUID-like ID
const generateId = (): string => {
  return 'task-' + Math.random().toString(36).substring(2, 11);
};

// Parse CSV file
export const parseCSV = async (file: File): Promise<{ rows: ImportRow[]; columns: string[] }> => {
  const text = await file.text();
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  
  if (lines.length === 0) {
    return { rows: [], columns: [] };
  }

  // Parse header
  const columns = parseCSVLine(lines[0]);
  
  // Parse data rows
  const rows: ImportRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.some((v) => v.trim())) {
      const row: ImportRow = {};
      columns.forEach((col, idx) => {
        row[col] = values[idx] ?? null;
      });
      rows.push(row);
    }
  }

  return { rows, columns };
};

// Parse a single CSV line handling quoted values
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
};

// Parse XLSX file (basic implementation - would need xlsx library for full support)
export const parseXLSX = async (file: File): Promise<{ rows: ImportRow[]; columns: string[]; error?: string }> => {
  // Check if xlsx library is available
  try {
    const XLSX = await import('xlsx');
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1 }) as unknown[][];
    
    if (jsonData.length === 0) {
      return { rows: [], columns: [] };
    }

    const firstRow = jsonData[0] as (string | number | null)[];
    const columns = firstRow.map((c) => String(c ?? ''));
    const rows: ImportRow[] = [];
    
    for (let i = 1; i < jsonData.length; i++) {
      const values = jsonData[i] as (string | number | null)[];
      if (values && values.some((v) => v != null && String(v).trim())) {
        const row: ImportRow = {};
        columns.forEach((col, idx) => {
          row[col] = values[idx] ?? null;
        });
        rows.push(row);
      }
    }

    return { rows, columns };
  } catch {
    return { 
      rows: [], 
      columns: [], 
      error: 'Excel parsing requires the xlsx library. Please use CSV format or install the xlsx package.' 
    };
  }
};

// Auto-detect column mapping
export const autoDetectMapping = (columns: string[]): ImportMapping => {
  const mapping: ImportMapping = { title: '' };

  columns.forEach((col) => {
    const normalizedCol = col.toLowerCase().trim();
    const mappedField = COLUMN_AUTO_MAP[normalizedCol];
    
    if (mappedField) {
      (mapping as Record<string, string>)[mappedField] = col;
    }
  });

  // If no title found, try first column
  if (!mapping.title && columns.length > 0) {
    mapping.title = columns[0];
  }

  return mapping;
};

// Parse date string to ISO format
const parseDate = (value: string | number | null): string | undefined => {
  if (!value) return undefined;
  
  const str = String(value).trim();
  if (!str) return undefined;

  // Try various date formats
  const date = new Date(str);
  if (!isNaN(date.getTime())) {
    return date.toISOString().split('T')[0];
  }

  // Try DD/MM/YYYY or MM/DD/YYYY
  const parts = str.split(/[\/\-\.]/);
  if (parts.length === 3) {
    const [a, b, c] = parts.map(Number);
    // Assume MM/DD/YYYY for US format
    const tryDate = new Date(c, a - 1, b);
    if (!isNaN(tryDate.getTime())) {
      return tryDate.toISOString().split('T')[0];
    }
  }

  return undefined;
};

// Parse status string
const parseStatus = (value: string | number | null): { status: 'backlog' | 'in_progress' | 'review' | 'done'; warning?: string } => {
  if (!value) return { status: 'backlog' };
  
  const normalized = String(value).toLowerCase().trim();
  const mapped = STATUS_MAP[normalized];
  
  if (mapped) {
    return { status: mapped };
  }
  
  return { status: 'backlog', warning: `Unknown status "${value}", defaulting to Backlog` };
};

// Parse priority string
const parsePriority = (value: string | number | null): 'low' | 'medium' | 'high' | 'urgent' => {
  if (!value) return 'medium';
  
  const normalized = String(value).toLowerCase().trim();
  return PRIORITY_MAP[normalized] || 'medium';
};

// Parse tags (comma-separated)
const parseTags = (value: string | number | null): Tag[] => {
  if (!value) return [];
  
  const tagNames = String(value).split(',').map((t) => t.trim()).filter(Boolean);
  
  return tagNames.map((name) => {
    const existing = mockTags.find((t) => t.name.toLowerCase() === name.toLowerCase());
    if (existing) return existing;
    
    // Create new tag with random color
    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];
    return {
      id: 'tag-' + Math.random().toString(36).substring(2, 8),
      name,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  });
};

// Parse assignees (comma-separated emails or names)
const parseAssignees = (value: string | number | null): User[] => {
  if (!value) return [];
  
  const assigneeNames = String(value).split(',').map((a) => a.trim()).filter(Boolean);
  
  return assigneeNames
    .map((name) => {
      const existing = mockUsers.find(
        (u) => u.name.toLowerCase() === name.toLowerCase() || u.email.toLowerCase() === name.toLowerCase()
      );
      return existing;
    })
    .filter((u): u is User => u !== undefined);
};

// Apply mapping and validate rows
export const applyMapping = (
  rows: ImportRow[],
  mapping: ImportMapping,
  projectId: string
): { tasks: Task[]; issues: ImportIssue[] } => {
  const issues: ImportIssue[] = [];
  const tasks: Task[] = [];
  const titleToId: Record<string, string> = {};
  const importedIdToNewId: Record<string, string> = {};

  // First pass: create tasks and build ID maps
  rows.forEach((row, rowIndex) => {
    const title = mapping.title ? String(row[mapping.title] ?? '').trim() : '';
    
    if (!title) {
      issues.push({
        rowIndex: rowIndex + 2, // +2 for 1-indexed and header row
        severity: 'error',
        message: 'Missing task title',
      });
      return;
    }

    // Parse dates
    let dueDate: string | undefined;
    let startDate: string | undefined;

    if (mapping.dueDate) {
      dueDate = parseDate(row[mapping.dueDate]);
      if (row[mapping.dueDate] && !dueDate) {
        issues.push({
          rowIndex: rowIndex + 2,
          severity: 'warning',
          message: `Invalid due date format: "${row[mapping.dueDate]}"`,
        });
      }
    }

    if (mapping.startDate) {
      startDate = parseDate(row[mapping.startDate]);
      if (row[mapping.startDate] && !startDate) {
        issues.push({
          rowIndex: rowIndex + 2,
          severity: 'warning',
          message: `Invalid start date format: "${row[mapping.startDate]}"`,
        });
      }
    }

    // Parse status
    const statusResult = parseStatus(mapping.status ? row[mapping.status] : null);
    if (statusResult.warning) {
      issues.push({
        rowIndex: rowIndex + 2,
        severity: 'warning',
        message: statusResult.warning,
      });
    }

    // Generate task ID
    const taskId = generateId();
    const importedId = mapping.taskId ? String(row[mapping.taskId] ?? '') : '';
    
    if (importedId) {
      importedIdToNewId[importedId] = taskId;
    }
    titleToId[title.toLowerCase()] = taskId;

    const task: Task = {
      id: taskId,
      title,
      description: mapping.description ? String(row[mapping.description] ?? '') : undefined,
      status: statusResult.status,
      priority: parsePriority(mapping.priority ? row[mapping.priority] : null),
      assignees: parseAssignees(mapping.assignees ? row[mapping.assignees] : null),
      dueDate,
      startDate,
      tags: parseTags(mapping.tags ? row[mapping.tags] : null),
      projectId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store parent info for second pass
    (task as Task & { _parentTask?: string; _parentId?: string })._parentTask = mapping.parentTask
      ? String(row[mapping.parentTask] ?? '')
      : '';
    (task as Task & { _parentTask?: string; _parentId?: string })._parentId = mapping.parentId
      ? String(row[mapping.parentId] ?? '')
      : '';

    tasks.push(task);
  });

  // Second pass: resolve parent relationships
  tasks.forEach((task) => {
    const parentTask = (task as Task & { _parentTask?: string })._parentTask;
    const parentId = (task as Task & { _parentId?: string })._parentId;
    
    delete (task as Task & { _parentTask?: string })._parentTask;
    delete (task as Task & { _parentId?: string })._parentId;

    if (parentId) {
      const resolvedParentId = importedIdToNewId[parentId];
      if (resolvedParentId) {
        task.parentId = resolvedParentId;
      } else {
        const rowIdx = tasks.indexOf(task) + 2;
        issues.push({
          rowIndex: rowIdx,
          severity: 'warning',
          message: `Parent ID "${parentId}" not found, importing as root task`,
        });
      }
    } else if (parentTask) {
      const resolvedParentId = titleToId[parentTask.toLowerCase()];
      if (resolvedParentId) {
        task.parentId = resolvedParentId;
      } else {
        const rowIdx = tasks.indexOf(task) + 2;
        issues.push({
          rowIndex: rowIdx,
          severity: 'warning',
          message: `Parent task "${parentTask}" not found, importing as root task`,
        });
      }
    }
  });

  return { tasks, issues };
};

// Generate sample CSV template
export const generateCSVTemplate = (): string => {
  const headers = ['Task ID', 'Title', 'Description', 'Status', 'Priority', 'Due Date', 'Start Date', 'Tags', 'Assignees', 'Parent ID'];
  const rows = [
    ['1', 'Setup project infrastructure', 'Initial project setup with dependencies', 'In Progress', 'High', '2025-01-15', '2025-01-01', 'Development,Setup', 'john@example.com', ''],
    ['2', 'Configure database', 'Setup PostgreSQL connection', 'Backlog', 'Medium', '2025-01-20', '', 'Database', 'jane@example.com', '1'],
    ['3', 'Design user authentication', 'Create login/signup flows', 'Backlog', 'High', '2025-01-18', '', 'Design,Auth', 'alice@example.com', '1'],
    ['4', 'Implement login API', 'Backend API for authentication', 'Backlog', 'Medium', '2025-01-25', '', 'Development,Auth', 'john@example.com', '3'],
    ['5', 'Create dashboard layout', 'Main dashboard UI components', 'Done', 'Low', '2025-01-10', '2025-01-05', 'UI,Design', '', ''],
  ];
  
  return [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');
};

// Generate sample XLSX template (as CSV for now - would need xlsx library)
export const downloadTemplate = (type: 'csv' | 'xlsx'): void => {
  const content = generateCSVTemplate();
  const blob = new Blob([content], { type: type === 'csv' ? 'text/csv' : 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `task-import-template.${type === 'xlsx' ? 'csv' : 'csv'}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
