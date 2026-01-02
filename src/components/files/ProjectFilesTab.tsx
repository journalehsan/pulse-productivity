import React, { useState, useMemo } from 'react';
import { Search, Upload, Grid, List, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { TaskFile } from '@/types';
import { FileItem } from './FileItem';
import { FilePreviewModal } from './FilePreviewModal';
import { AddFilesModal } from './AddFilesModal';
import { getProjectFiles } from '@/data/mockFiles';
import { getFileCategory } from '@/lib/file-utils';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ProjectFilesTabProps {
  projectId: string;
}

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | 'image' | 'video' | 'document' | 'spreadsheet' | 'archive' | 'other';

export const ProjectFilesTab: React.FC<ProjectFilesTabProps> = ({ projectId }) => {
  const [files, setFiles] = useState<TaskFile[]>(() => getProjectFiles(projectId));
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [previewFile, setPreviewFile] = useState<TaskFile | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredFiles = useMemo(() => {
    return files.filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
      const category = getFileCategory(file.type);
      const matchesFilter = filterType === 'all' || 
        (filterType === 'other' 
          ? ['code', 'text', 'generic'].includes(category)
          : category === filterType);
      return matchesSearch && matchesFilter;
    });
  }, [files, searchQuery, filterType]);

  const handleRemoveFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    toast({
      title: "File deleted",
      description: "The file has been removed from the project.",
    });
  };

  const handleAddFiles = (newFiles: TaskFile[]) => {
    setFiles(prev => [...prev, ...newFiles]);
    toast({
      title: "Files uploaded",
      description: `${newFiles.length} file(s) have been added to the project.`,
    });
  };

  const handlePreviewNavigate = (direction: 'prev' | 'next') => {
    if (!previewFile) return;
    const previewableFiles = filteredFiles.filter(f => 
      f.type.startsWith('image/') || f.type.startsWith('video/')
    );
    const currentIndex = previewableFiles.findIndex(f => f.id === previewFile.id);
    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < previewableFiles.length) {
      setPreviewFile(previewableFiles[newIndex]);
    }
  };

  const previewableFiles = filteredFiles.filter(f => 
    f.type.startsWith('image/') || f.type.startsWith('video/')
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={filterType} onValueChange={(v) => setFilterType(v as FilterType)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Files</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="document">Documents</SelectItem>
              <SelectItem value="spreadsheet">Spreadsheets</SelectItem>
              <SelectItem value="archive">Archives</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex border border-border rounded-md">
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-9 w-9 rounded-r-none"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-9 w-9 rounded-l-none"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      {/* Files */}
      {filteredFiles.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-border rounded-lg">
          <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-medium mb-1">No files found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchQuery || filterType !== 'all' 
              ? 'Try adjusting your search or filter'
              : 'Upload files to get started'}
          </p>
          {!searchQuery && filterType === 'all' && (
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
          )}
        </div>
      ) : viewMode === 'list' ? (
        <div className="space-y-2">
          {filteredFiles.map(file => (
            <FileItem
              key={file.id}
              file={file}
              onRemove={handleRemoveFile}
              onPreview={setPreviewFile}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filteredFiles.map(file => (
            <div
              key={file.id}
              className={cn(
                "group relative rounded-lg border border-border bg-card overflow-hidden hover:border-primary/50 transition-colors cursor-pointer"
              )}
              onClick={() => {
                if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
                  setPreviewFile(file);
                }
              }}
            >
              {file.thumbnail ? (
                <div className="aspect-square">
                  <img 
                    src={file.thumbnail} 
                    alt={file.name} 
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square flex items-center justify-center bg-muted/30">
                  <span className="text-2xl font-bold text-muted-foreground uppercase">
                    {file.name.split('.').pop()?.slice(0, 3)}
                  </span>
                </div>
              )}
              <div className="p-2">
                <p className="text-xs font-medium truncate">{file.name}</p>
              </div>
            </div>
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
