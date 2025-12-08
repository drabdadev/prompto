import { useState, useEffect, useRef, useCallback } from 'react';
import { Download, Upload, Trash2, HardDrive, RefreshCw, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { databaseApi, type Backup } from '@/services/api';

interface DatabaseManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DatabaseManagementDialog({ open, onOpenChange }: DatabaseManagementDialogProps) {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [restoreConfirm, setRestoreConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const loadBackups = useCallback(async () => {
    try {
      setLoading(true);
      const data = await databaseApi.listBackups();
      setBackups(data.backups);
    } catch {
      toast({
        title: 'Errore',
        description: 'Impossibile caricare i backup',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (open) {
      loadBackups();
    }
  }, [open, loadBackups]);

  const handleDownloadCurrent = async () => {
    try {
      setActionLoading(true);
      const blob = await databaseApi.downloadCurrentDatabase();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      link.download = `prompto-backup-${timestamp}.db`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast({
        title: 'Download avviato',
        description: 'Il backup del database e stato scaricato',
      });
    } catch {
      toast({
        title: 'Errore',
        description: 'Impossibile scaricare il database',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    try {
      setActionLoading(true);
      const result = await databaseApi.createBackup();
      toast({
        title: 'Backup creato',
        description: `File: ${result.filename}`,
      });
      loadBackups();
    } catch {
      toast({
        title: 'Errore',
        description: 'Impossibile creare il backup',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadBackup = async (filename: string) => {
    try {
      setActionLoading(true);
      const blob = await databaseApi.downloadBackup(filename);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      toast({
        title: 'Errore',
        description: 'Impossibile scaricare il backup',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteBackup = async (filename: string) => {
    try {
      setActionLoading(true);
      await databaseApi.deleteBackup(filename);
      toast({
        title: 'Backup eliminato',
        description: filename,
      });
      setDeleteConfirm(null);
      loadBackups();
    } catch {
      toast({
        title: 'Errore',
        description: 'Impossibile eliminare il backup',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.db')) {
        toast({
          title: 'File non valido',
          description: 'Seleziona un file .db',
          variant: 'destructive',
        });
        return;
      }
      setRestoreFile(file);
      setRestoreConfirm(true);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRestore = async () => {
    if (!restoreFile) return;

    try {
      setActionLoading(true);
      await databaseApi.restoreBackup(restoreFile);
      toast({
        title: 'Ripristino completato',
        description: 'Riavvia l\'applicazione per applicare le modifiche',
      });
      setRestoreConfirm(false);
      setRestoreFile(null);
      loadBackups();
    } catch {
      toast({
        title: 'Errore',
        description: 'Impossibile ripristinare il database',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Gestione DB
          </DialogTitle>
          <DialogDescription>
            Crea backup, ripristina o scarica il database
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              onClick={handleDownloadCurrent}
              disabled={actionLoading}
              className="w-full"
              variant="default"
            >
              <Download className="h-4 w-4 mr-2" />
              Scarica Database
            </Button>

            <Button
              onClick={handleCreateBackup}
              disabled={actionLoading}
              className="w-full"
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${actionLoading ? 'animate-spin' : ''}`} />
              Crea Backup
            </Button>
          </div>

          {/* Restore */}
          <div className="border rounded-lg p-4 bg-muted/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-sm mb-1">Ripristina Database</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Carica un file .db per sostituire il database corrente. Verra creato un backup automatico prima del ripristino.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".db"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={actionLoading}
                  variant="outline"
                  size="sm"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Seleziona file .db
                </Button>
              </div>
            </div>
          </div>

          {/* Backups List */}
          <div>
            <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
              Backup
              <Button
                onClick={loadBackups}
                disabled={loading}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </h4>

            {loading ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Caricamento...
              </div>
            ) : backups.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm border rounded-lg">
                Nessun backup disponibile
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {backups.map((backup) => (
                  <div
                    key={backup.name}
                    className="flex items-center justify-between p-3 border rounded-lg bg-card"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{backup.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(backup.size)} - {formatDate(backup.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        onClick={() => handleDownloadBackup(backup.name)}
                        disabled={actionLoading}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Scarica"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      {deleteConfirm === backup.name ? (
                        <div className="flex items-center gap-1">
                          <Button
                            onClick={() => handleDeleteBackup(backup.name)}
                            disabled={actionLoading}
                            variant="destructive"
                            size="sm"
                            className="h-8 px-2 text-xs"
                          >
                            Conferma
                          </Button>
                          <Button
                            onClick={() => setDeleteConfirm(null)}
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs"
                          >
                            Annulla
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => setDeleteConfirm(backup.name)}
                          disabled={actionLoading}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          title="Elimina"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Restore Confirmation Dialog */}
        {restoreConfirm && restoreFile && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
            <div className="bg-background border rounded-lg p-6 max-w-md mx-4 shadow-lg">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Conferma Ripristino</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Stai per sostituire il database con: <strong>{restoreFile.name}</strong>
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Tutti i dati attuali verranno sovrascritti. Verra creato un backup automatico prima del ripristino.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => {
                    setRestoreConfirm(false);
                    setRestoreFile(null);
                  }}
                  variant="outline"
                  disabled={actionLoading}
                >
                  Annulla
                </Button>
                <Button
                  onClick={handleRestore}
                  variant="destructive"
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Ripristino...' : 'Ripristina'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
