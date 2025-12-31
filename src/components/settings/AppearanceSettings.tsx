import React from 'react';
import { Palette, RotateCcw, Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTheme, ThemeMode, ThemePreset } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const ACCENT_SWATCHES = [
  { name: 'Purple', color: '#6D28D9' },
  { name: 'Blue', color: '#2563EB' },
  { name: 'Green', color: '#059669' },
  { name: 'Orange', color: '#EA580C' },
  { name: 'Pink', color: '#DB2777' },
  { name: 'Dracula Purple', color: '#BD93F9' },
];

export const AppearanceSettings: React.FC = () => {
  const { theme, setMode, setAccent, setPreset, resetTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Appearance
        </CardTitle>
        <CardDescription>
          Customize the look and feel of PulseTasks.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mode Selection */}
        <div className="space-y-3">
          <Label>Theme Mode</Label>
          <div className="flex gap-2">
            <Button
              variant={theme.mode === 'light' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('light')}
              className="flex-1 gap-2"
            >
              <Sun className="h-4 w-4" />
              Light
            </Button>
            <Button
              variant={theme.mode === 'dark' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('dark')}
              className="flex-1 gap-2"
            >
              <Moon className="h-4 w-4" />
              Dark
            </Button>
          </div>
        </div>

        {/* Preset Selection */}
        <div className="space-y-3">
          <Label>Theme Preset</Label>
          <div className="flex gap-2">
            <Button
              variant={theme.preset === 'default' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreset('default')}
              className="flex-1"
            >
              Default
            </Button>
            <Button
              variant={theme.preset === 'dracula' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreset('dracula')}
              className="flex-1"
            >
              Dracula
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Dracula preset applies special colors in dark mode.
          </p>
        </div>

        {/* Accent Color */}
        <div className="space-y-3">
          <Label>Accent Color</Label>
          <div className="flex gap-2 items-center">
            <div
              className="h-10 w-10 rounded-md border border-border flex-shrink-0"
              style={{ backgroundColor: theme.accent }}
            />
            <Input
              type="text"
              value={theme.accent}
              onChange={(e) => setAccent(e.target.value)}
              placeholder="#6D28D9"
              className="flex-1 font-mono"
            />
            <input
              type="color"
              value={theme.accent}
              onChange={(e) => setAccent(e.target.value)}
              className="h-10 w-10 cursor-pointer rounded-md border border-border p-1"
            />
          </div>
          
          {/* Quick Swatches */}
          <div className="flex flex-wrap gap-2">
            {ACCENT_SWATCHES.map((swatch) => (
              <button
                key={swatch.name}
                onClick={() => setAccent(swatch.color)}
                className={cn(
                  "h-8 w-8 rounded-full border-2 transition-transform hover:scale-110",
                  theme.accent.toUpperCase() === swatch.color.toUpperCase()
                    ? "border-foreground ring-2 ring-offset-2 ring-offset-background ring-foreground"
                    : "border-transparent"
                )}
                style={{ backgroundColor: swatch.color }}
                title={swatch.name}
              />
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-3">
          <Label>Preview</Label>
          <div className="flex flex-wrap gap-2">
            <Button size="sm">Primary Button</Button>
            <Button size="sm" variant="outline">Outline</Button>
            <Button size="sm" variant="secondary">Secondary</Button>
            <Button size="sm" variant="ghost">Ghost</Button>
            <Button size="sm" variant="destructive">Destructive</Button>
          </div>
        </div>

        {/* Reset */}
        <div className="pt-4 border-t border-border">
          <Button variant="outline" size="sm" onClick={resetTheme} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset to Default
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
