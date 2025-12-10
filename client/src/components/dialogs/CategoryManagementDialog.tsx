import { useState, useCallback } from 'react';
import { Tags, Plus, Trash2, Pencil, X, Check, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { DynamicIcon } from '@/components/DynamicIcon';
import { IconSelector } from '@/components/IconSelector';
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '@/types';

// Preset colors for categories
const PRESET_COLORS = [
  '#10B981', // green (Frontend default)
  '#3B82F6', // blue (Backend default)
  '#8B5CF6', // purple
  '#F59E0B', // amber
  '#EF4444', // red
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#84CC16', // lime
  '#6B7280', // gray
  '#F97316', // orange
];

interface CategoryManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onCreateCategory: (input: CreateCategoryInput) => Promise<Category>;
  onUpdateCategory: (id: string, input: UpdateCategoryInput) => Promise<Category>;
  onDeleteCategory: (id: string) => Promise<void>;
  onReorderCategories: (categoryIds: string[]) => Promise<void>;
  categoriesVisible: boolean;
  onCategoriesVisibleChange: (visible: boolean) => void;
}

// Sortable category item component
interface SortableCategoryItemProps {
  category: Category;
  isEditing: boolean;
  editName: string;
  editColor: string;
  editIcon: string;
  showEditIconPicker: boolean;
  isSubmitting: boolean;
  deleteConfirm: string | null;
  onStartEdit: (category: Category) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onDelete: (id: string) => void;
  onSetDeleteConfirm: (id: string | null) => void;
  onSetEditName: (name: string) => void;
  onSetEditColor: (color: string) => void;
  onSetEditIcon: (icon: string) => void;
  onToggleEditIconPicker: () => void;
}

function SortableCategoryItem({
  category,
  isEditing,
  editName,
  editColor,
  editIcon,
  showEditIconPicker,
  isSubmitting,
  deleteConfirm,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
  onSetDeleteConfirm,
  onSetEditName,
  onSetEditColor,
  onSetEditIcon,
  onToggleEditIconPicker,
}: SortableCategoryItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-3 border rounded-lg bg-card"
    >
      {isEditing ? (
        // Edit mode
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <Input
              value={editName}
              onChange={(e) => onSetEditName(e.target.value)}
              className="h-8"
              autoFocus
            />
            <Button
              onClick={onSaveEdit}
              disabled={!editName.trim() || isSubmitting}
              size="sm"
              className="h-8"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              onClick={onCancelEdit}
              variant="ghost"
              size="sm"
              className="h-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => onSetEditColor(color)}
                  className={`w-5 h-5 rounded-full transition-transform ${
                    editColor === color
                      ? 'ring-2 ring-offset-1 ring-foreground ring-offset-background'
                      : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={onToggleEditIconPicker}
              className="flex items-center gap-1.5 px-2 py-1 border rounded text-xs hover:bg-muted"
            >
              <DynamicIcon name={editIcon} className="h-3.5 w-3.5" />
              {editIcon}
            </button>
          </div>

          {showEditIconPicker && (
            <IconSelector value={editIcon} onChange={onSetEditIcon} />
          )}
        </div>
      ) : (
        // View mode
        <>
          <div className="flex items-center gap-3">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </button>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: category.color + '20' }}
            >
              <DynamicIcon
                name={category.icon}
                className="h-4 w-4"
                style={{ color: category.color }}
              />
            </div>
            <div>
              <p className="font-medium text-sm">{category.name}</p>
              <p className="text-xs text-muted-foreground">
                {category.icon}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              onClick={() => onStartEdit(category)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Modifica"
            >
              <Pencil className="h-4 w-4" />
            </Button>

            {deleteConfirm === category.id ? (
              <div className="flex items-center gap-1">
                <Button
                  onClick={() => onDelete(category.id)}
                  disabled={isSubmitting}
                  variant="destructive"
                  size="sm"
                  className="h-8 px-2 text-xs"
                >
                  Conferma
                </Button>
                <Button
                  onClick={() => onSetDeleteConfirm(null)}
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs"
                >
                  Annulla
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => onSetDeleteConfirm(category.id)}
                disabled={isSubmitting}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                title="Elimina"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export function CategoryManagementDialog({
  open,
  onOpenChange,
  categories,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  onReorderCategories,
  categoriesVisible,
  onCategoriesVisibleChange,
}: CategoryManagementDialogProps) {
  // New category form
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);
  const [newIcon, setNewIcon] = useState('Tag');
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  const [editIcon, setEditIcon] = useState('');
  const [showEditIconPicker, setShowEditIconPicker] = useState(false);

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end for reordering
  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = categories.findIndex((c) => c.id === active.id);
        const newIndex = categories.findIndex((c) => c.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const newOrder = arrayMove(categories, oldIndex, newIndex);
          await onReorderCategories(newOrder.map((c) => c.id));
        }
      }
    },
    [categories, onReorderCategories]
  );

  const handleCreate = async () => {
    if (!newName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onCreateCategory({
        name: newName.trim(),
        color: newColor,
        icon: newIcon,
      });
      setNewName('');
      setNewColor(PRESET_COLORS[0]);
      setNewIcon('Tag');
      setShowIconPicker(false);
    } catch (err) {
      console.error('Failed to create category:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditColor(category.color);
    setEditIcon(category.icon);
    setShowEditIconPicker(false);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setShowEditIconPicker(false);
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onUpdateCategory(editingId, {
        name: editName.trim(),
        color: editColor,
        icon: editIcon,
      });
      setEditingId(null);
      setShowEditIconPicker(false);
    } catch (err) {
      console.error('Failed to update category:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsSubmitting(true);
    try {
      await onDeleteCategory(id);
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Failed to delete category:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tags className="h-5 w-5" />
            Gestione Categorie
          </DialogTitle>
          <DialogDescription>
            Crea e gestisci le categorie per organizzare i tuoi prompt
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Visibility toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
            <div className="space-y-0.5">
              <Label htmlFor="categories-visible" className="text-sm font-medium">
                Mostra categorie nell'app
              </Label>
              <p className="text-xs text-muted-foreground">
                Attiva per mostrare filtri e badge delle categorie
              </p>
            </div>
            <Switch
              id="categories-visible"
              checked={categoriesVisible}
              onCheckedChange={onCategoriesVisibleChange}
            />
          </div>

          {/* Add new category */}
          <div className="border rounded-lg p-4 space-y-4">
            <h4 className="font-medium text-sm">Nuova categoria</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-name" className="text-xs">Nome</Label>
                <Input
                  id="new-name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Es. Design, Testing, API..."
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Colore</Label>
                <div className="flex gap-1.5 flex-wrap">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewColor(color)}
                      className={`w-6 h-6 rounded-full transition-transform ${
                        newColor === color
                          ? 'ring-2 ring-offset-2 ring-foreground ring-offset-background scale-110'
                          : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Icona</Label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowIconPicker(!showIconPicker)}
                  className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-muted transition-colors"
                >
                  <DynamicIcon name={newIcon} className="h-4 w-4" />
                  <span className="text-sm">{newIcon}</span>
                </button>
                <Button
                  onClick={handleCreate}
                  disabled={!newName.trim() || isSubmitting}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Aggiungi
                </Button>
              </div>
              {showIconPicker && (
                <div className="mt-2">
                  <IconSelector value={newIcon} onChange={(icon) => setNewIcon(icon)} />
                </div>
              )}
            </div>
          </div>

          {/* Categories list */}
          <div>
            <h4 className="font-medium text-sm mb-3">
              Categorie ({categories.length})
            </h4>

            {categories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm border rounded-lg">
                Nessuna categoria. Creane una sopra.
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={categories.map((c) => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <SortableCategoryItem
                        key={category.id}
                        category={category}
                        isEditing={editingId === category.id}
                        editName={editName}
                        editColor={editColor}
                        editIcon={editIcon}
                        showEditIconPicker={showEditIconPicker}
                        isSubmitting={isSubmitting}
                        deleteConfirm={deleteConfirm}
                        onStartEdit={handleStartEdit}
                        onCancelEdit={handleCancelEdit}
                        onSaveEdit={handleSaveEdit}
                        onDelete={handleDelete}
                        onSetDeleteConfirm={setDeleteConfirm}
                        onSetEditName={setEditName}
                        onSetEditColor={setEditColor}
                        onSetEditIcon={setEditIcon}
                        onToggleEditIconPicker={() => setShowEditIconPicker(!showEditIconPicker)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>

          {/* Info note */}
          <p className="text-xs text-muted-foreground text-center">
            Eliminare una categoria non elimina i prompt associati, che diventeranno "senza categoria".
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
