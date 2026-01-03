import React, { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface InlineTaskAddProps {
  onAdd: (title: string) => void;
  placeholder?: string;
  className?: string;
  columnId?: string;
}

export const InlineTaskAdd: React.FC<InlineTaskAddProps> = ({
  onAdd,
  placeholder = 'Add a task...',
  className,
  columnId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSubmit = () => {
    if (value.trim()) {
      onAdd(value.trim());
      setValue('');
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setValue('');
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className={cn('p-2', className)}>
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          placeholder="Task name..."
          className="h-8 text-sm"
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className={cn(
        'w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground rounded-md transition-colors',
        'hover:bg-muted/50 hover:text-foreground',
        className
      )}
    >
      <Plus className="h-4 w-4" />
      {placeholder}
    </button>
  );
};
