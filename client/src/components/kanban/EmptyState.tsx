import { FolderPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onAddProject: () => void;
}

export function EmptyState({ onAddProject }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <FolderPlus className="h-8 w-8 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">
        Nessun progetto
      </h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Crea il tuo primo progetto per organizzare i prompt AI.
        Ogni progetto diventa una colonna nella tua Kanban board.
      </p>
      <Button onClick={onAddProject}>
        <FolderPlus className="h-4 w-4 mr-2" />
        Crea il primo progetto
      </Button>
    </div>
  );
}
