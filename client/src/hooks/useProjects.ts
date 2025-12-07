import { useState, useEffect, useCallback } from 'react';
import { projectsApi } from '@/services/api';
import type { Project, CreateProjectInput, UpdateProjectInput } from '@/types';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await projectsApi.getAll();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = useCallback(async (input: CreateProjectInput) => {
    try {
      const newProject = await projectsApi.create(input);
      setProjects(prev => [...prev, newProject]);
      return newProject;
    } catch (err) {
      console.error('Error creating project:', err);
      throw err;
    }
  }, []);

  const updateProject = useCallback(async (id: string, input: UpdateProjectInput) => {
    try {
      const updated = await projectsApi.update(id, input);
      setProjects(prev => prev.map(p => p.id === id ? updated : p));
      return updated;
    } catch (err) {
      console.error('Error updating project:', err);
      throw err;
    }
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    try {
      await projectsApi.delete(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting project:', err);
      throw err;
    }
  }, []);

  const reorderProjects = useCallback(async (projectIds: string[]) => {
    // Optimistically update
    const reordered = projectIds.map((id, index) => {
      const project = projects.find(p => p.id === id);
      return project ? { ...project, position: index } : null;
    }).filter((p): p is Project => p !== null);

    setProjects(reordered);

    try {
      await projectsApi.reorder(projectIds);
    } catch (err) {
      console.error('Error reordering projects:', err);
      // Revert on error
      fetchProjects();
      throw err;
    }
  }, [projects, fetchProjects]);

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    reorderProjects,
    refetch: fetchProjects,
  };
}
