import { Plus, Layout, Server, Layers, Settings, Sun, Moon, HardDrive, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { FilterType } from '@/types';

interface FilterBarProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onAddProject: () => void;
  editMode: boolean;
  onEditModeChange: (enabled: boolean) => void;
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
  onDatabaseManagement: () => void;
}

export function FilterBar({ filter, onFilterChange, onAddProject, editMode, onEditModeChange, isDarkMode, onDarkModeToggle, onDatabaseManagement }: FilterBarProps) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-border">
      <div className="flex items-center gap-2 min-w-0">
        <ToggleGroup
          type="single"
          value={filter}
          onValueChange={(value) => value && onFilterChange(value as FilterType)}
          className="bg-muted rounded-lg p-1"
        >
          <ToggleGroupItem
            value="all"
            className="px-3 py-1.5 text-sm gap-1.5 data-[state=on]:bg-card data-[state=on]:shadow-sm rounded"
          >
            <Layers className="h-4 w-4" />
            Vedi tutti
          </ToggleGroupItem>
          <ToggleGroupItem
            value="ui"
            className="px-3 py-1.5 text-sm gap-1.5 data-[state=on]:bg-green-100 data-[state=on]:text-green-800 dark:data-[state=on]:bg-green-900 dark:data-[state=on]:text-green-200 rounded"
          >
            <Layout className="h-4 w-4" />
            Frontend
          </ToggleGroupItem>
          <ToggleGroupItem
            value="backend"
            className="px-3 py-1.5 text-sm gap-1.5 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-800 dark:data-[state=on]:bg-blue-900 dark:data-[state=on]:text-blue-200 rounded"
          >
            <Server className="h-4 w-4" />
            Backend
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex items-center gap-3">
        {/* Help icon with keyboard shortcuts tooltip */}
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="p-1.5 rounded-md hover:bg-muted transition-colors"
                aria-label="Keyboard shortcuts"
              >
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs p-3 text-left">
              <p className="font-medium mb-2">Scorciatoie da tastiera</p>
              <div className="space-y-1.5 text-xs">
                <p><kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono">E</kbd> Modifica prompt</p>
                <p><kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono">A</kbd> Archivia / Ripristina</p>
                <p><kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono">C</kbd> Copia prompt</p>
                <p><kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono">Canc</kbd> Elimina prompt</p>
              </div>
              <p className="text-[10px] text-gray-500 mt-2 pt-2 border-t border-gray-200">
                Passa il mouse su un prompt per attivare le scorciatoie
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <button
          onClick={onDarkModeToggle}
          className="p-1.5 rounded-md hover:bg-muted transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? (
            <Sun className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Moon className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        <div className="flex items-center gap-1.5">
          <Settings className="h-4 w-4 text-muted-foreground" />
          <Switch
            checked={editMode}
            onCheckedChange={onEditModeChange}
            aria-label="Toggle edit mode"
          />
        </div>
      </div>
      </div>

      {editMode && (
        <div className="flex justify-center items-center gap-4 pt-6">
          <Button onClick={onAddProject} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Aggiungi progetto
          </Button>
          <Button onClick={onDatabaseManagement} size="sm" variant="ghost" className="text-muted-foreground">
            <HardDrive className="h-4 w-4 mr-1" />
            Gestione DB
          </Button>
        </div>
      )}
    </div>
  );
}
