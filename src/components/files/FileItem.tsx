import React from 'react';
import { X, Download, Play, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { TaskFile } from '@/types';
import { FileIcon } from './FileIcon';
import { formatFileSize, truncateFilename, isImageFile, isVideoFile } from '@/lib/file-utils';
import { users } from '@/data/mockData';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface FileItemProps {
  file: TaskFile;
  onRemove?: (fileId: string) => void;
  onPreview?: (file: TaskFile) => void;
  showRemove?: boolean;
  compact?: boolean;
}

export const FileItem: React.FC<FileItemProps> = ({
  file,
  onRemove,
  onPreview,
  showRemove = true,
  compact = false,
}) => {
  const uploader = users.find(u => u.id === file.uploadedBy);
  const hasPreview = isImageFile(file.type) || isVideoFile(file.type);
  const hasThumbnail = file.thumbnail && isImageFile(file.type);

  const handleClick = () => {
    if (onPreview && hasPreview) {
      onPreview(file);
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Mock download - in real app would download the file
    console.log('Downloading:', file.name);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.(file.id);
  };

  if (compact) {
    return (
      <div 
        className={cn(
          "flex items-center gap-2 p-2 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors group",
          hasPreview && "cursor-pointer"
        )}
        onClick={handleClick}
      >
        {hasThumbnail ? (
          <div className="relative h-8 w-8 rounded overflow-hidden flex-shrink-0">
            <img src={file.thumbnail} alt={file.name} className="h-full w-full object-cover" />
            {isVideoFile(file.type) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Play className="h-3 w-3 text-white fill-white" />
              </div>
            )}
          </div>
        ) : (
          <FileIcon mimeType={file.type} className="h-5 w-5 flex-shrink-0" showVideoOverlay />
        )}
        <span className="text-sm truncate flex-1">{truncateFilename(file.name, 20)}</span>
        <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
        {showRemove && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div 
        className={cn(
          "flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors group",
          hasPreview && "cursor-pointer"
        )}
        onClick={handleClick}
      >
        {/* Thumbnail or Icon */}
        <div className="relative flex-shrink-0">
          {hasThumbnail ? (
            <div className="relative h-12 w-12 rounded-lg overflow-hidden">
              <img src={file.thumbnail} alt={file.name} className="h-full w-full object-cover" />
              {isVideoFile(file.type) && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Play className="h-4 w-4 text-white fill-white" />
                </div>
              )}
            </div>
          ) : (
            <div className="h-12 w-12 rounded-lg bg-muted/50 flex items-center justify-center">
              <FileIcon mimeType={file.type} className="h-6 w-6" showVideoOverlay />
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="font-medium text-sm truncate">{truncateFilename(file.name)}</p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{file.name}</p>
            </TooltipContent>
          </Tooltip>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <span>{formatFileSize(file.size)}</span>
            <span>•</span>
            <span>{format(new Date(file.uploadedAt), 'MMM d, yyyy')}</span>
          </div>
          {uploader && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <Avatar className="h-4 w-4">
                <AvatarImage src={uploader.avatar} />
                <AvatarFallback className="text-[8px]">{uploader.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">{uploader.name}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleDownload}>
                <Download className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download</TooltipContent>
          </Tooltip>
          {hasPreview && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleClick}>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Preview</TooltipContent>
            </Tooltip>
          )}
          {showRemove && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 text-destructive hover:text-destructive" 
                  onClick={handleRemove}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Remove</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};
