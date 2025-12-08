import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { Toaster } from '@/components/ui/toaster';
import { ServerOffline } from '@/components/ServerOffline';
import { useServerHealth } from '@/hooks/useServerHealth';

function App() {
  const { isOnline, isChecking, checkHealth } = useServerHealth();

  // Show loading state only on initial check
  if (isChecking && !isOnline) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Connessione al server...</div>
      </div>
    );
  }

  // Show offline screen when server is down
  if (!isOnline) {
    return <ServerOffline onRetry={checkHealth} isRetrying={isChecking} />;
  }

  return (
    <div className="h-full">
      <KanbanBoard />
      <Toaster />
    </div>
  );
}

export default App;
