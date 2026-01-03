import React from 'react';
import { Sparkles, FileBarChart, Lightbulb, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface AIButtonProps {
  icon: React.ElementType;
  label: string;
  description: string;
  className?: string;
}

const AIButton: React.FC<AIButtonProps> = ({ icon: Icon, label, description, className }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        variant="outline"
        size="sm"
        disabled
        className={cn(
          'gap-2 opacity-60 cursor-not-allowed hover:opacity-60',
          className
        )}
      >
        <Icon className="h-4 w-4" />
        {label}
      </Button>
    </TooltipTrigger>
    <TooltipContent side="bottom" className="max-w-xs">
      <p className="font-medium">{label}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
      <p className="text-xs text-primary mt-1">Coming soon</p>
    </TooltipContent>
  </Tooltip>
);

export const SummarizeProjectButton: React.FC<{ className?: string }> = ({ className }) => (
  <AIButton
    icon={Sparkles}
    label="Summarize"
    description="AI will analyze project progress and generate a summary"
    className={className}
  />
);

export const GenerateReportButton: React.FC<{ className?: string }> = ({ className }) => (
  <AIButton
    icon={FileBarChart}
    label="Generate Report"
    description="AI will create a detailed project report with insights"
    className={className}
  />
);

export const SmartSuggestionsButton: React.FC<{ className?: string }> = ({ className }) => (
  <AIButton
    icon={Lightbulb}
    label="Get Suggestions"
    description="AI will suggest task priorities and assignments"
    className={className}
  />
);

export const AutoAssignButton: React.FC<{ className?: string }> = ({ className }) => (
  <AIButton
    icon={Wand2}
    label="Auto-Assign"
    description="AI will automatically assign tasks based on workload and skills"
    className={className}
  />
);

export const AISuggestionsPanel: React.FC = () => (
  <Card className="border-dashed opacity-75">
    <CardHeader className="pb-3">
      <CardTitle className="text-sm font-medium flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        AI Suggestions
      </CardTitle>
      <CardDescription className="text-xs">
        Intelligent recommendations powered by AI
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
          <Lightbulb className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">Coming Soon</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
          AI-powered task suggestions, priority recommendations, and workflow optimizations
        </p>
      </div>
    </CardContent>
  </Card>
);
