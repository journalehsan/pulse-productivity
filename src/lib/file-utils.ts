import { TaskFile } from '@/types';

// Format file size to human readable
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

// Get file extension from name
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

// Check if file is an image
export const isImageFile = (mimeType: string): boolean => {
  return mimeType.startsWith('image/');
};

// Check if file is a video
export const isVideoFile = (mimeType: string): boolean => {
  return mimeType.startsWith('video/');
};

// Check if file is a document
export const isDocumentFile = (mimeType: string): boolean => {
  return mimeType.includes('pdf') || 
         mimeType.includes('word') || 
         mimeType.includes('document');
};

// Check if file is a spreadsheet
export const isSpreadsheetFile = (mimeType: string): boolean => {
  return mimeType.includes('sheet') || 
         mimeType.includes('excel') || 
         mimeType.includes('csv');
};

// Get file category for icon selection
export type FileCategory = 'image' | 'video' | 'document' | 'spreadsheet' | 'archive' | 'code' | 'text' | 'generic';

export const getFileCategory = (mimeType: string): FileCategory => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.includes('pdf') || mimeType.includes('word') || mimeType.includes('document')) return 'document';
  if (mimeType.includes('sheet') || mimeType.includes('excel') || mimeType.includes('csv')) return 'spreadsheet';
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('archive')) return 'archive';
  if (mimeType.includes('json') || mimeType.includes('yaml') || mimeType.includes('xml')) return 'code';
  if (mimeType.includes('text/')) return 'text';
  return 'generic';
};

// Truncate filename if too long
export const truncateFilename = (filename: string, maxLength: number = 25): string => {
  if (filename.length <= maxLength) return filename;
  
  const ext = getFileExtension(filename);
  const nameWithoutExt = filename.slice(0, filename.lastIndexOf('.'));
  const truncatedName = nameWithoutExt.slice(0, maxLength - ext.length - 4) + '...';
  return `${truncatedName}.${ext}`;
};

// Validate file size (max 20MB)
export const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export const validateFileSize = (size: number): boolean => {
  return size <= MAX_FILE_SIZE;
};

// Supported MIME types
export const SUPPORTED_MIME_TYPES = [
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  // Spreadsheets
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  // Images
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  // Videos
  'video/mp4',
  'video/webm',
  'video/quicktime',
  // Archives
  'application/zip',
  'application/x-rar-compressed',
  // Other
  'text/plain',
  'application/json',
];

// Validate file type
export const validateFileType = (mimeType: string): boolean => {
  return SUPPORTED_MIME_TYPES.includes(mimeType) || 
         mimeType.startsWith('image/') || 
         mimeType.startsWith('video/') ||
         mimeType.startsWith('text/');
};

// Generate mock file ID
export const generateFileId = (): string => {
  return `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Create file object from File API
export const createTaskFile = (file: File, uploadedBy: string): TaskFile => {
  return {
    id: generateFileId(),
    name: file.name,
    type: file.type,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    uploadedBy,
    url: URL.createObjectURL(file),
    thumbnail: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
  };
};
