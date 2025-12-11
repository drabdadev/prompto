import { useState, useEffect, useCallback, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { DynamicIcon } from '@/components/DynamicIcon';
import type { Category } from '@/types';

interface QuickAddPromptProps {
  projectId: string;
  onAdd: (content: string, categoryId: string | null) => Promise<void>;
  categories: Category[];
  categoriesVisible: boolean;
}

// LocalStorage key prefix for drafts
const DRAFT_KEY_PREFIX = 'prompto_draft_';

export function QuickAddPrompt({ projectId, onAdd, categories, categoriesVisible }: QuickAddPromptProps) {
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

  // Get default category (first one if categories are visible)
  const getDefaultCategoryId = useCallback(() => {
    if (categoriesVisible && categories.length > 0) {
      return categories[0].id;
    }
    return null;
  }, [categoriesVisible, categories]);

  // Load draft from localStorage on mount
  const loadDraft = useCallback(() => {
    try {
      const saved = localStorage.getItem(`${DRAFT_KEY_PREFIX}${projectId}`);
      if (saved) {
        const draft = JSON.parse(saved);
        return { content: draft.content || '', categoryId: draft.categoryId };
      }
    } catch (e) {
      console.error('Failed to load draft:', e);
    }
    return { content: '', categoryId: undefined as string | null | undefined };
  }, [projectId]);

  const [content, setContent] = useState(() => loadDraft().content);
  // Use draft categoryId if available, otherwise default to first category
  const [categoryId, setCategoryId] = useState<string | null>(() => {
    const draft = loadDraft();
    // If draft has explicit categoryId (even null), use it; otherwise use default
    if (draft.categoryId !== undefined) {
      return draft.categoryId;
    }
    return getDefaultCategoryId();
  });

  // Update categoryId when categories become visible/change and no selection
  useEffect(() => {
    if (categoriesVisible && categories.length > 0 && categoryId === null) {
      // Check if there's no draft with explicit null
      const saved = localStorage.getItem(`${DRAFT_KEY_PREFIX}${projectId}`);
      if (!saved) {
        setCategoryId(categories[0].id);
      }
    }
  }, [categoriesVisible, categories, categoryId, projectId]);

  // Adjust textarea height when content changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [content, adjustTextareaHeight]);

  // Also adjust on mount after a small delay to ensure DOM is ready
  useEffect(() => {
    const timer = setTimeout(adjustTextareaHeight, 50);
    return () => clearTimeout(timer);
  }, [adjustTextareaHeight]);

  // Recalculate height when window is resized (text reflows)
  useEffect(() => {
    const handleResize = () => adjustTextareaHeight();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [adjustTextareaHeight]);

  // Save draft to localStorage whenever content or categoryId changes
  useEffect(() => {
    if (content.trim()) {
      localStorage.setItem(
        `${DRAFT_KEY_PREFIX}${projectId}`,
        JSON.stringify({ content, categoryId })
      );
    } else {
      // Remove draft if content is empty
      localStorage.removeItem(`${DRAFT_KEY_PREFIX}${projectId}`);
    }
  }, [content, categoryId, projectId]);

  // Clear draft after successful submit
  const clearDraft = useCallback(() => {
    localStorage.removeItem(`${DRAFT_KEY_PREFIX}${projectId}`);
  }, [projectId]);

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAdd(content.trim(), categoryId);
      setContent('');
      // Reset to default category for next prompt
      setCategoryId(getDefaultCategoryId());
      clearDraft();
      // Mantieni il focus sulla textarea per aggiungere altri prompt
      // Delay per assicurarsi che il focus venga impostato dopo il re-render della lista
      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
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
    } else if (e.key === 'Escape') {
      // Remove focus from textarea
      e.preventDefault();
      textareaRef.current?.blur();
    } else if (e.key === 'Tab' && categoriesVisible && categories.length > 0) {
      // Cycle through categories on Tab, then to null (deselected)
      e.preventDefault();
      if (categoryId === null) {
        // No selection -> first category
        setCategoryId(categories[0].id);
      } else {
        const currentIndex = categories.findIndex(c => c.id === categoryId);
        if (currentIndex === categories.length - 1) {
          // Last category -> deselect (null)
          setCategoryId(null);
        } else {
          // Move to next category
          setCategoryId(categories[currentIndex + 1].id);
        }
      }
    }
  };

  return (
    <div
      className="relative rounded-lg"
      data-project-id={projectId}
    >
      {/* Elevated box with light background + combined shadow (highlight top, shadow bottom) */}
      <div className="rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_1px_3px_0_rgba(0,0,0,0.08),0_4px_12px_0_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_3px_0_rgba(0,0,0,0.3),0_4px_12px_0_rgba(0,0,0,0.4)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_2px_4px_0_rgba(0,0,0,0.1),0_6px_16px_0_rgba(0,0,0,0.12)] dark:hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_2px_4px_0_rgba(0,0,0,0.4),0_6px_16px_0_rgba(0,0,0,0.5)] focus-within:border-blue-500 focus-within:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_0_0_3px_rgba(59,130,246,0.3),0_4px_12px_0_rgba(59,130,246,0.15)] dark:focus-within:border-blue-400 dark:focus-within:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_0_0_3px_rgba(59,130,246,0.4),0_4px_12px_0_rgba(59,130,246,0.2)] transition-all duration-200">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Scrivi un prompt, premi invio per salvarlo"
          className="min-h-[60px] text-sm resize-none border-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none rounded-b-none overflow-hidden bg-transparent"
          disabled={isSubmitting}
        />
        {/* Bottom toolbar - only show if categories are visible */}
        {categoriesVisible && categories.length > 0 && (
          <div className="flex items-center justify-end gap-2 px-3 py-2 border-t border-slate-200/60 dark:border-slate-600/60 bg-slate-50/80 dark:bg-slate-800/50 rounded-b-lg">
            <ToggleGroup
              type="single"
              value={categoryId || ''}
              onValueChange={(value) => setCategoryId(value || null)}
              className="justify-end focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              {categories.map((category) => (
                <ToggleGroupItem
                  key={category.id}
                  value={category.id}
                  className="px-2 py-1 text-xs gap-1 rounded focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none transition-colors"
                  style={{
                    backgroundColor: categoryId === category.id ? category.color + '20' : undefined,
                    color: categoryId === category.id ? category.color : undefined,
                  }}
                  tabIndex={-1}
                  onClick={(e) => {
                    // Allow deselecting by clicking on already selected tag
                    if (categoryId === category.id) {
                      e.preventDefault();
                      setCategoryId(null);
                    }
                  }}
                >
                  <DynamicIcon name={category.icon} className="h-3 w-3" />
                  {category.name}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        )}
      </div>
    </div>
  );
}
