import { useState } from 'react';
import { ServerOff, Terminal, Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ServerOfflineProps {
  onRetry: () => void;
  isRetrying: boolean;
}

export function ServerOffline({ onRetry, isRetrying }: ServerOfflineProps) {
  const [copied, setCopied] = useState(false);
  const startCommand = './lsm-localserver-manager start prompto';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(startCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-6 shadow-lg">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-amber-100 dark:bg-amber-900/30">
            <ServerOff className="h-12 w-12 text-amber-600 dark:text-amber-400" />
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Server non raggiungibile
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Il backend di Prompto non è attivo. Avvialo per continuare.
          </p>
        </div>

        {/* Command Box */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Terminal className="h-4 w-4" />
            <span>Esegui nel terminale:</span>
          </div>
          <div className="relative">
            <code className="block bg-slate-900 dark:bg-slate-800 text-green-400 p-4 rounded-lg text-sm font-mono text-left overflow-x-auto">
              {startCommand}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="absolute top-2 right-2 h-8 w-8 p-0 bg-slate-800 hover:bg-slate-700"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4 text-slate-400" />
              )}
            </Button>
          </div>
        </div>

        {/* Alternative: Full Dashboard */}
        <div className="pt-2 space-y-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Oppure apri la dashboard completa:
          </p>
          <code className="block bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 p-2 rounded text-xs font-mono">
            ./lsm-localserver-manager
          </code>
        </div>

        {/* Retry Button */}
        <Button
          onClick={onRetry}
          disabled={isRetrying}
          className="w-full gap-2"
          size="lg"
        >
          <RefreshCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Verifica in corso...' : 'Riprova connessione'}
        </Button>

        {/* Hint */}
        <p className="text-xs text-slate-400 dark:text-slate-500">
          La pagina si aggiornerà automaticamente quando il server sarà attivo
        </p>
      </Card>
    </div>
  );
}
