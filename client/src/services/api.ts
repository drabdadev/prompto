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
import '@/types/electron.d.ts';

// Determine base URL based on environment
const getBaseUrl = (): string => {
  // In Electron (dev or production), use dynamic port stored in sessionStorage
  // This is set by initElectronApi() before any API calls
  const serverPort = sessionStorage.getItem('serverPort');
  if (serverPort) {
    return `http://localhost:${serverPort}/api`;
  }
  // In web development with Vite proxy
  if (import.meta.env.DEV) {
    return '/api';
  }
  // Fallback for web production
  return '/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Initialize server port for Electron
export const initElectronApi = async (): Promise<void> => {
  if (window.electronAPI?.isElectron) {
    try {
      const port = await window.electronAPI.getServerPort();
      sessionStorage.setItem('serverPort', port.toString());
      api.defaults.baseURL = `http://localhost:${port}/api`;
      console.log(`API configured for Electron on port ${port}`);
    } catch (err) {
      console.error('Failed to get server port:', err);
    }
  }
};

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

// Database API
export interface Backup {
  name: string;
  size: number;
  createdAt: string;
}

export const databaseApi = {
  createBackup: async (): Promise<{ success: boolean; filename: string; size: number; message: string }> => {
    const { data } = await api.post('/database/backup');
    return data;
  },

  listBackups: async (): Promise<{ backups: Backup[] }> => {
    const { data } = await api.get('/database/backups');
    return data;
  },

  downloadBackup: async (filename: string): Promise<Blob> => {
    const response = await api.get(`/database/backups/${filename}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  deleteBackup: async (filename: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await api.delete(`/database/backups/${filename}`);
    return data;
  },

  restoreBackup: async (file: File): Promise<{ success: boolean; message: string; preRestoreBackup: string }> => {
    const formData = new FormData();
    formData.append('database', file);
    const { data } = await api.post('/database/restore', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  downloadCurrentDatabase: async (): Promise<Blob> => {
    const response = await api.get('/database/download', {
      responseType: 'blob'
    });
    return response.data;
  },
};

export default api;
