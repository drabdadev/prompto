import { useState, useCallback, useRef } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { Sun, Moon, Settings, HelpCircle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useProjects } from '@/hooks/useProjects';
import { usePrompts } from '@/hooks/usePrompts';
import { useCategories } from '@/hooks/useCategories';
import { useDarkMode } from '@/hooks/useDarkMode';
import { FilterBar } from './FilterBar';
import { ProjectColumn } from './ProjectColumn';
import { EmptyState } from './EmptyState';
import { ProjectDialog } from '@/components/dialogs/ProjectDialog';
import { PromptDialog } from '@/components/dialogs/PromptDialog';
import { DatabaseManagementDialog } from '@/components/dialogs/DatabaseManagementDialog';
import { CategoryManagementDialog } from '@/components/dialogs/CategoryManagementDialog';
import type { Project, Prompt } from '@/types';

export function KanbanBoard() {
  const {
    projects,
    loading: projectsLoading,
    createProject,
    updateProject,
    deleteProject,
    reorderProjects,
  } = useProjects();

  const {
    filter,
    setFilter,
    createPrompt,
    updatePrompt,
    deletePrompt,
    movePrompt,
    archivePrompt,
    reorderPrompts,
    getActivePromptsByProject,
    getActivePromptsByProjectRef, // For drag handler (avoids stale closures)
    getArchivedPromptsByProject,
    getArchivedPromptsByProjectRef, // For drag handler (avoids stale closures)
  } = usePrompts();

  const { isDark, toggle: toggleDarkMode } = useDarkMode();

  const {
    categories,
    categoriesVisible,
    setCategoriesVisible,
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    getCategoryById,
  } = useCategories();

  // Dialog states
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [promptDialogOpen, setPromptDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Focus mode - when set, only show this project centered
  const [focusedProjectId, setFocusedProjectId] = useState<string | null>(null);
  // Animation state: 'idle' | 'imploding' | 'focused' | 'expanding'
  const [focusAnimationState, setFocusAnimationState] = useState<'idle' | 'imploding' | 'focused' | 'expanding'>('idle');
  const prevFocusedProjectId = useRef<string | null>(null);

  // Handle focus mode with animation
  const handleToggleFocus = useCallback((projectId: string | null) => {
    if (projectId && !focusedProjectId) {
      // Entering focus mode - start implode animation
      setFocusAnimationState('imploding');
      setFocusedProjectId(projectId);
      // After animation completes, set to focused state
      setTimeout(() => {
        setFocusAnimationState('focused');
      }, 400);
    } else if (!projectId && focusedProjectId) {
      // Exiting focus mode - start expand animation
      setFocusAnimationState('expanding');
      // After a brief delay, clear focus and let columns animate in
      setTimeout(() => {
        setFocusedProjectId(null);
        setTimeout(() => {
          setFocusAnimationState('idle');
        }, 400);
      }, 50);
    }
    prevFocusedProjectId.current = projectId;
  }, [focusedProjectId]);

  // Database management dialog
  const [databaseDialogOpen, setDatabaseDialogOpen] = useState(false);

  // Category management dialog
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Handle drag end for both columns and prompts
  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) {
        return;
      }

      // Check if dragging a column
      const isColumn = projects.some(p => p.id === active.id);

      if (isColumn) {
        const oldIndex = projects.findIndex((p) => p.id === active.id);
        const newIndex = projects.findIndex((p) => p.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const newOrder = arrayMove(projects, oldIndex, newIndex);
          reorderProjects(newOrder.map((p) => p.id));
        }
      } else {
        // Dragging a prompt - use data from sortable items
        const sourceProjectId = active.data.current?.projectId as string | undefined;
        let targetProjectId: string | null = null;

        // First check if dropped on another prompt (from over.data)
        if (over.data?.current?.projectId) {
          targetProjectId = over.data.current.projectId;
        }

        // Check if dropped on a droppable container (cross-column drop)
        const overId = over.id as string;
        if (!targetProjectId && overId.startsWith('droppable-')) {
          targetProjectId = overId.replace('droppable-', '');
        }

        // If dropped on a project column itself
        if (!targetProjectId) {
          const overProject = projects.find(p => p.id === over.id);
          if (overProject) {
            targetProjectId = overProject.id;
          }
        }

        if (sourceProjectId && targetProjectId) {
          if (sourceProjectId === targetProjectId) {
            // Reorder within same project - check both active and archived lists
            let projectPrompts = getActivePromptsByProjectRef(sourceProjectId);

            // Check if prompt is in active list
            let oldIndex = projectPrompts.findIndex(p => p.id === active.id);
            if (oldIndex === -1) {
              // Not in active, try archived
              projectPrompts = getArchivedPromptsByProjectRef(sourceProjectId);
              oldIndex = projectPrompts.findIndex(p => p.id === active.id);
            }

            const newIndex = projectPrompts.findIndex(p => p.id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
              const newOrder = arrayMove(projectPrompts, oldIndex, newIndex);
              reorderPrompts(sourceProjectId, newOrder.map(p => p.id));
            }
          } else {
            // Move to different project - use Ref version to avoid stale closure
            const targetPrompts = getActivePromptsByProjectRef(targetProjectId);
            const overIndex = targetPrompts.findIndex(p => p.id === over.id);
            const position = overIndex !== -1 ? overIndex : targetPrompts.length;
            await movePrompt(active.id as string, targetProjectId, position);
          }
        }
      }
    },
    [projects, reorderProjects, getActivePromptsByProjectRef, getArchivedPromptsByProjectRef, reorderPrompts, movePrompt]
  );

  // Project handlers
  const handleAddProject = () => {
    setEditingProject(null);
    setProjectDialogOpen(true);
  };

  const handleUpdateProjectInline = async (id: string, updates: { name?: string; color?: string }) => {
    await updateProject(id, updates);
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Eliminare questo progetto e tutti i suoi prompt?')) {
      await deleteProject(id);
    }
  };

  const handleSaveProject = async (name: string, color: string) => {
    if (editingProject) {
      await updateProject(editingProject.id, { name, color });
    } else {
      await createProject({ name, color });
    }
    setProjectDialogOpen(false);
  };

  // Prompt handlers
  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setPromptDialogOpen(true);
  };

  const handleDeletePrompt = async (id: string) => {
    await deletePrompt(id);
  };

  const handleAddPrompt = async (projectId: string, content: string, categoryId: string | null) => {
    await createPrompt({ project_id: projectId, content, category_id: categoryId });
  };

  const handleArchivePrompt = async (id: string, archived: boolean) => {
    await archivePrompt(id, archived);
  };

  const handleUpdatePrompt = async (id: string, content: string, categoryId: string | null) => {
    await updatePrompt(id, { content, category_id: categoryId });
  };

  const handleSavePrompt = async (content: string, categoryId: string | null) => {
    if (editingPrompt) {
      await updatePrompt(editingPrompt.id, { content, category_id: categoryId });
    }
    setPromptDialogOpen(false);
  };

  if (projectsLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-muted-foreground">Caricamento...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col pt-2 px-6 pb-6 bg-background overflow-hidden">
      {/* Header with title and controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src="/favicon.ico" alt="Prompto" className="w-8 h-8" />
          <h1 className="text-2xl font-bold text-foreground">Prompto</h1>
        </div>

        {/* Controls moved to header */}
        <div className="flex items-center gap-3">
          {/* Help icon with keyboard shortcuts tooltip */}
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="p-1.5 rounded-md hover:bg-muted transition-colors"
                  aria-label="Scorciatoie da tastiera"
                >
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs p-3 text-left">
                <p className="font-medium mb-2">Scorciatoie da tastiera</p>
                <div className="space-y-1.5 text-xs">
                  <p className="text-muted-foreground font-medium mb-1">Su prompt (hover):</p>
                  <p><kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-[10px] font-mono">E</kbd> Modifica prompt</p>
                  <p><kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-[10px] font-mono">A</kbd> Archivia / Ripristina</p>
                  <p><kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-[10px] font-mono">C</kbd> Copia prompt</p>
                  <p><kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-[10px] font-mono">Canc</kbd> Elimina prompt</p>
                  <p className="text-muted-foreground font-medium mb-1 mt-2">Su colonna (hover):</p>
                  <p><kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-[10px] font-mono">F</kbd> Focus mode</p>
                  <p><kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-[10px] font-mono">Tab</kbd> Mostra archivio</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <button
            onClick={toggleDarkMode}
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
            aria-label="Cambia tema"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Moon className="h-4 w-4 text-muted-foreground" />
            )}
          </button>

          <div className="flex items-center gap-1.5">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <Switch
              checked={editMode}
              onCheckedChange={setEditMode}
              aria-label="Modalità modifica"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        filter={filter}
        onFilterChange={setFilter}
        onAddProject={handleAddProject}
        editMode={editMode}
        categories={categories}
        categoriesVisible={categoriesVisible}
        onCategoryManagement={() => setCategoryDialogOpen(true)}
        onDatabaseManagement={() => setDatabaseDialogOpen(true)}
      />

      {/* Kanban */}
      {projects.length === 0 ? (
        <EmptyState onAddProject={handleAddProject} />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={projects.map((p) => p.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className={`flex-1 kanban-scroll pt-4 overflow-y-auto ${focusedProjectId ? 'overflow-x-hidden' : 'overflow-x-auto'}`}>
              <div className={`h-full pb-4 transition-all duration-300 ${focusedProjectId ? 'w-full' : 'flex gap-4'}`}>
                {projects.map((project, index) => {
                  const isFocused = project.id === focusedProjectId;
                  const isOther = focusedProjectId && !isFocused;

                  // Determine animation class based on state
                  let animationClass = '';
                  if (isOther) {
                    if (focusAnimationState === 'imploding') {
                      animationClass = 'column-implode-out';
                    } else if (focusAnimationState === 'focused') {
                      animationClass = 'column-imploded';
                    } else if (focusAnimationState === 'expanding') {
                      animationClass = 'column-implode-in';
                    }
                  }

                  // Calculate direction for implode effect (left columns go left, right go right)
                  const focusedIndex = projects.findIndex(p => p.id === focusedProjectId);
                  const direction = index < focusedIndex ? '-100px' : '100px';

                  return (
                    <div
                      key={project.id}
                      className={`transition-all duration-300 ${
                        isFocused ? 'w-full' : ''
                      } ${animationClass}`}
                      style={{
                        '--implode-direction': direction,
                      } as React.CSSProperties}
                    >
                      <ProjectColumn
                        project={project}
                        activePrompts={getActivePromptsByProject(project.id)}
                        archivedPrompts={getArchivedPromptsByProject(project.id)}
                        onUpdateProject={handleUpdateProjectInline}
                        onDeleteProject={handleDeleteProject}
                        onEditPrompt={handleEditPrompt}
                        onDeletePrompt={handleDeletePrompt}
                        onArchivePrompt={handleArchivePrompt}
                        onUpdatePrompt={handleUpdatePrompt}
                        onAddPrompt={handleAddPrompt}
                        editMode={editMode}
                        isFocused={isFocused}
                        onToggleFocus={handleToggleFocus}
                        categories={categories}
                        categoriesVisible={categoriesVisible}
                        getCategoryById={getCategoryById}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </SortableContext>

          {/* No DragOverlay - use the original element for drag preview */}
        </DndContext>
      )}

      <ProjectDialog
        open={projectDialogOpen}
        onOpenChange={setProjectDialogOpen}
        project={editingProject}
        onSave={handleSaveProject}
      />

      <PromptDialog
        open={promptDialogOpen}
        onOpenChange={setPromptDialogOpen}
        prompt={editingPrompt}
        onSave={handleSavePrompt}
      />

      <DatabaseManagementDialog
        open={databaseDialogOpen}
        onOpenChange={setDatabaseDialogOpen}
      />

      <CategoryManagementDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        categories={categories}
        onCreateCategory={createCategory}
        onUpdateCategory={updateCategory}
        onDeleteCategory={deleteCategory}
        onReorderCategories={reorderCategories}
        categoriesVisible={categoriesVisible}
        onCategoriesVisibleChange={setCategoriesVisible}
      />
    </div>
  );
}
