import { useState, useEffect, useCallback } from 'react';
import { promptsApi } from '@/services/api';
import type { Prompt, CreatePromptInput, UpdatePromptInput, FilterType } from '@/types';

export function usePrompts() {
  const [activePrompts, setActivePrompts] = useState<Prompt[]>([]);
  const [archivedPrompts, setArchivedPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');

  const fetchPrompts = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch both active and archived prompts
      const [active, archived] = await Promise.all([
        promptsApi.getAll(undefined, false),
        promptsApi.getAll(undefined, true),
      ]);
      setActivePrompts(active);
      setArchivedPrompts(archived);
      setError(null);
    } catch (err) {
      setError('Failed to fetch prompts');
      console.error('Error fetching prompts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  const createPrompt = useCallback(async (input: CreatePromptInput) => {
    try {
      const newPrompt = await promptsApi.create(input);
      // Add new prompt and update positions of existing prompts in the same project
      setActivePrompts(prev => {
        const updatedPrompts = prev.map(p =>
          p.project_id === input.project_id
            ? { ...p, position: p.position + 1 }
            : p
        );
        return [newPrompt, ...updatedPrompts];
      });
      return newPrompt;
    } catch (err) {
      console.error('Error creating prompt:', err);
      throw err;
    }
  }, []);

  const updatePrompt = useCallback(async (id: string, input: UpdatePromptInput) => {
    try {
      const updated = await promptsApi.update(id, input);
      // Update in both lists (it could be in either)
      setActivePrompts(prev => prev.map(p => p.id === id ? updated : p));
      setArchivedPrompts(prev => prev.map(p => p.id === id ? updated : p));
      return updated;
    } catch (err) {
      console.error('Error updating prompt:', err);
      throw err;
    }
  }, []);

  const deletePrompt = useCallback(async (id: string) => {
    try {
      await promptsApi.delete(id);
      setActivePrompts(prev => prev.filter(p => p.id !== id));
      setArchivedPrompts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting prompt:', err);
      throw err;
    }
  }, []);

  const movePrompt = useCallback(async (id: string, targetProjectId: string, position?: number) => {
    try {
      const updated = await promptsApi.move(id, { targetProjectId, position });
      setActivePrompts(prev => prev.map(p => p.id === id ? updated : p));
      setArchivedPrompts(prev => prev.map(p => p.id === id ? updated : p));
      return updated;
    } catch (err) {
      console.error('Error moving prompt:', err);
      throw err;
    }
  }, []);

  const archivePrompt = useCallback(async (id: string, archived: boolean) => {
    try {
      const updated = await promptsApi.archive(id, archived);
      if (archived) {
        // Move from active to archived
        setActivePrompts(prev => prev.filter(p => p.id !== id));
        setArchivedPrompts(prev => [...prev, updated]);
      } else {
        // Move from archived to active
        setArchivedPrompts(prev => prev.filter(p => p.id !== id));
        setActivePrompts(prev => [...prev, updated]);
      }
      return updated;
    } catch (err) {
      console.error('Error archiving prompt:', err);
      throw err;
    }
  }, []);

  const reorderPrompts = useCallback(async (projectId: string, promptIds: string[]) => {
    try {
      // Optimistically update the order
      setActivePrompts(prev => {
        const projectPrompts = prev.filter(p => p.project_id === projectId);
        const otherPrompts = prev.filter(p => p.project_id !== projectId);

        const reordered = promptIds.map((id, index) => {
          const prompt = projectPrompts.find(p => p.id === id);
          return prompt ? { ...prompt, position: index } : null;
        }).filter(Boolean) as Prompt[];

        return [...otherPrompts, ...reordered];
      });

      await promptsApi.reorder(projectId, promptIds);
    } catch (err) {
      console.error('Error reordering prompts:', err);
      // Refetch on error
      fetchPrompts();
      throw err;
    }
  }, [fetchPrompts]);

  // Get active prompts filtered by type for a project
  const getActivePromptsByProject = useCallback((projectId: string) => {
    return activePrompts
      .filter(p => p.project_id === projectId)
      .filter(p => filter === 'all' || p.type === filter)
      .sort((a, b) => a.position - b.position);
  }, [activePrompts, filter]);

  // Get archived prompts filtered by type for a project
  // Sort by updated_at DESC so most recently archived appear first
  const getArchivedPromptsByProject = useCallback((projectId: string) => {
    return archivedPrompts
      .filter(p => p.project_id === projectId)
      .filter(p => filter === 'all' || p.type === filter)
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }, [archivedPrompts, filter]);

  // Get all prompts (active + archived) for a project - used for drag detection
  const getAllPromptsByProject = useCallback((projectId: string) => {
    return [...activePrompts, ...archivedPrompts]
      .filter(p => p.project_id === projectId)
      .filter(p => filter === 'all' || p.type === filter)
      .sort((a, b) => a.position - b.position);
  }, [activePrompts, archivedPrompts, filter]);

  return {
    activePrompts,
    archivedPrompts,
    loading,
    error,
    filter,
    setFilter,
    createPrompt,
    updatePrompt,
    deletePrompt,
    movePrompt,
    archivePrompt,
    reorderPrompts,
    getActivePromptsByProject,
    getArchivedPromptsByProject,
    getAllPromptsByProject,
    refetch: fetchPrompts,
  };
}
