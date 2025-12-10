import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DynamicIcon, COMMON_ICONS, getAllIconNames } from './DynamicIcon';

interface IconSelectorProps {
  value: string;
  onChange: (iconName: string) => void;
}

export function IconSelector({ value, onChange }: IconSelectorProps) {
  const [search, setSearch] = useState('');
  const allIcons = useMemo(() => getAllIconNames(), []);

  // Filter icons based on search
  const filteredIcons = useMemo(() => {
    if (!search.trim()) {
      // Show common icons first, then rest alphabetically
      const commonSet = new Set(COMMON_ICONS);
      const others = allIcons.filter(name => !commonSet.has(name)).sort();
      return [...COMMON_ICONS, ...others];
    }

    const searchLower = search.toLowerCase();
    return allIcons.filter(name =>
      name.toLowerCase().includes(searchLower)
    ).sort();
  }, [search, allIcons]);

  return (
    <div className="space-y-3">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Cerca icona..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9"
        />
      </div>

      {/* Icons grid */}
      <ScrollArea className="h-[200px] rounded-md border p-2">
        <div className="grid grid-cols-8 gap-1">
          {filteredIcons.slice(0, 200).map((iconName) => (
            <button
              key={iconName}
              type="button"
              onClick={() => onChange(iconName)}
              className={`p-2 rounded-md hover:bg-muted transition-colors flex items-center justify-center ${
                value === iconName
                  ? 'bg-primary text-primary-foreground'
                  : ''
              }`}
              title={iconName}
            >
              <DynamicIcon name={iconName} className="h-4 w-4" />
            </button>
          ))}
        </div>
        {filteredIcons.length === 0 && (
          <div className="text-center text-muted-foreground py-4">
            Nessuna icona trovata
          </div>
        )}
        {filteredIcons.length > 200 && (
          <div className="text-center text-xs text-muted-foreground py-2">
            Mostrando 200 di {filteredIcons.length} icone. Usa la ricerca per trovare quella giusta.
          </div>
        )}
      </ScrollArea>

      {/* Selected icon preview */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Selezionata:</span>
        <DynamicIcon name={value} className="h-4 w-4" />
        <span className="font-mono text-xs">{value}</span>
      </div>
    </div>
  );
}
