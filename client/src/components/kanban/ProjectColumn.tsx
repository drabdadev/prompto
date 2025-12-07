import { useState, useRef, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Archive, Eye, EyeOff } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { PromptCard } from './PromptCard';
import { QuickAddPrompt } from './QuickAddPrompt';
import type { Project, Prompt, PromptType } from '@/types';

// Preset colors for the color picker
const PRESET_COLORS = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#EF4444',
  '#F97316', '#EAB308', '#22C55E', '#14B8A6',
  '#06B6D4', '#6366F1', '#A855F7', '#F43F5E',
];

interface ProjectColumnProps {
  project: Project;
  activePrompts: Prompt[];
  archivedPrompts: Prompt[];
  onUpdateProject: (id: string, updates: { name?: string; color?: string }) => void;
  onDeleteProject: (id: string) => void;
  onEditPrompt: (prompt: Prompt) => void;
  onDeletePrompt: (id: string) => void;
  onArchivePrompt: (id: string, archived: boolean) => void;
  onUpdatePrompt: (id: string, content: string, type: PromptType) => void;
  onAddPrompt: (projectId: string, content: string, type: PromptType) => Promise<void>;
  editMode: boolean;
  isFocused: boolean;
  onToggleFocus: (projectId: string | null) => void;
}

export function ProjectColumn({
  project,
  activePrompts,
  archivedPrompts,
  onUpdateProject,
  onDeleteProject,
  onEditPrompt,
  onDeletePrompt,
  onArchivePrompt,
  onUpdatePrompt,
  onAddPrompt,
  editMode,
  isFocused,
  onToggleFocus,
}: ProjectColumnProps) {
  const [showArchived, setShowArchived] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  // Inline title editing
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(project.name);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Color picker
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  // Close color picker on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    };
    if (showColorPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showColorPicker]);

  const handleTitleClick = () => {
    setEditedTitle(project.name);
    setIsEditingTitle(true);
  };

  const handleTitleSave = () => {
    if (editedTitle.trim() && editedTitle !== project.name) {
      onUpdateProject(project.id, { name: editedTitle.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setEditedTitle(project.name);
      setIsEditingTitle(false);
    }
  };

  const handleColorSelect = (color: string) => {
    onUpdateProject(project.id, { color });
    setShowColorPicker(false);
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  // Make the prompts container a drop target for cross-column drops
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `droppable-${project.id}`,
    data: { projectId: project.id },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleAddPrompt = async (content: string, type: PromptType) => {
    await onAddPrompt(project.id, content, type);
  };

  const handleFlipToggle = () => {
    setIsFlipping(true);
    // Change content at the halfway point of animation (0.35s / 2 = 175ms)
    setTimeout(() => {
      setShowArchived(!showArchived);
    }, 175);
    // Reset flipping state after animation completes (0.35s = 350ms)
    setTimeout(() => {
      setIsFlipping(false);
    }, 350);
  };

  // Render the column content (shared between front and back)
  const renderColumnContent = (isArchiveView: boolean) => {
    const prompts = isArchiveView ? archivedPrompts : activePrompts;

    return (
      <>
        {/* Quick Add - only show when not viewing archived */}
        {!isArchiveView && (
          <>
            <div className="mb-3">
              <QuickAddPrompt projectId={project.id} onAdd={handleAddPrompt} />
            </div>
            {/* Separator between quick entry and prompts list */}
            <div className="border-t border-border mb-3" />
          </>
        )}

        {/* Prompts List - droppable container for cross-column drops */}
        <SortableContext
          items={prompts.map(p => p.id)}
          strategy={verticalListSortingStrategy}
        >
          <div
            ref={setDroppableRef}
            className={`space-y-2 min-h-[100px] max-h-[calc(100vh-320px)] overflow-y-auto overflow-x-hidden prompts-list p-1 -m-1 rounded-lg transition-colors ${
              isOver ? 'bg-blue-50 dark:bg-blue-950 ring-2 ring-blue-300 dark:ring-blue-700 ring-inset' : ''
            }`}
          >
            {prompts.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                {isArchiveView ? 'No archived prompts' : 'Nessun prompt qui...'}
              </div>
            ) : (
              prompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  projectId={project.id}
                  onEdit={onEditPrompt}
                  onDelete={onDeletePrompt}
                  onArchive={onArchivePrompt}
                  onUpdate={onUpdatePrompt}
                  showArchived={isArchiveView}
                />
              ))
            )}
          </div>
        </SortableContext>
      </>
    );
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex-shrink-0 w-full sm:w-[500px] md:w-[600px] lg:w-[640px] min-w-0 relative flip-container"
    >
      {/* Flip Card */}
      <div
        className={`flip-card rounded-xl p-4 ${
          showArchived ? 'bg-amber-50 dark:bg-amber-950' : 'bg-muted'
        } ${isFlipping ? 'flipping' : ''} ${isFocused ? 'focus-glow' : ''}`}
      >
        {/* Column Header */}
        <div className="flex items-center justify-between mb-4 py-2 group">
          <div className="flex items-center gap-2">
            <button
              {...attributes}
              {...listeners}
              className={`cursor-grab active:cursor-grabbing p-1 rounded ${
                showArchived ? 'hover:bg-amber-100 dark:hover:bg-amber-900' : 'hover:bg-background'
              }`}
            >
              <GripVertical className={`h-4 w-4 ${showArchived ? 'text-amber-500' : 'text-muted-foreground'}`} />
            </button>

            {/* Color dot with picker */}
            <div className="relative" ref={colorPickerRef}>
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform cursor-pointer"
                style={{ backgroundColor: project.color }}
                title="Cambia colore"
              />
              {showColorPicker && (
                <>
                  {/* Backdrop */}
                  <div className="fixed inset-0 z-[99]" onClick={() => setShowColorPicker(false)} />
                  {/* Color picker */}
                  <div
                    className="absolute -top-2 left-8 z-[100] bg-card rounded-lg shadow-2xl border border-border p-3 animate-in fade-in zoom-in-95 duration-150"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 28px)',
                      gap: '8px',
                    }}
                  >
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorSelect(color)}
                        className={`rounded-full transition-all hover:brightness-110 ${
                          project.color === color ? 'ring-2 ring-offset-2 ring-muted-foreground ring-offset-card' : ''
                        }`}
                        style={{
                          backgroundColor: color,
                          width: '28px',
                          height: '28px',
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Inline editable title */}
            {isEditingTitle ? (
              <Input
                ref={titleInputRef}
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={handleTitleKeyDown}
                className="h-7 w-40 font-semibold text-foreground px-1"
              />
            ) : (
              <h2
                onClick={handleTitleClick}
                className={`font-semibold cursor-text hover:bg-background/50 rounded px-1 -mx-1 ${
                  showArchived ? 'text-amber-800 dark:text-amber-200' : 'text-foreground'
                }`}
                title="Clicca per modificare"
              >
                {project.name}
              </h2>
            )}

            <span className={`text-sm ${showArchived ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'}`}>
              {showArchived ? `(${archivedPrompts.length})` : `(${activePrompts.length})`}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Focus mode toggle */}
            <button
              onClick={() => onToggleFocus(isFocused ? null : project.id)}
              className={`p-1 rounded transition-colors ${
                isFocused
                  ? 'text-blue-600 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800'
                  : showArchived
                    ? 'text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900'
                    : 'text-muted-foreground hover:bg-background'
              }`}
              title={isFocused ? "Esci dalla focus mode" : "Focus mode"}
            >
              {isFocused ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>

            {/* Archive toggle */}
            <div className="flex items-center gap-1.5">
              <Archive className={`h-3.5 w-3.5 ${showArchived ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'}`} />
              <Switch
                checked={showArchived}
                onCheckedChange={handleFlipToggle}
                disabled={isFlipping}
                aria-label={showArchived ? "Show active prompts" : "Show archived prompts"}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {renderColumnContent(showArchived)}
      </div>

      {/* Delete button - visible only in edit mode */}
      {editMode && (
        <button
          className="absolute -top-4 -right-4 w-8 h-8 bg-card rounded-full shadow-lg border border-border flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-950 z-10"
          onClick={() => onDeleteProject(project.id)}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </button>
      )}
    </div>
  );
}
