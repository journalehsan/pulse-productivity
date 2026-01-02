import React, { useState } from 'react';
import { Plus, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskFile } from '@/types';
import { FileItem } from './FileItem';
import { FilePreviewModal } from './FilePreviewModal';
import { AddFilesModal } from './AddFilesModal';
import { getTaskFiles } from '@/data/mockFiles';
import { toast } from '@/hooks/use-toast';

interface TaskAttachmentsProps {
  taskId: string;
  projectId: string;
}

export const TaskAttachments: React.FC<TaskAttachmentsProps> = ({
  taskId,
  projectId,
}) => {
  const [files, setFiles] = useState<TaskFile[]>(() => getTaskFiles(taskId));
  const [previewFile, setPreviewFile] = useState<TaskFile | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleRemoveFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    toast({
      title: "File removed",
      description: "The file has been removed from this task.",
    });
  };

  const handleAddFiles = (newFiles: TaskFile[]) => {
    setFiles(prev => [...prev, ...newFiles]);
    toast({
      title: "Files added",
      description: `${newFiles.length} file(s) have been attached to this task.`,
    });
  };

  const handlePreviewNavigate = (direction: 'prev' | 'next') => {
    if (!previewFile) return;
    const currentIndex = files.findIndex(f => f.id === previewFile.id);
    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < files.length) {
      setPreviewFile(files[newIndex]);
    }
  };

  const previewableFiles = files.filter(f => 
    f.type.startsWith('image/') || f.type.startsWith('video/')
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
          <Paperclip className="h-3 w-3" /> Attachments ({files.length})
        </label>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Files
        </Button>
      </div>

      {files.length === 0 ? (
        <div 
          className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Paperclip className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            No files attached
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Click to add files
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {files.map(file => (
            <FileItem
              key={file.id}
              file={file}
              onRemove={handleRemoveFile}
              onPreview={setPreviewFile}
            />
          ))}
        </div>
      )}

      {/* Preview Modal */}
      <FilePreviewModal
        file={previewFile}
        files={previewableFiles}
        onClose={() => setPreviewFile(null)}
        onNavigate={handlePreviewNavigate}
      />

      {/* Add Files Modal */}
      <AddFilesModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddFiles={handleAddFiles}
        projectId={projectId}
        existingFileIds={files.map(f => f.id)}
      />
    </div>
  );
};
