import { TaskFile } from '@/types';

// Mock file data for tasks
export const mockTaskFiles: Record<string, TaskFile[]> = {
  'task-1': [ // Homepage redesign
    {
      id: 'file-1',
      name: 'homepage_mockup.png',
      type: 'image/png',
      size: 1258291, // 1.2MB
      uploadedAt: '2024-01-20T10:30:00Z',
      uploadedBy: 'user-1',
      url: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800',
      thumbnail: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=200',
    },
    {
      id: 'file-2',
      name: 'design_specs.pdf',
      type: 'application/pdf',
      size: 460800, // 450KB
      uploadedAt: '2024-01-19T14:20:00Z',
      uploadedBy: 'user-2',
    },
    {
      id: 'file-3',
      name: 'brand_guidelines.docx',
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      size: 2202009, // 2.1MB
      uploadedAt: '2024-01-18T09:15:00Z',
      uploadedBy: 'user-1',
    },
  ],
  'task-10': [ // Write unit tests
    {
      id: 'file-4',
      name: 'test_coverage_report.xlsx',
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      size: 327680, // 320KB
      uploadedAt: '2024-01-22T11:00:00Z',
      uploadedBy: 'user-3',
    },
    {
      id: 'file-5',
      name: 'tests_demo.mp4',
      type: 'video/mp4',
      size: 6082355, // 5.8MB
      uploadedAt: '2024-01-23T16:45:00Z',
      uploadedBy: 'user-4',
      url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
    },
  ],
  'task-24': [ // Performance audit
    {
      id: 'file-6',
      name: 'audit_results.pdf',
      type: 'application/pdf',
      size: 911360, // 890KB
      uploadedAt: '2024-01-24T08:30:00Z',
      uploadedBy: 'user-1',
    },
    {
      id: 'file-7',
      name: 'performance_chart.png',
      type: 'image/png',
      size: 665600, // 650KB
      uploadedAt: '2024-01-24T09:00:00Z',
      uploadedBy: 'user-1',
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200',
    },
  ],
  'task-6': [ // API integration
    {
      id: 'file-8',
      name: 'api_documentation.json',
      type: 'application/json',
      size: 45056, // 44KB
      uploadedAt: '2024-01-21T13:00:00Z',
      uploadedBy: 'user-2',
    },
    {
      id: 'file-9',
      name: 'swagger_spec.yaml',
      type: 'text/yaml',
      size: 28672, // 28KB
      uploadedAt: '2024-01-21T13:05:00Z',
      uploadedBy: 'user-2',
    },
  ],
  'task-11': [ // User authentication flow
    {
      id: 'file-10',
      name: 'auth_flow_diagram.svg',
      type: 'image/svg+xml',
      size: 15360, // 15KB
      uploadedAt: '2024-01-20T10:00:00Z',
      uploadedBy: 'user-3',
    },
    {
      id: 'file-11',
      name: 'security_review.pdf',
      type: 'application/pdf',
      size: 524288, // 512KB
      uploadedAt: '2024-01-22T14:30:00Z',
      uploadedBy: 'user-1',
    },
  ],
};

// All project files for the Files tab
export const projectFiles: Record<string, TaskFile[]> = {
  'proj-1': [
    ...mockTaskFiles['task-1'],
    ...mockTaskFiles['task-10'],
    ...mockTaskFiles['task-24'],
    ...mockTaskFiles['task-6'],
    {
      id: 'file-12',
      name: 'project_timeline.xlsx',
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      size: 204800, // 200KB
      uploadedAt: '2024-01-15T09:00:00Z',
      uploadedBy: 'user-1',
    },
    {
      id: 'file-13',
      name: 'meeting_notes.txt',
      type: 'text/plain',
      size: 8192, // 8KB
      uploadedAt: '2024-01-16T11:30:00Z',
      uploadedBy: 'user-2',
    },
    {
      id: 'file-14',
      name: 'wireframes.zip',
      type: 'application/zip',
      size: 3145728, // 3MB
      uploadedAt: '2024-01-17T14:00:00Z',
      uploadedBy: 'user-3',
    },
  ],
  'proj-2': [
    ...mockTaskFiles['task-11'],
    {
      id: 'file-15',
      name: 'app_screenshots.zip',
      type: 'application/zip',
      size: 8388608, // 8MB
      uploadedAt: '2024-01-19T16:00:00Z',
      uploadedBy: 'user-4',
    },
    {
      id: 'file-16',
      name: 'user_flow.gif',
      type: 'image/gif',
      size: 1572864, // 1.5MB
      uploadedAt: '2024-01-20T12:00:00Z',
      uploadedBy: 'user-3',
      url: 'https://media.giphy.com/media/26gsspfbt1HfVQ9va/giphy.gif',
      thumbnail: 'https://media.giphy.com/media/26gsspfbt1HfVQ9va/giphy.gif',
    },
  ],
};

// Helper to get files for a task
export const getTaskFiles = (taskId: string): TaskFile[] => {
  return mockTaskFiles[taskId] || [];
};

// Helper to get all files for a project
export const getProjectFiles = (projectId: string): TaskFile[] => {
  return projectFiles[projectId] || [];
};

// Helper to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

// Helper to get file icon type
export const getFileIconType = (mimeType: string): 'image' | 'video' | 'document' | 'spreadsheet' | 'archive' | 'code' | 'text' | 'generic' => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.includes('pdf') || mimeType.includes('word') || mimeType.includes('document')) return 'document';
  if (mimeType.includes('sheet') || mimeType.includes('excel') || mimeType.includes('csv')) return 'spreadsheet';
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('archive')) return 'archive';
  if (mimeType.includes('json') || mimeType.includes('yaml') || mimeType.includes('xml')) return 'code';
  if (mimeType.includes('text/')) return 'text';
  return 'generic';
};

// Supported file types
export const SUPPORTED_FILE_TYPES = {
  documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  spreadsheets: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'],
  images: ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'],
  videos: ['video/mp4', 'video/webm', 'video/quicktime'],
  archives: ['application/zip', 'application/x-rar-compressed'],
  other: ['text/plain', 'application/json', 'text/yaml'],
};

export const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
