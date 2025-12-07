import axios from 'axios';
import type {
  Project,
  Prompt,
  CreateProjectInput,
  UpdateProjectInput,
  CreatePromptInput,
  UpdatePromptInput,
  MovePromptInput,
  FilterType,
} from '@/types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Projects API
export const projectsApi = {
  getAll: async (): Promise<Project[]> => {
    const { data } = await api.get('/projects');
    return data;
  },

  create: async (input: CreateProjectInput): Promise<Project> => {
    const { data } = await api.post('/projects', input);
    return data;
  },

  update: async (id: string, input: UpdateProjectInput): Promise<Project> => {
    const { data } = await api.put(`/projects/${id}`, input);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },

  reorder: async (projectIds: string[]): Promise<Project[]> => {
    const { data } = await api.put('/projects/reorder', { projectIds });
    return data;
  },
};

// Prompts API
export const promptsApi = {
  getAll: async (type?: FilterType, archived: boolean = false): Promise<Prompt[]> => {
    const params: Record<string, string> = { archived: archived ? 'true' : 'false' };
    if (type && type !== 'all') {
      params.type = type;
    }
    const { data } = await api.get('/prompts', { params });
    return data;
  },

  getByProject: async (projectId: string): Promise<Prompt[]> => {
    const { data } = await api.get(`/prompts/project/${projectId}`);
    return data;
  },

  create: async (input: CreatePromptInput): Promise<Prompt> => {
    const { data } = await api.post('/prompts', input);
    return data;
  },

  update: async (id: string, input: UpdatePromptInput): Promise<Prompt> => {
    const { data } = await api.put(`/prompts/${id}`, input);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/prompts/${id}`);
  },

  move: async (id: string, input: MovePromptInput): Promise<Prompt> => {
    const { data } = await api.put(`/prompts/${id}/move`, input);
    return data;
  },

  reorder: async (projectId: string, promptIds: string[]): Promise<Prompt[]> => {
    const { data } = await api.put('/prompts/reorder', { projectId, promptIds });
    return data;
  },

  archive: async (id: string, archived: boolean): Promise<Prompt> => {
    const { data } = await api.put(`/prompts/${id}/archive`, { archived });
    return data;
  },
};

export default api;
