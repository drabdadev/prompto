import { useState, useRef, useEffect, useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Copy, Trash2, RotateCcw, GripHorizontal, AlertTriangle, Archive, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DynamicIcon } from '@/components/DynamicIcon';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import type { Prompt, Category } from '@/types';

interface PromptCardProps {
  prompt: Prompt;
  projectId: string;
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string, archived: boolean) => void;
  onUpdate: (id: string, content: string, categoryId: string | null) => void;
  showArchived: boolean;
  categoriesVisible: boolean;
  getCategoryById: (id: string | null) => Category | undefined;
}

export function PromptCard({ prompt, projectId, onDelete, onArchive, onUpdate, showArchived, categoriesVisible, getCategoryById }: PromptCardProps) {
  const { copy } = useCopyToClipboard();
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(prompt.content);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const deleteConfirmRef = useRef<HTMLDivElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: prompt.id,
    disabled: isEditing,
    data: { projectId, type: 'prompt' },
  });

  // Use simpler transform like columns - disable transitions during drag for performance
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? undefined : transition,
    opacity: isDragging ? 0.95 : 1,
    zIndex: isDragging ? 9999 : undefined,
    position: isDragging ? 'relative' : undefined,
  };

  // Auto-resize textarea based on content
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.max(80, textarea.scrollHeight)}px`;
    }
  };

  // Focus textarea when entering edit mode and position cursor at end
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      // Position cursor at the end only when first entering edit mode
      const len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
      adjustTextareaHeight();
    }
    // Only run when isEditing changes, not on content changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  // Adjust height when content changes during editing
  useEffect(() => {
    if (isEditing) {
      adjustTextareaHeight();
    }
  }, [editContent, isEditing]);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await copy(prompt.content);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleTextClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditContent(prompt.content);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editContent.trim() && editContent !== prompt.content) {
      onUpdate(prompt.id, editContent.trim(), prompt.category_id);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(prompt.content);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave();
    }
  };

  // Delete confirmation handlers
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConfirmingDelete(true);
  };

  const confirmDelete = useCallback(() => {
    onDelete(prompt.id);
    setIsConfirmingDelete(false);
  }, [onDelete, prompt.id]);

  const cancelDelete = useCallback(() => {
    setIsConfirmingDelete(false);
  }, []);

  // Handle keyboard events for delete confirmation
  useEffect(() => {
    if (!isConfirmingDelete) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        confirmDelete();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancelDelete();
      }
    };

    // Focus the confirmation panel for keyboard events
    deleteConfirmRef.current?.focus();

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isConfirmingDelete, confirmDelete, cancelDelete]);

  // Handle keyboard shortcuts when hovering over card (not editing)
  useEffect(() => {
    if (!isHovered || isEditing || isConfirmingDelete) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in any input/textarea
      const activeElement = document.activeElement;
      const isTyping = activeElement instanceof HTMLInputElement ||
                      activeElement instanceof HTMLTextAreaElement ||
                      activeElement?.getAttribute('contenteditable') === 'true';

      if (isTyping) return;

      // Delete/Backspace: show delete confirmation
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        setIsConfirmingDelete(true);
      }
      // E: edit the prompt
      else if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        setEditContent(prompt.content);
        setIsEditing(true);
      }
      // A: archive/restore the prompt
      else if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        if (!isArchiving) {
          setIsArchiving(true);
          setTimeout(() => {
            onArchive(prompt.id, !showArchived);
            setIsArchiving(false);
          }, 500);
        }
      }
      // C: copy the prompt
      else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        copy(prompt.content).then((success) => {
          if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHovered, isEditing, isConfirmingDelete, isArchiving, prompt.content, prompt.id, showArchived, onArchive, copy]);

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isArchiving) return;

    // Trigger animation
    setIsArchiving(true);

    // After animation completes, actually archive
    setTimeout(() => {
      onArchive(prompt.id, !showArchived);
      setIsArchiving(false);
    }, 500);
  };

  // Get category info for badge display
  const category = getCategoryById(prompt.category_id);

  // Build className - avoid transition-all during drag for performance
  const cardClassName = [
    'p-3 bg-card group relative transition-all duration-150',
    isArchiving && 'prompt-card archive-animation',
    isEditing && 'border-blue-500 dark:border-blue-400 shadow-[0_0_0_3px_rgba(59,130,246,0.3),0_4px_12px_0_rgba(59,130,246,0.15)] dark:shadow-[0_0_0_3px_rgba(59,130,246,0.4),0_4px_12px_0_rgba(59,130,246,0.2)]',
    isDragging && 'shadow-xl z-50 cursor-grabbing',
    !isDragging && !isEditing && !isArchiving && !isConfirmingDelete && 'hover:shadow-lg cursor-grab',
    // Subtle border glow on hover to indicate keyboard shortcuts are available
    isHovered && !isEditing && !isDragging && !isConfirmingDelete && 'ring-2 ring-blue-400/40 dark:ring-blue-500/40',
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`prompt-flip-container ${isDragging ? 'dragging' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`prompt-flip-card ${isConfirmingDelete ? 'flipped' : ''}`}>
        {/* Front Face - Normal Card */}
        <Card
          {...(isEditing || isConfirmingDelete ? {} : { ...attributes, ...listeners })}
          className={`${cardClassName} prompt-flip-front`}
        >
          {isEditing ? (
        <div className="space-y-2">
          <Textarea
            ref={textareaRef}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className="min-h-[80px] max-h-[400px] text-sm resize-none overflow-y-auto border border-transparent dark:border-slate-500 rounded-md focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none bg-transparent"
            placeholder="Enter prompt content..."
          />
          <div className="flex justify-end gap-2 text-xs text-muted-foreground">
            <span>Esc to cancel</span>
            <span>•</span>
            <span>Cmd+Enter to save</span>
          </div>
        </div>
      ) : (
        <p
          className="text-sm text-card-foreground whitespace-pre-wrap break-words cursor-text hover:bg-muted rounded p-1 -m-1 mb-2"
          onClick={handleTextClick}
          title="Clicca per modificare"
        >
          {prompt.content}
        </p>
      )}

      {/* Footer with actions, drag handle, and type badge */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-border mt-2">
        <div className={`flex items-center gap-1 transition-opacity ${isEditing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 transition-colors ${copied ? 'text-green-600' : ''}`}
            onClick={handleCopy}
            title="Copia prompt"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 ${showArchived ? 'text-blue-600 hover:text-blue-700' : 'text-green-600 hover:text-green-700'}`}
            onClick={handleArchive}
            title={showArchived ? "Ripristina" : "Archivia"}
          >
            {showArchived ? (
              <RotateCcw className="h-3.5 w-3.5" />
            ) : (
              <Archive className="h-3.5 w-3.5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={handleDeleteClick}
            title="Elimina prompt"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Drag handle indicator - visible on hover */}
        <div className={`transition-opacity ${isEditing ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
          <GripHorizontal className="h-4 w-4 text-muted-foreground/50" />
        </div>

        {/* Category badge - only show if categories are visible and category exists */}
        {categoriesVisible && category && (
          <div
            className="flex items-center gap-1 px-2 py-1 text-xs rounded"
            style={{
              backgroundColor: category.color + '20',
              color: category.color,
            }}
          >
            <DynamicIcon name={category.icon} className="h-3 w-3" />
            {category.name}
          </div>
        )}
      </div>
        </Card>

        {/* Back Face - Delete Confirmation */}
        <Card
          ref={deleteConfirmRef}
          tabIndex={-1}
          className="p-3 bg-destructive/10 border-destructive/30 prompt-flip-back flex flex-col items-center justify-center overflow-hidden"
        >
          <div className="flex flex-col items-center gap-2 text-center w-full">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
              <p className="font-medium text-sm text-card-foreground">Vuoi eliminare?</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={cancelDelete}
                className="h-7 px-2 text-xs"
              >
                <span className="hidden hover-device:inline">Esc</span>
                <span className="hover-device:hidden">Annulla</span>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={confirmDelete}
                className="h-7 px-2 text-xs"
              >
                <span className="hidden hover-device:inline">Invio</span>
                <span className="hover-device:hidden">Elimina</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
