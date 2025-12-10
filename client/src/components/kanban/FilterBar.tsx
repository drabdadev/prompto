import { Plus, Layers, HardDrive, Tags } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { DynamicIcon } from '@/components/DynamicIcon';
import type { FilterType, Category } from '@/types';

interface FilterBarProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onAddProject: () => void;
  editMode: boolean;
  categories: Category[];
  categoriesVisible: boolean;
  onCategoryManagement: () => void;
  onDatabaseManagement: () => void;
}

export function FilterBar({
  filter,
  onFilterChange,
  onAddProject,
  editMode,
  categories,
  categoriesVisible,
  onCategoryManagement,
  onDatabaseManagement,
}: FilterBarProps) {
  return (
    <div>
      {/* Category filters - only show if categoriesVisible */}
      {categoriesVisible && categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 pb-6 border-b border-border">
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
              Tutti
            </ToggleGroupItem>
            {categories.map((category) => (
              <ToggleGroupItem
                key={category.id}
                value={category.id}
                className="px-3 py-1.5 text-sm gap-1.5 rounded transition-colors"
                style={{
                  backgroundColor: filter === category.id ? category.color + '20' : undefined,
                  color: filter === category.id ? category.color : undefined,
                }}
              >
                <DynamicIcon name={category.icon} className="h-4 w-4" />
                {category.name}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      )}

      {/* Edit mode actions row */}
      {editMode && (
        <div className={`py-6 ${!(categoriesVisible && categories.length > 0) ? 'border-b border-border' : ''}`}>
          <div className="relative flex items-center justify-center">
            {/* Center: Add project */}
            <Button onClick={onAddProject} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Nuovo progetto
            </Button>

            {/* Right: Category management + Database management - absolutely positioned */}
            <div className="absolute right-0 flex items-center gap-1 sm:gap-2">
              <Button onClick={onCategoryManagement} size="sm" variant="ghost" className="text-muted-foreground px-2 sm:px-3">
                <Tags className="h-4 w-4 sm:mr-1" />
                <span className="hidden md:inline">Categorie</span>
              </Button>
              <Button onClick={onDatabaseManagement} size="sm" variant="ghost" className="text-muted-foreground px-2 sm:px-3">
                <HardDrive className="h-4 w-4 sm:mr-1" />
                <span className="hidden md:inline">Database</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
