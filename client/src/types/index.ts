export interface Project {
  id: string;
  name: string;
  color: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Prompt {
  id: string;
  project_id: string;
  content: string;
  type: PromptType;
  position: number;
  archived: number;
  created_at: string;
  updated_at: string;
}

export type PromptType = 'ui' | 'backend';
export type FilterType = 'all' | 'ui' | 'backend';

export interface CreateProjectInput {
  name: string;
  color?: string;
}

export interface UpdateProjectInput {
  name?: string;
  color?: string;
}

export interface CreatePromptInput {
  project_id: string;
  content: string;
  type: PromptType;
}

export interface UpdatePromptInput {
  content?: string;
  type?: PromptType;
}

export interface ReorderProjectsInput {
  projectIds: string[];
}

export interface ReorderPromptsInput {
  projectId: string;
  promptIds: string[];
}

export interface MovePromptInput {
  targetProjectId: string;
  position?: number;
}
