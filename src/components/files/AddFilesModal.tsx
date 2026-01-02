import React, { useState, useCallback, useRef } from 'react';
import { Upload, FolderOpen, Search, Check, X, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TaskFile } from '@/types';
import { FileItem } from './FileItem';
import { 
  formatFileSize, 
  validateFileSize, 
  validateFileType, 
  createTaskFile,
  MAX_FILE_SIZE 
} from '@/lib/file-utils';
import { getProjectFiles } from '@/data/mockFiles';
import { cn } from '@/lib/utils';

interface AddFilesModalProps {
  open: boolean;
  onClose: () => void;
  onAddFiles: (files: TaskFile[]) => void;
  projectId: string;
  existingFileIds?: string[];
}

interface UploadingFile {
  file: File;
  progress: number;
  error?: string;
}

export const AddFilesModal: React.FC<AddFilesModalProps> = ({
  open,
  onClose,
  onAddFiles,
  projectId,
  existingFileIds = [],
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'existing'>('upload');
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [saveToFilesTab, setSaveToFilesTab] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const projectFiles = getProjectFiles(projectId).filter(
    f => !existingFileIds.includes(f.id)
  );

  const filteredProjectFiles = projectFiles.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processFiles = (files: File[]) => {
    const newUploadingFiles: UploadingFile[] = files.map(file => {
      let error: string | undefined;
      
      if (!validateFileSize(file.size)) {
        error = `File exceeds ${formatFileSize(MAX_FILE_SIZE)} limit`;
      } else if (!validateFileType(file.type)) {
        error = 'Unsupported file type';
      }

      return { file, progress: error ? 0 : 0, error };
    });

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    // Simulate upload progress for valid files
    newUploadingFiles.forEach((uploadingFile, index) => {
      if (!uploadingFile.error) {
        simulateUpload(uploadingFiles.length + index);
      }
    });
  };

  const simulateUpload = (index: number) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30 + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setUploadingFiles(prev => {
        const updated = [...prev];
        if (updated[index]) {
          updated[index] = { ...updated[index], progress };
        }
        return updated;
      });
    }, 200);
  };

  const removeUploadingFile = (index: number) => {
    setUploadingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleConfirm = () => {
    const newFiles: TaskFile[] = [];

    // Add uploaded files
    uploadingFiles
      .filter(uf => uf.progress === 100 && !uf.error)
      .forEach(uf => {
        newFiles.push(createTaskFile(uf.file, 'user-1'));
      });

    // Add selected existing files
    selectedFiles.forEach(fileId => {
      const file = projectFiles.find(f => f.id === fileId);
      if (file) {
        newFiles.push({ ...file, id: `${file.id}-copy-${Date.now()}` });
      }
    });

    onAddFiles(newFiles);
    handleClose();
  };

  const handleClose = () => {
    setUploadingFiles([]);
    setSelectedFiles([]);
    setSearchQuery('');
    setActiveTab('upload');
    onClose();
  };

  const completedUploads = uploadingFiles.filter(f => f.progress === 100 && !f.error).length;
  const totalToAdd = completedUploads + selectedFiles.length;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Files</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'upload' | 'existing')}>
          <TabsList className="w-full">
            <TabsTrigger value="upload" className="flex-1 gap-2">
              <Upload className="h-4 w-4" />
              Upload New
            </TabsTrigger>
            <TabsTrigger value="existing" className="flex-1 gap-2">
              <FolderOpen className="h-4 w-4" />
              From Files Tab
            </TabsTrigger>
          </TabsList>

          {/* Upload New Tab */}
          <TabsContent value="upload" className="mt-4">
            {/* Drop Zone */}
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                isDragging 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium mb-1">
                Drag and drop files here
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                or click to browse (max {formatFileSize(MAX_FILE_SIZE)} per file)
              </p>
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                Browse Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.gif,.webp,.svg,.mp4,.webm,.mov,.zip,.rar,.txt,.json"
              />
            </div>

            {/* Uploading Files List */}
            {uploadingFiles.length > 0 && (
              <ScrollArea className="mt-4 max-h-48">
                <div className="space-y-2">
                  {uploadingFiles.map((uf, index) => (
                    <div 
                      key={index} 
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border",
                        uf.error ? "border-destructive/50 bg-destructive/5" : "border-border"
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{uf.file.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {formatFileSize(uf.file.size)}
                          </span>
                          {uf.error ? (
                            <span className="text-xs text-destructive flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {uf.error}
                            </span>
                          ) : uf.progress === 100 ? (
                            <span className="text-xs text-emerald-500 flex items-center gap-1">
                              <Check className="h-3 w-3" />
                              Uploaded
                            </span>
                          ) : (
                            <Progress value={uf.progress} className="h-1 flex-1 max-w-24" />
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => removeUploadingFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}

            {/* Save to Files Tab Option */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
              <Checkbox
                id="save-to-files"
                checked={saveToFilesTab}
                onCheckedChange={(checked) => setSaveToFilesTab(!!checked)}
              />
              <label htmlFor="save-to-files" className="text-sm cursor-pointer">
                Also save to Files tab
              </label>
            </div>
          </TabsContent>

          {/* From Files Tab */}
          <TabsContent value="existing" className="mt-4">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Files List */}
            <ScrollArea className="h-64">
              {filteredProjectFiles.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FolderOpen className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No files available</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredProjectFiles.map(file => (
                    <div 
                      key={file.id}
                      className={cn(
                        "flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-colors",
                        selectedFiles.includes(file.id) 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:bg-accent/50"
                      )}
                      onClick={() => toggleFileSelection(file.id)}
                    >
                      <Checkbox
                        checked={selectedFiles.includes(file.id)}
                        onCheckedChange={() => toggleFileSelection(file.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <FileItem file={file} showRemove={false} compact />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {selectedFiles.length > 0 && (
              <p className="text-sm text-muted-foreground mt-3">
                {selectedFiles.length} file(s) selected
              </p>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={totalToAdd === 0}>
            Add {totalToAdd > 0 ? `${totalToAdd} File${totalToAdd > 1 ? 's' : ''}` : 'Files'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
