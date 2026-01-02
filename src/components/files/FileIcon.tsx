import React from 'react';
import { 
  Image, 
  Video, 
  FileText, 
  FileSpreadsheet, 
  Archive, 
  FileCode, 
  File, 
  Play 
} from 'lucide-react';
import { getFileCategory, FileCategory } from '@/lib/file-utils';
import { cn } from '@/lib/utils';

interface FileIconProps {
  mimeType: string;
  className?: string;
  showVideoOverlay?: boolean;
}

const iconMap: Record<FileCategory, React.ComponentType<{ className?: string }>> = {
  image: Image,
  video: Video,
  document: FileText,
  spreadsheet: FileSpreadsheet,
  archive: Archive,
  code: FileCode,
  text: FileText,
  generic: File,
};

const colorMap: Record<FileCategory, string> = {
  image: 'text-emerald-500',
  video: 'text-purple-500',
  document: 'text-red-500',
  spreadsheet: 'text-green-600',
  archive: 'text-amber-500',
  code: 'text-blue-500',
  text: 'text-muted-foreground',
  generic: 'text-muted-foreground',
};

export const FileIcon: React.FC<FileIconProps> = ({ 
  mimeType, 
  className,
  showVideoOverlay = false 
}) => {
  const category = getFileCategory(mimeType);
  const Icon = iconMap[category];
  const color = colorMap[category];

  if (showVideoOverlay && category === 'video') {
    return (
      <div className={cn("relative", className)}>
        <Video className={cn("h-full w-full", color)} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-background/80 rounded-full p-0.5">
            <Play className="h-3 w-3 text-foreground fill-current" />
          </div>
        </div>
      </div>
    );
  }

  return <Icon className={cn(color, className)} />;
};
