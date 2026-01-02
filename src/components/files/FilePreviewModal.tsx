import React from 'react';
import { X, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TaskFile } from '@/types';
import { isImageFile, isVideoFile, formatFileSize } from '@/lib/file-utils';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface FilePreviewModalProps {
  file: TaskFile | null;
  files?: TaskFile[];
  onClose: () => void;
  onNavigate?: (direction: 'prev' | 'next') => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  file,
  files = [],
  onClose,
  onNavigate,
}) => {
  if (!file) return null;

  const currentIndex = files.findIndex(f => f.id === file.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < files.length - 1;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' && hasPrev) {
      onNavigate?.('prev');
    } else if (e.key === 'ArrowRight' && hasNext) {
      onNavigate?.('next');
    }
  };

  return (
    <Dialog open={!!file} onOpenChange={() => onClose()}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] p-0 overflow-hidden"
        onKeyDown={handleKeyDown}
      >
        <VisuallyHidden>
          <DialogTitle>File Preview: {file.name}</DialogTitle>
        </VisuallyHidden>
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{file.name}</h3>
            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="relative flex items-center justify-center bg-muted/30 min-h-[400px] max-h-[70vh]">
          {/* Navigation Arrows */}
          {files.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 z-10 bg-background/80 hover:bg-background disabled:opacity-30"
                onClick={() => onNavigate?.('prev')}
                disabled={!hasPrev}
                aria-label="Previous file"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 z-10 bg-background/80 hover:bg-background disabled:opacity-30"
                onClick={() => onNavigate?.('next')}
                disabled={!hasNext}
                aria-label="Next file"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}

          {/* Content */}
          {isImageFile(file.type) && file.url && (
            <img 
              src={file.url} 
              alt={file.name} 
              className="max-w-full max-h-[70vh] object-contain"
            />
          )}

          {isVideoFile(file.type) && file.url && (
            <video 
              src={file.url} 
              controls 
              className="max-w-full max-h-[70vh]"
              autoPlay={false}
            >
              Your browser does not support the video tag.
            </video>
          )}

          {!isImageFile(file.type) && !isVideoFile(file.type) && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Preview not available for this file type</p>
              <Button variant="outline" size="sm" className="mt-4">
                <Download className="h-4 w-4 mr-1" />
                Download to view
              </Button>
            </div>
          )}
        </div>

        {/* Footer with pagination indicator */}
        {files.length > 1 && (
          <div className="flex items-center justify-center gap-1 py-2 border-t border-border">
            {files.map((f, idx) => (
              <div
                key={f.id}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  f.id === file.id ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
