import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, FolderOpen, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Docs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const recentDocs = [
    { id: '1', name: 'Project Requirements', updatedAt: '2 hours ago', type: 'document' },
    { id: '2', name: 'Meeting Notes - Q4 Planning', updatedAt: '1 day ago', type: 'document' },
    { id: '3', name: 'API Documentation', updatedAt: '3 days ago', type: 'document' },
    { id: '4', name: 'Design System Guidelines', updatedAt: '1 week ago', type: 'document' },
    { id: '5', name: 'Sprint Retrospective', updatedAt: '2 weeks ago', type: 'document' },
  ];

  const folders = [
    { id: '1', name: 'Project Files', count: 12 },
    { id: '2', name: 'Templates', count: 5 },
    { id: '3', name: 'Archives', count: 23 },
  ];

  const filteredDocs = useMemo(() => {
    if (!searchQuery.trim()) return recentDocs;
    const query = searchQuery.toLowerCase();
    return recentDocs.filter((doc) => doc.name.toLowerCase().includes(query));
  }, [searchQuery]);

  const filteredFolders = useMemo(() => {
    if (!searchQuery.trim()) return folders;
    const query = searchQuery.toLowerCase();
    return folders.filter((folder) => folder.name.toLowerCase().includes(query));
  }, [searchQuery]);

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Documents"
        description="Manage your team documents and files"
      />
      <div className="flex-1 p-6 space-y-6">
        {/* Search and Actions */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Document
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Folders */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Folders {searchQuery && `(${filteredFolders.length})`}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {filteredFolders.length > 0 ? (
                filteredFolders.map((folder) => (
                  <button
                    key={folder.id}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
                  >
                    <FolderOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 text-left">{folder.name}</span>
                    <span className="text-xs text-muted-foreground">{folder.count}</span>
                  </button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No folders found</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Documents */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Recent Documents {searchQuery && `(${filteredDocs.length})`}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc) => (
                  <button
                    key={doc.id}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-muted transition-colors"
                  >
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 text-left font-medium">{doc.name}</span>
                    <span className="text-xs text-muted-foreground">{doc.updatedAt}</span>
                  </button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No documents found</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Docs;
