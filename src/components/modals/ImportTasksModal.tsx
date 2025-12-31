import React, { useState, useCallback, useMemo } from 'react';
import { Upload, FileSpreadsheet, Download, ChevronLeft, ChevronRight, Check, AlertCircle, AlertTriangle, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { Task } from '@/types';
import {
  ImportRow,
  ImportMapping,
  ImportIssue,
  ImportStep,
  FileType,
  TASK_FIELD_OPTIONS,
} from '@/types/import';
import {
  parseCSV,
  parseXLSX,
  autoDetectMapping,
  applyMapping,
  downloadTemplate,
} from '@/lib/import-utils';
import { toast } from 'sonner';

interface ImportTasksModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onImport: (tasks: Task[]) => void;
}

const STEPS: { key: ImportStep; label: string }[] = [
  { key: 'upload', label: 'Upload' },
  { key: 'map', label: 'Map Columns' },
  { key: 'preview', label: 'Preview' },
  { key: 'validate', label: 'Validate' },
];

export const ImportTasksModal: React.FC<ImportTasksModalProps> = ({
  open,
  onOpenChange,
  projectId,
  onImport,
}) => {
  const [step, setStep] = useState<ImportStep>('upload');
  const [fileType, setFileType] = useState<FileType>('csv');
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [mapping, setMapping] = useState<ImportMapping>({ title: '' });
  const [issues, setIssues] = useState<ImportIssue[]>([]);
  const [parsedTasks, setParsedTasks] = useState<Task[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [issuesOpen, setIssuesOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  const handleReset = useCallback(() => {
    setStep('upload');
    setFile(null);
    setRows([]);
    setColumns([]);
    setMapping({ title: '' });
    setIssues([]);
    setParsedTasks([]);
    setParseError(null);
    setIssuesOpen(false);
  }, []);

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    setFile(selectedFile);
    setParseError(null);
    setIsProcessing(true);

    try {
      const isXlsx = selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls');
      
      if (isXlsx) {
        setFileType('xlsx');
        const result = await parseXLSX(selectedFile);
        if (result.error) {
          setParseError(result.error);
          setIsProcessing(false);
          return;
        }
        setRows(result.rows);
        setColumns(result.columns);
        setMapping(autoDetectMapping(result.columns));
      } else {
        setFileType('csv');
        const result = await parseCSV(selectedFile);
        setRows(result.rows);
        setColumns(result.columns);
        setMapping(autoDetectMapping(result.columns));
      }
      
      setStep('map');
    } catch (error) {
      setParseError('Failed to parse file. Please check the format.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  }, [handleFileSelect]);

  const handleMappingChange = useCallback((field: keyof ImportMapping, column: string) => {
    setMapping((prev) => ({
      ...prev,
      [field]: column || undefined,
    }));
  }, []);

  const validateAndPreview = useCallback(() => {
    const result = applyMapping(rows, mapping, projectId);
    setParsedTasks(result.tasks);
    setIssues(result.issues);
    setStep('validate');
  }, [rows, mapping, projectId]);

  const errorCount = useMemo(() => issues.filter((i) => i.severity === 'error').length, [issues]);
  const warningCount = useMemo(() => issues.filter((i) => i.severity === 'warning').length, [issues]);
  const validCount = useMemo(() => rows.length - errorCount, [rows.length, errorCount]);

  const canImport = errorCount === 0 && parsedTasks.length > 0;

  const handleImport = useCallback(() => {
    if (!canImport) return;
    
    onImport(parsedTasks);
    toast.success(`Imported ${parsedTasks.length} tasks${warningCount > 0 ? ` (${warningCount} warnings)` : ''}`);
    onOpenChange(false);
    handleReset();
  }, [canImport, parsedTasks, warningCount, onImport, onOpenChange, handleReset]);

  const handleNext = useCallback(() => {
    if (step === 'map') {
      setStep('preview');
    } else if (step === 'preview') {
      validateAndPreview();
    }
  }, [step, validateAndPreview]);

  const handleBack = useCallback(() => {
    if (step === 'map') {
      handleReset();
    } else if (step === 'preview') {
      setStep('map');
    } else if (step === 'validate') {
      setStep('preview');
    }
  }, [step, handleReset]);

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 py-4 border-b border-border">
      {STEPS.map((s, idx) => (
        <React.Fragment key={s.key}>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                idx < stepIndex
                  ? 'bg-primary text-primary-foreground'
                  : idx === stepIndex
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {idx < stepIndex ? <Check className="h-4 w-4" /> : idx + 1}
            </div>
            <span
              className={cn(
                'text-sm hidden sm:inline',
                idx === stepIndex ? 'font-medium' : 'text-muted-foreground'
              )}
            >
              {s.label}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div
              className={cn(
                'w-8 h-0.5',
                idx < stepIndex ? 'bg-primary' : 'bg-border'
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderUploadStep = () => (
    <div className="space-y-6 py-4">
      <div className="flex gap-2">
        <Button
          variant={fileType === 'csv' ? 'default' : 'outline'}
          onClick={() => setFileType('csv')}
          className="flex-1"
        >
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          CSV
        </Button>
        <Button
          variant={fileType === 'xlsx' ? 'default' : 'outline'}
          onClick={() => setFileType('xlsx')}
          className="flex-1"
        >
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Excel (.xlsx)
        </Button>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground mb-2">
          Drag and drop your file here, or click to browse
        </p>
        <p className="text-xs text-muted-foreground">
          Supports .csv{fileType === 'xlsx' ? ' and .xlsx' : ''} files
        </p>
        <input
          id="file-input"
          type="file"
          accept={fileType === 'xlsx' ? '.csv,.xlsx,.xls' : '.csv'}
          className="hidden"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) handleFileSelect(selectedFile);
          }}
        />
      </div>

      {parseError && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <p className="text-sm">{parseError}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => downloadTemplate(fileType)}>
          <Download className="h-4 w-4 mr-2" />
          Download Template
        </Button>
        <div className="text-xs text-muted-foreground">
          Supports nested tasks using Parent Task or Parent ID
        </div>
      </div>
    </div>
  );

  const renderMapStep = () => (
    <div className="space-y-4 py-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{file?.name}</p>
          <p className="text-sm text-muted-foreground">
            {rows.length} rows, {columns.length} columns detected
          </p>
        </div>
        <Badge variant="outline">{fileType.toUpperCase()}</Badge>
      </div>

      <ScrollArea className="h-[350px] pr-4">
        <div className="space-y-3">
          {TASK_FIELD_OPTIONS.filter((f) => f.value).map((field) => (
            <div key={field.value} className="flex items-center gap-4">
              <Label className="w-40 text-sm flex items-center gap-1">
                {field.label}
                {field.required && <span className="text-destructive">*</span>}
              </Label>
              <Select
                value={mapping[field.value as keyof ImportMapping] || ''}
                onValueChange={(value) => handleMappingChange(field.value as keyof ImportMapping, value)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select column..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Do not import</SelectItem>
                  {columns.map((col) => (
                    <SelectItem key={col} value={col}>
                      {col}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </ScrollArea>

      {!mapping.title && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <p className="text-sm">Task Title mapping is required</p>
        </div>
      )}
    </div>
  );

  const renderPreviewStep = () => (
    <div className="space-y-4 py-4">
      <p className="text-sm text-muted-foreground">
        Preview of first 20 rows. Verify the data looks correct before proceeding.
      </p>

      <ScrollArea className="h-[350px] border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              {columns.slice(0, 6).map((col) => (
                <TableHead key={col} className="min-w-[120px]">
                  {col}
                </TableHead>
              ))}
              {columns.length > 6 && <TableHead>...</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.slice(0, 20).map((row, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-mono text-xs">{idx + 1}</TableCell>
                {columns.slice(0, 6).map((col) => (
                  <TableCell key={col} className="max-w-[200px] truncate">
                    {String(row[col] ?? '')}
                  </TableCell>
                ))}
                {columns.length > 6 && <TableCell>...</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );

  const renderValidateStep = () => (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-muted rounded-lg text-center">
          <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 mb-1">
            <Check className="h-5 w-5" />
            <span className="text-2xl font-bold">{validCount}</span>
          </div>
          <p className="text-sm text-muted-foreground">Ready to import</p>
        </div>
        <div className="p-4 bg-muted rounded-lg text-center">
          <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
            <AlertTriangle className="h-5 w-5" />
            <span className="text-2xl font-bold">{warningCount}</span>
          </div>
          <p className="text-sm text-muted-foreground">Warnings</p>
        </div>
        <div className="p-4 bg-muted rounded-lg text-center">
          <div className="flex items-center justify-center gap-2 text-destructive mb-1">
            <X className="h-5 w-5" />
            <span className="text-2xl font-bold">{errorCount}</span>
          </div>
          <p className="text-sm text-muted-foreground">Errors</p>
        </div>
      </div>

      {issues.length > 0 && (
        <Collapsible open={issuesOpen} onOpenChange={setIssuesOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              View issues ({issues.length})
              <ChevronRight className={cn('h-4 w-4 transition-transform', issuesOpen && 'rotate-90')} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ScrollArea className="h-[200px] mt-2 border rounded-lg p-2">
              <div className="space-y-2">
                {issues.map((issue, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'flex items-start gap-2 p-2 rounded text-sm',
                      issue.severity === 'error' ? 'bg-destructive/10' : 'bg-amber-500/10'
                    )}
                  >
                    {issue.severity === 'error' ? (
                      <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-medium">Row {issue.rowIndex}:</span>{' '}
                      {issue.message}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CollapsibleContent>
        </Collapsible>
      )}

      {canImport && (
        <div className="p-3 bg-green-500/10 text-green-700 dark:text-green-400 rounded-lg flex items-center gap-2">
          <Check className="h-4 w-4" />
          <p className="text-sm">
            Ready to import {parsedTasks.length} tasks
            {warningCount > 0 && ` with ${warningCount} warning${warningCount > 1 ? 's' : ''}`}
          </p>
        </div>
      )}

      {!canImport && errorCount > 0 && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <p className="text-sm">
            Fix {errorCount} error{errorCount > 1 ? 's' : ''} before importing
          </p>
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={(open) => { onOpenChange(open); if (!open) handleReset(); }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Tasks</DialogTitle>
        </DialogHeader>

        {renderStepIndicator()}

        {step === 'upload' && renderUploadStep()}
        {step === 'map' && renderMapStep()}
        {step === 'preview' && renderPreviewStep()}
        {step === 'validate' && renderValidateStep()}

        {isProcessing && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        )}

        <div className="flex justify-between pt-4 border-t border-border">
          <Button variant="outline" onClick={() => { onOpenChange(false); handleReset(); }}>
            Cancel
          </Button>
          <div className="flex gap-2">
            {step !== 'upload' && (
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
            {step === 'map' && (
              <Button onClick={handleNext} disabled={!mapping.title}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
            {step === 'preview' && (
              <Button onClick={handleNext}>
                Validate
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
            {step === 'validate' && (
              <Button onClick={handleImport} disabled={!canImport}>
                <Upload className="h-4 w-4 mr-2" />
                Import {parsedTasks.length} Tasks
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
