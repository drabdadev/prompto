import { useState, useEffect, useCallback, useRef } from 'react';
import { Layout, Server } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { PromptType } from '@/types';

interface QuickAddPromptProps {
  projectId: string;
  onAdd: (content: string, type: PromptType) => Promise<void>;
}

// LocalStorage key prefix for drafts
const DRAFT_KEY_PREFIX = 'webprompter_draft_';

export function QuickAddPrompt({ projectId, onAdd }: QuickAddPromptProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.max(60, textarea.scrollHeight)}px`;
    }
  }, []);

  // Load draft from localStorage on mount
  const loadDraft = useCallback(() => {
    try {
      const saved = localStorage.getItem(`${DRAFT_KEY_PREFIX}${projectId}`);
      if (saved) {
        const draft = JSON.parse(saved);
        return { content: draft.content || '', type: draft.type || 'ui' };
      }
    } catch (e) {
      console.error('Failed to load draft:', e);
    }
    return { content: '', type: 'ui' as PromptType };
  }, [projectId]);

  const [content, setContent] = useState(() => loadDraft().content);
  const [type, setType] = useState<PromptType>(() => loadDraft().type);

  // Adjust textarea height when content changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [content, adjustTextareaHeight]);

  // Save draft to localStorage whenever content or type changes
  useEffect(() => {
    if (content.trim()) {
      localStorage.setItem(
        `${DRAFT_KEY_PREFIX}${projectId}`,
        JSON.stringify({ content, type })
      );
    } else {
      // Remove draft if content is empty
      localStorage.removeItem(`${DRAFT_KEY_PREFIX}${projectId}`);
    }
  }, [content, type, projectId]);

  // Clear draft after successful submit
  const clearDraft = useCallback(() => {
    localStorage.removeItem(`${DRAFT_KEY_PREFIX}${projectId}`);
  }, [projectId]);

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAdd(content.trim(), type);
      setContent('');
      clearDraft();
    } catch (err) {
      console.error('Failed to add prompt:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Tab') {
      // Toggle between Frontend and Backend on Tab
      e.preventDefault();
      setType(type === 'ui' ? 'backend' : 'ui');
    }
  };

  return (
    <div
      className="bg-card border border-border rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent"
      data-project-id={projectId}
    >
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Scrivi un prompt, premi invio per salvarlo"
        className="min-h-[60px] max-h-[300px] text-sm resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-b-none overflow-y-auto"
        disabled={isSubmitting}
      />
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-border bg-muted/50 rounded-b-lg">
        <span className="text-xs text-muted-foreground">Tab per cambiare tipo</span>
        <ToggleGroup
          type="single"
          value={type}
          onValueChange={(value) => value && setType(value as PromptType)}
          className="justify-end"
        >
          <ToggleGroupItem
            value="ui"
            className="px-2 py-1 text-xs gap-1 data-[state=on]:bg-green-100 data-[state=on]:text-green-800 dark:data-[state=on]:bg-green-900 dark:data-[state=on]:text-green-200 rounded"
            tabIndex={-1}
          >
            <Layout className="h-3 w-3" />
            Frontend
          </ToggleGroupItem>
          <ToggleGroupItem
            value="backend"
            className="px-2 py-1 text-xs gap-1 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-800 dark:data-[state=on]:bg-blue-900 dark:data-[state=on]:text-blue-200 rounded"
            tabIndex={-1}
          >
            <Server className="h-3 w-3" />
            Backend
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
