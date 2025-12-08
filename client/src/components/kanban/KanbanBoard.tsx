import { useState, useCallback } from 'react';
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
import { useProjects } from '@/hooks/useProjects';
import { usePrompts } from '@/hooks/usePrompts';
import { useDarkMode } from '@/hooks/useDarkMode';
import { FilterBar } from './FilterBar';
import { ProjectColumn } from './ProjectColumn';
import { EmptyState } from './EmptyState';
import { ProjectDialog } from '@/components/dialogs/ProjectDialog';
import { PromptDialog } from '@/components/dialogs/PromptDialog';
import { DatabaseManagementDialog } from '@/components/dialogs/DatabaseManagementDialog';
import type { Project, Prompt, PromptType } from '@/types';

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

  // Dialog states
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [promptDialogOpen, setPromptDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Focus mode - when set, only show this project centered
  const [focusedProjectId, setFocusedProjectId] = useState<string | null>(null);

  // Database management dialog
  const [databaseDialogOpen, setDatabaseDialogOpen] = useState(false);

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
    if (window.confirm('Delete this project and all its prompts?')) {
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

  const handleAddPrompt = async (projectId: string, content: string, type: PromptType) => {
    await createPrompt({ project_id: projectId, content, type });
  };

  const handleArchivePrompt = async (id: string, archived: boolean) => {
    await archivePrompt(id, archived);
  };

  const handleUpdatePrompt = async (id: string, content: string, type: PromptType) => {
    await updatePrompt(id, { content, type });
  };

  const handleSavePrompt = async (content: string, type: PromptType) => {
    if (editingPrompt) {
      await updatePrompt(editingPrompt.id, { content, type });
    }
    setPromptDialogOpen(false);
  };

  if (projectsLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col pt-2 px-6 pb-6 bg-background overflow-hidden">
      {/* Header with title */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src="/favicon.ico" alt="Prompto" className="w-8 h-8" />
          <h1 className="text-2xl font-bold text-foreground">Prompto</h1>
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        filter={filter}
        onFilterChange={setFilter}
        onAddProject={handleAddProject}
        editMode={editMode}
        onEditModeChange={setEditMode}
        isDarkMode={isDark}
        onDarkModeToggle={toggleDarkMode}
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
            <div className={`flex-1 kanban-scroll pt-4 overflow-y-auto ${focusedProjectId ? 'flex items-start justify-center overflow-x-hidden' : 'overflow-x-auto'}`}>
              <div className={`flex gap-4 h-full pb-4 transition-all duration-300 ${focusedProjectId ? 'justify-center w-full' : ''}`}>
                {projects.map((project) => {
                  const isFocused = project.id === focusedProjectId;
                  const isHidden = focusedProjectId && !isFocused;

                  return (
                    <div
                      key={project.id}
                      className={`transition-all duration-300 ${
                        isHidden
                          ? 'opacity-0 scale-95 w-0 overflow-hidden pointer-events-none'
                          : isFocused
                            ? 'opacity-100 scale-100 w-full'
                            : 'opacity-100 scale-100'
                      }`}
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
                        onToggleFocus={setFocusedProjectId}
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
    </div>
  );
}
