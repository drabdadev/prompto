import { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Copy, Trash2, Layout, Server, Check, RotateCcw, GripHorizontal } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import type { Prompt, PromptType } from '@/types';

interface PromptCardProps {
  prompt: Prompt;
  projectId: string;
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string, archived: boolean) => void;
  onUpdate: (id: string, content: string, type: PromptType) => void;
  showArchived: boolean;
}

export function PromptCard({ prompt, projectId, onDelete, onArchive, onUpdate, showArchived }: PromptCardProps) {
  const { copy } = useCopyToClipboard();
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(prompt.content);
  const [isArchiving, setIsArchiving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? undefined : transition,
    opacity: isDragging ? 0.9 : 1,
  };

  // Auto-resize textarea based on content
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.max(80, textarea.scrollHeight)}px`;
    }
  };

  // Focus textarea when entering edit mode and adjust height
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(editContent.length, editContent.length);
      adjustTextareaHeight();
    }
  }, [isEditing, editContent.length]);

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
      onUpdate(prompt.id, editContent.trim(), prompt.type);
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

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(prompt.id);
  };

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

  const handleTypeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newType: PromptType = prompt.type === 'ui' ? 'backend' : 'ui';
    onUpdate(prompt.id, prompt.content, newType);
  };

  // Build className - avoid transition-all during drag for performance
  const cardClassName = [
    'p-3 bg-card group',
    isArchiving && 'prompt-card archive-animation',
    isEditing && 'ring-2 ring-blue-500 border-transparent',
    isDragging && 'shadow-xl z-50 cursor-grabbing',
    !isDragging && !isEditing && !isArchiving && 'transition-shadow duration-150 hover:shadow-lg cursor-grab',
  ].filter(Boolean).join(' ');

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...(isEditing ? {} : { ...attributes, ...listeners })}
      className={cardClassName}
    >
      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            ref={textareaRef}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className="min-h-[80px] max-h-[400px] text-sm resize-none overflow-y-auto"
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
          title="Click to edit"
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
            title="Copy prompt"
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
            title={showArchived ? "Restore prompt" : "Mark as done"}
          >
            {showArchived ? (
              <RotateCcw className="h-3.5 w-3.5" />
            ) : (
              <Check className="h-3.5 w-3.5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={handleDelete}
            title="Delete prompt"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Drag handle indicator - visible on hover */}
        <div className={`transition-opacity ${isEditing ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
          <GripHorizontal className="h-4 w-4 text-muted-foreground/50" />
        </div>

        <button
          onClick={handleTypeToggle}
          title={`Click to change to ${prompt.type === 'ui' ? 'Backend' : 'Frontend'}`}
          className={`flex items-center gap-1 px-2 py-1 text-xs rounded cursor-pointer hover:opacity-80 transition-opacity ${
            prompt.type === 'ui'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
          }`}
        >
          {prompt.type === 'ui' ? (
            <Layout className="h-3 w-3" />
          ) : (
            <Server className="h-3 w-3" />
          )}
          {prompt.type === 'ui' ? 'Frontend' : 'Backend'}
        </button>
      </div>
    </Card>
  );
}
