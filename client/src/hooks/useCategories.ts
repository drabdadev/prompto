import { useState, useEffect, useCallback } from 'react';
import { categoriesApi, settingsApi } from '@/services/api';
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '@/types';

const CATEGORIES_VISIBLE_KEY = 'categories_visible';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesVisible, setCategoriesVisibleState] = useState(false);

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    try {
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, []);

  // Fetch visibility setting from API
  const fetchVisibilitySetting = useCallback(async () => {
    try {
      const value = await settingsApi.get(CATEGORIES_VISIBLE_KEY);
      setCategoriesVisibleState(value === 'true');
    } catch (err) {
      // Setting might not exist yet, default to false
      console.error('Failed to fetch visibility setting:', err);
      setCategoriesVisibleState(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchCategories(), fetchVisibilitySetting()]);
      setLoading(false);
    };
    init();
  }, [fetchCategories, fetchVisibilitySetting]);

  // Set visibility and persist to API
  const setCategoriesVisible = useCallback(async (visible: boolean) => {
    setCategoriesVisibleState(visible);
    try {
      await settingsApi.set(CATEGORIES_VISIBLE_KEY, visible ? 'true' : 'false');
    } catch (err) {
      console.error('Failed to save visibility setting:', err);
    }
  }, []);

  // Create category
  const createCategory = useCallback(async (input: CreateCategoryInput) => {
    try {
      const created = await categoriesApi.create(input);
      setCategories(prev => [...prev, created]);
      return created;
    } catch (err) {
      console.error('Failed to create category:', err);
      throw err;
    }
  }, []);

  // Update category
  const updateCategory = useCallback(async (id: string, input: UpdateCategoryInput) => {
    try {
      const updated = await categoriesApi.update(id, input);
      setCategories(prev => prev.map(c => c.id === id ? updated : c));
      return updated;
    } catch (err) {
      console.error('Failed to update category:', err);
      throw err;
    }
  }, []);

  // Delete category
  const deleteCategory = useCallback(async (id: string) => {
    try {
      await categoriesApi.delete(id);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Failed to delete category:', err);
      throw err;
    }
  }, []);

  // Reorder categories
  const reorderCategories = useCallback(async (categoryIds: string[]) => {
    try {
      const reordered = await categoriesApi.reorder(categoryIds);
      setCategories(reordered);
    } catch (err) {
      console.error('Failed to reorder categories:', err);
      throw err;
    }
  }, []);

  // Get category by ID
  const getCategoryById = useCallback((id: string | null): Category | undefined => {
    if (!id) return undefined;
    return categories.find(c => c.id === id);
  }, [categories]);

  return {
    categories,
    loading,
    categoriesVisible,
    setCategoriesVisible,
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    getCategoryById,
    refetch: fetchCategories,
  };
}
