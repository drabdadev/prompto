export interface Project {
  id: string;
  name: string;
  color: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Prompt {
  id: string;
  project_id: string;
  content: string;
  category_id: string | null;
  position: number;
  archived: number;
  created_at: string;
  updated_at: string;
}

// FilterType: 'all' shows everything, or a category_id to filter
export type FilterType = 'all' | string;

export interface CreateProjectInput {
  name: string;
  color?: string;
}

export interface UpdateProjectInput {
  name?: string;
  color?: string;
}

export interface CreateCategoryInput {
  name: string;
  color?: string;
  icon?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  color?: string;
  icon?: string;
}

export interface CreatePromptInput {
  project_id: string;
  content: string;
  category_id?: string | null;
}

export interface UpdatePromptInput {
  content?: string;
  category_id?: string | null;
}

export interface ReorderProjectsInput {
  projectIds: string[];
}

export interface ReorderCategoriesInput {
  categoryIds: string[];
}

export interface ReorderPromptsInput {
  projectId: string;
  promptIds: string[];
}

export interface MovePromptInput {
  targetProjectId: string;
  position?: number;
}
