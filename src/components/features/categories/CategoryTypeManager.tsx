// components/categories/CategoryTypeManager.tsx
'use client'

import { Card, CardContent } from '@/components/ui/card';
import { useCategoryHooks } from '@/hooks/api';
import { CategoryDto, CategoryLocalizationDto, CategoryType } from '@/types';
import
{
    CategoryItemSize,
    EditingCategory,
    SupportedLanguageCode,
    createNewCategory,
    getCategoryName,
    getChildrenForCategory
} from '@/types/app/category-types';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useCategoryLocalization } from './hooks/category-hooks';

// Import components
import CategoryDragDropManager from '@/lib/categoryDragDropManager';
import { generateSlug } from '@/lib/slug-utils';
import CategoryControlsSection from './CategoryControlsSection';
import CategoryEditModal from './CategoryEditModal';
import CategoryListContainer from './CategoryListContainer';
import CompactCategoryItem, { calculateConsistentWidth } from './CompactCategoryItem';
import DiscardChangesConfirmationDialog from './DiscardChangesConfirmationDialog';
import TranslationManagerModal from './TranslationManagerModal';
import ValidationErrorsDisplay from './ValidationErrorsDisplay';

interface CategoryTypeManagerProps
{
    type: CategoryType;
    searchQuery: string;
}

// Custom hook for category state management
const useCategoryState = (type: CategoryType, filteredCategories: CategoryDto[]) =>
{
    const [editingCategories, setEditingCategories] = useState<EditingCategory[]>([]);
    const [originalCategories, setOriginalCategories] = useState<EditingCategory[]>([]);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const initialized = useRef(false);

    // Initialize editing state
    const initializeEditingState = useCallback(() =>
    {
        if (filteredCategories.length > 0 && !initialized.current)
        {
            const editingState = filteredCategories.map((cat, index) => ({
                ...cat,
                temp_id: crypto.randomUUID(),
                is_dirty: false,
                is_new: false,
                has_image_change: false
            }));
            setEditingCategories(editingState);
            setOriginalCategories(editingState);
            initialized.current = true;
        }
    }, [filteredCategories]);

    // Reset when type changes
    useEffect(() =>
    {
        initialized.current = false;
        setEditingCategories([]);
        setOriginalCategories([]);
        setExpandedCategories(new Set());
    }, [type]);

    // Initialize editing state
    useEffect(() =>
    {
        initializeEditingState();
    }, [initializeEditingState]);

    return {
        editingCategories,
        setEditingCategories,
        originalCategories,
        expandedCategories,
        setExpandedCategories
    };
};

// Custom hook for modal state management
const useModalState = () =>
{
    const [selectedCategoryForEdit, setSelectedCategoryForEdit] = useState<EditingCategory | null>(null);
    const [showTranslationManager, setShowTranslationManager] = useState(false);
    const [translationCategoryId, setTranslationCategoryId] = useState<string | null>(null);
    const [showDiscardConfirmation, setShowDiscardConfirmation] = useState(false);

    return {
        selectedCategoryForEdit,
        setSelectedCategoryForEdit,
        showTranslationManager,
        setShowTranslationManager,
        translationCategoryId,
        setTranslationCategoryId,
        showDiscardConfirmation,
        setShowDiscardConfirmation
    };
};

// CategoryList component for rendering the main list
const CategoryList = ({
    displayCategories,
    expandedCategories,
    selectedLanguage,
    availableLanguages,
    showImages,
    itemSize,
    maxHierarchyLevel,
    getLocalizedName,
    hasTranslation,
    getMissingTranslations,
    getChildrenCount,
    onDragEnd,
    onEdit,
    onDelete,
    onAddChild,
    onOpenTranslations,
    onToggleExpanded
}: any) =>
{
    const consistentWidth = useMemo(() =>
    {
        return calculateConsistentWidth(itemSize, maxHierarchyLevel);
    }, [itemSize, maxHierarchyLevel]);

    const getHierarchyMargin = (category: EditingCategory) =>
    {
        const indentPerLevel = itemSize === 'small' ? 12 : itemSize === 'medium' ? 16 : 20;
        const maxIndent = 120;
        return Math.min(((category.level || 1) - 1) * indentPerLevel, maxIndent);
    };

    if (displayCategories.length === 0)
    {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <Card className="bg-[#171717] border-[#202020] mx-4 my-8">
                    <CardContent className="py-12 text-center">
                        <div className="text-[#575757] mb-4">
                            No categories found
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-4 pb-8 min-w-fit overflow-x-auto">
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="categories" type="CATEGORY">
                    {(provided, snapshot) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`space-y-2 flex flex-col items-start min-h-[200px] ${snapshot.isDraggingOver ? 'bg-[#202020]/50' : ''
                                }`}
                            style={{ minHeight: '200px' }}
                        >
                            {displayCategories.map((category: EditingCategory, index: number) =>
                            {
                                const hasChildren = getChildrenCount(category.path) > 0;
                                const isExpanded = expandedCategories.has(category.category_id!) || expandedCategories.has(category.temp_id!);
                                const hierarchyMargin = getHierarchyMargin(category);
                                const stableId = category.category_id || category.temp_id || crypto.randomUUID();
                                const dragKey = `${stableId}-${category.level}`;

                                return (
                                    <Draggable
                                        key={dragKey}
                                        draggableId={dragKey}
                                        index={index}
                                        isDragDisabled={false}
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                style={{
                                                    ...provided.draggableProps.style,
                                                    width: `${consistentWidth}px`,
                                                    marginLeft: `${hierarchyMargin}px`
                                                }}
                                            >
                                                <CompactCategoryItem
                                                    category={category}
                                                    selectedLanguage={selectedLanguage}
                                                    onEdit={() => onEdit(category)}
                                                    onDelete={onDelete}
                                                    onAddChild={onAddChild}
                                                    onOpenTranslations={onOpenTranslations}
                                                    dragHandleProps={provided.dragHandleProps}
                                                    isDragging={snapshot.isDragging}
                                                    getLocalizedName={getLocalizedName}
                                                    hasTranslation={hasTranslation}
                                                    getMissingTranslations={getMissingTranslations}
                                                    availableLanguages={availableLanguages}
                                                    showImages={showImages}
                                                    isExpanded={isExpanded}
                                                    onToggleExpanded={hasChildren ? () => onToggleExpanded(category.category_id! || category.temp_id!) : undefined}
                                                    hasChildren={hasChildren}
                                                    childrenCount={getChildrenCount(category.path)}
                                                    size={itemSize}
                                                    maxHierarchyLevel={maxHierarchyLevel}
                                                    consistentWidth={consistentWidth}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default function CategoryTypeManager({ type, searchQuery }: CategoryTypeManagerProps)
{
    // UI state
    const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguageCode>('en');
    const [showInactiveCategories, setShowInactiveCategories] = useState(false);
    const [showImages, setShowImages] = useState(false);
    const [itemSize, setItemSize] = useState<CategoryItemSize>('medium');
    const [pendingImages, setPendingImages] = useState<File[]>([]);
    const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);

    // Hooks
    const categoryHooks = useCategoryHooks();
    const { data: categories, isLoading } = categoryHooks.getAll(type);
    const { mutate: bulkUpdate, isPending: isUpdating } = categoryHooks.bulkUpdate();
    const {
        availableLanguages,
        getLocalizedName,
        addTranslation,
        removeTranslation,
        hasTranslation,
        getMissingTranslations
    } = useCategoryLocalization();

    // Filtered categories
    const filteredCategories = useMemo(() =>
    {
        if (!categories) return [];

        let filtered = showInactiveCategories
            ? categories
            : categories.filter(cat => cat.is_active);

        if (searchQuery.trim())
        {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((cat: CategoryDto) =>
                getLocalizedName(cat, selectedLanguage).toLowerCase().includes(query) ||
                (cat.path || '').toLowerCase().includes(query)
            );
        }

        return filtered.sort((a: CategoryDto, b: CategoryDto) => (a.display_order || 0) - (b.display_order || 0));
    }, [categories, showInactiveCategories, searchQuery, selectedLanguage, getLocalizedName]);

    // Custom hooks
    const {
        editingCategories,
        setEditingCategories,
        originalCategories,
        expandedCategories,
        setExpandedCategories
    } = useCategoryState(type, filteredCategories);

    const modalState = useModalState();

    // Display categories with collapsible functionality
    const displayCategories = useMemo(() =>
    {
        if (!editingCategories.length) return [];

        const result: EditingCategory[] = [];
        const processedIds = new Set<string>();

        const addCategoryAndVisibleChildren = (category: EditingCategory) =>
        {
            const categoryKey = category.category_id || category.temp_id!;
            if (processedIds.has(categoryKey)) return;

            processedIds.add(categoryKey);
            result.push(category);

            if (expandedCategories.has(categoryKey))
            {
                const children = getChildrenForCategory(editingCategories, category.path || '')
                    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

                children.forEach(child => addCategoryAndVisibleChildren(child));
            }
        };

        const rootCategories = editingCategories
            .filter(cat => !cat.parent_path)
            .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

        rootCategories.forEach(root => addCategoryAndVisibleChildren(root));

        return result;
    }, [editingCategories, expandedCategories]);

    // Calculate maximum hierarchy level
    const maxHierarchyLevel = useMemo(() =>
    {
        if (!editingCategories.length) return 5;
        const maxLevel = Math.max(...editingCategories.map(cat => cat.level || 1));
        return Math.max(maxLevel, 5);
    }, [editingCategories]);

    // Get categories with children using memoized function
    const categoriesWithChildren = useMemo(() =>
    {
        return editingCategories.filter(cat =>
            getChildrenForCategory(editingCategories, cat.path || '').length > 0
        );
    }, [editingCategories]);

    // Get children count using memoized function
    const getChildrenCount = useCallback((categoryPath: string) =>
    {
        return getChildrenForCategory(editingCategories, categoryPath).length;
    }, [editingCategories]);

    // Toggle category expansion
    const toggleExpanded = useCallback((categoryKey: string) =>
    {
        setExpandedCategories(prev =>
        {
            const newSet = new Set(prev);
            if (newSet.has(categoryKey))
            {
                newSet.delete(categoryKey);
            } else
            {
                newSet.add(categoryKey);
            }
            return newSet;
        });
    }, []);

    // Expand/collapse all categories
    const expandAll = useCallback(() =>
    {
        const allExpandableKeys = new Set<string>();
        categoriesWithChildren.forEach(cat =>
        {
            const key = cat.category_id || cat.temp_id!;
            allExpandableKeys.add(key);
        });
        setExpandedCategories(allExpandableKeys);
        toast.success('All categories expanded');
    }, [categoriesWithChildren]);

    const collapseAll = useCallback(() =>
    {
        setExpandedCategories(new Set());
        toast.success('All categories collapsed');
    }, []);

    // Handle drag and drop - FIXED VERSION WITH DEBUGGING
    const handleDragEnd = useCallback((result: any) =>
    {
        if (!result.destination) return;

        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;

        if (sourceIndex === destinationIndex) return;

        const draggedCategory = displayCategories[sourceIndex];
        if (!draggedCategory) return;

        // Validate the drop using the new manager
        const validation = CategoryDragDropManager.validateDragDrop(
            draggedCategory,
            destinationIndex,
            displayCategories
        );

        if (!validation.isValid)
        {
            toast.error(`Invalid move: ${validation.reason}`);
            return;
        }

        // Determine the new parent using the new manager
        const { parent_path: newParentPath, parentCategory: newParentCategory } =
            CategoryDragDropManager.determineNewParent(
                draggedCategory,
                destinationIndex,
                displayCategories,
                editingCategories
            );

        // Store the original parent path for comparison
        const originalParentPath = draggedCategory.parent_path;

        // Update state using the new manager
        const updateResult = CategoryDragDropManager.updateCategoriesState({
            draggedCategory,
            destinationIndex,
            displayCategories,
            newParentPath,
            originalParentPath: originalParentPath || undefined,
            editingCategories
        });

        if (updateResult.categoryIndex === -1)
        {
            toast.error('Failed to update category');
            return;
        }

        setEditingCategories(updateResult.updatedCategories);

        // Auto-expand the new parent category if the category was moved to a new parent
        if (updateResult.wasParentChanged && newParentCategory)
        {
            const parentKey = newParentCategory.category_id || newParentCategory.temp_id!;

            // Immediate expansion to ensure the moved category is visible
            setExpandedCategories(prev =>
            {
                const newSet = new Set(prev);
                newSet.add(parentKey);
                return newSet;
            });

            // Show success message
            setTimeout(() =>
            {
                toast.success(`Category "${getCategoryName(draggedCategory, 'en')}" moved under "${getCategoryName(newParentCategory, 'en')}"`, {
                    duration: 3000
                });
            }, 50);
        } else if (!updateResult.wasParentChanged)
        {
            toast.success(`Category "${getCategoryName(draggedCategory, 'en')}" reordered successfully`);
        } else
        {
            toast.success(`Category "${getCategoryName(draggedCategory, 'en')}" moved successfully`);
        }

    }, [displayCategories, editingCategories]);

    // Add new category
    const handleAddCategory = useCallback((parentPath?: string) =>
    {
        const parentCategory = parentPath ?
            editingCategories.find(cat => cat.path === parentPath) : null;

        const newDisplayOrder = parentCategory
            ? Math.max(...editingCategories
                .filter(cat => cat.parent_path === parentPath)
                .map(cat => cat.display_order || 0), 0) + 1
            : Math.max(...editingCategories
                .filter(cat => !cat.parent_path)
                .map(cat => cat.display_order || 0), 0) + 1;

        const newUuid = crypto.randomUUID();
        const uniqueNameId = newUuid.split('-')[0];
        const defaultName = `Unnamed Category ${uniqueNameId}`;

        const newCategory: EditingCategory = {
            ...createNewCategory(type, parentPath),
            category_id: newUuid,
            temp_id: newUuid,
            // name will be in localizations
            path: parentPath ? `${parentPath}.${uniqueNameId}` : uniqueNameId,
            created_at: new Date().toISOString(),
            modified_at: new Date().toISOString(),
            is_new: true,
            is_dirty: true,
            has_image_change: false,
            display_order: newDisplayOrder,
            level: parentCategory ? (parentCategory.level || 1) + 1 : 1,
            localizations: [{
                language_code: 'en',
                name: defaultName,
                slug: generateSlug(defaultName, {
                    preset: 'category',
                    maxLength: 50
                }),
                description: ''
            }]
        };

        setEditingCategories(prev => [...prev, newCategory]);

        if (parentPath && parentCategory)
        {
            const parentKey = parentCategory.category_id || parentCategory.temp_id!;
            setExpandedCategories(prev => new Set([...prev, parentKey]));
        }

        toast.success(`Added new category: ${defaultName}`);
    }, [editingCategories, type]);

    // Delete category
    const handleDeleteCategory = useCallback((categoryId: string) =>
    {
        const category = editingCategories.find(cat => cat.category_id === categoryId || cat.temp_id === categoryId);
        if (!category) return;

        const hasChildren = editingCategories.some(cat => cat.parent_path === category.path);
        if (hasChildren)
        {
            toast.error('Cannot delete category with subcategories');
            return;
        }

        if (category.image_id)
        {
            setDeletedImageUrls(prev => [...prev, `/api/images/${category.image_id}`]);
        }

        setEditingCategories(prev => prev.filter(cat =>
            cat.category_id !== categoryId && cat.temp_id !== categoryId
        ));
        toast.success('Category marked for deletion');
    }, [editingCategories]);

    // Update category field
    const updateCategoryField = useCallback((categoryId: string, field: string, value: any) =>
    {
        setEditingCategories(prev =>
            prev.map(cat =>
            {
                if (cat.category_id === categoryId || cat.temp_id === categoryId)
                {
                    const updatedCat = { ...cat, [field]: value, is_dirty: true };

                    if (field === 'name')
                    {
                        const localizations = [...(updatedCat.localizations || [])];
                        const enIndex = localizations.findIndex(loc => loc.language_code === 'en');
                        if (enIndex >= 0)
                        {
                            localizations[enIndex] = {
                                ...localizations[enIndex],
                                name: value,
                                slug: generateSlug(value, {
                                    preset: 'category',
                                    lang: 'en',
                                    maxLength: 50
                                })
                            };
                        }
                        updatedCat.localizations = localizations;
                    }

                    return updatedCat;
                }
                return cat;
            })
        );
    }, []);

    // Update localization
    const updateLocalization = useCallback((
        categoryId: string,
        languageCode: SupportedLanguageCode,
        field: keyof any,
        value: string
    ) =>
    {
        setEditingCategories(prev =>
            prev.map(cat =>
            {
                if (cat.category_id === categoryId || cat.temp_id === categoryId)
                {
                    const localizations = [...(cat.localizations || [])];
                    const locIndex = localizations.findIndex(loc => loc.language_code === languageCode);

                    if (locIndex >= 0)
                    {
                        localizations[locIndex] = { ...localizations[locIndex], [field]: value };
                    } else
                    {
                        localizations.push({
                            language_code: languageCode,
                            name: field === 'name' ? value : '',
                            slug: field === 'slug' ? value : (field === 'name' ? generateSlug(value, {
                                preset: 'category',
                                lang: languageCode,
                                maxLength: 50
                            }) : ''),
                            description: field === 'description' ? value : ''
                        });
                    }

                    const updates: any = { localizations, is_dirty: true };
                    if (languageCode === 'en')
                    {
                        updates[field] = value;
                    }

                    return { ...cat, ...updates };
                }
                return cat;
            })
        );
    }, []);

    // Handle image upload
    const handleImageUpload = useCallback((categoryId: string, file: File) =>
    {
        const previewUrl = URL.createObjectURL(file);

        updateCategoryField(categoryId, 'image_id', 'temp-preview-id');

        setEditingCategories(prev => prev.map(cat =>
        {
            if (cat.category_id === categoryId || cat.temp_id === categoryId)
            {
                return { ...cat, has_image_change: true, is_dirty: true };
            }
            return cat;
        }));

        setPendingImages(prev => [...prev, file]);
    }, [updateCategoryField]);

    // Add/remove translations
    const handleAddTranslation = useCallback((categoryId: string, languageCode: SupportedLanguageCode) =>
    {
        setEditingCategories(prev => prev.map(cat =>
        {
            if (cat.category_id === categoryId || cat.temp_id === categoryId)
            {
                const updatedCategory = addTranslation(cat as CategoryDto, languageCode);
                return { ...updatedCategory, isDirty: true } as EditingCategory;
            }
            return cat;
        }));
    }, [addTranslation]);

    const handleRemoveTranslation = useCallback((categoryId: string, languageCode: SupportedLanguageCode) =>
    {
        setEditingCategories(prev => prev.map(cat =>
        {
            if (cat.category_id === categoryId || cat.temp_id === categoryId)
            {
                const updatedCategory = removeTranslation(cat as CategoryDto, languageCode);
                return { ...updatedCategory, isDirty: true } as EditingCategory;
            }
            return cat;
        }));
    }, [removeTranslation]);

    const handleModalSave = useCallback((changes: {
        fieldUpdates: { field: string; value: any }[];
        localizationUpdates: { lang: SupportedLanguageCode; field: keyof CategoryLocalizationDto; value: string }[];
        imageFile?: File;
        iconName?: string;
    }) =>
    {
        if (!modalState.selectedCategoryForEdit) return;

        const categoryId = modalState.selectedCategoryForEdit.category_id!;

        // Apply field updates
        changes.fieldUpdates.forEach(({ field, value }) =>
        {
            updateCategoryField(categoryId, field, value);
        });

        // Apply localization updates  
        changes.localizationUpdates.forEach(({ lang, field, value }) =>
        {
            updateLocalization(categoryId, lang, field, value);
        });

        // Handle image upload
        if (changes.imageFile)
        {
            handleImageUpload(categoryId, changes.imageFile);
        }

        // Handle icon selection
        if (changes.iconName)
        {
            updateCategoryField(categoryId, 'icon_name', changes.iconName);
        }

        toast.success('Category updated successfully');
    }, [modalState.selectedCategoryForEdit, updateCategoryField, updateLocalization, handleImageUpload]);


    // Save changes
    const handleSaveChanges = useCallback(async () =>
    {
        const validationErrors = CategoryDragDropManager.validateCategoryNames(editingCategories);

        if (validationErrors.length > 0)
        {
            toast.error(`Cannot save due to validation errors:\n${validationErrors.join('\n')}`);
            return;
        }

        const missingNames = editingCategories.filter(cat => !getCategoryName(cat, 'en').trim());
        if (missingNames.length > 0)
        {
            toast.error(`Cannot save: ${missingNames.length} categories are missing names`);
            return;
        }

        const categoriesToSave: CategoryDto[] = editingCategories.map(cat =>
        {
            const { is_new, is_dirty, temp_id, has_image_change, ...categoryData } = cat;
            return {
                ...categoryData,
                category_id: is_new ? '' : cat.category_id!,
                created_at: is_new ? new Date().toISOString() : categoryData.created_at || new Date().toISOString(),
                modified_at: new Date().toISOString()
            };
        });

        try
        {
            bulkUpdate({
                data: {
                    CategoryType: type,
                    Categories: categoriesToSave as any,
                    ChangeDescription: 'Bulk category update'
                }
            });

            setPendingImages([]);
            setDeletedImageUrls([]);

            toast.success(`Successfully saved ${categoriesToSave.length} categories`);
        } catch (error)
        {
            toast.error('Failed to save categories. Please try again.');
            console.error('Save error:', error);
        }
    }, [editingCategories, pendingImages, deletedImageUrls, bulkUpdate]);

    // Cancel changes
    const handleConfirmDiscardChanges = useCallback(() =>
    {
        setEditingCategories([...originalCategories]);
        setPendingImages([]);
        setDeletedImageUrls([]);
        modalState.setShowDiscardConfirmation(false);
        toast.info('All changes have been discarded');
    }, [originalCategories, modalState]);

    // Computed values
    const validationErrors = useMemo(() =>
        CategoryDragDropManager.validateCategoryNames(editingCategories),
        [editingCategories]
    );

    const hasUnsavedChanges = useMemo(() =>
        editingCategories.some(cat => cat.is_dirty || cat.is_new),
        [editingCategories]
    );

    const changedCategoriesCount = useMemo(() =>
        editingCategories.filter(cat => cat.is_dirty || cat.is_new).length,
        [editingCategories]
    );

    // Loading state
    if (isLoading)
    {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-[#828288]">Loading categories...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Controls */}
            <CategoryControlsSection
                showInactiveCategories={showInactiveCategories}
                showImages={showImages}
                itemSize={itemSize}
                selectedLanguage={selectedLanguage}
                hasUnsavedChanges={hasUnsavedChanges}
                changedCategoriesCount={changedCategoriesCount}
                validationErrors={validationErrors}
                isUpdating={isUpdating}
                expandedCategories={expandedCategories}
                categoriesWithChildren={categoriesWithChildren}
                availableLanguages={availableLanguages}
                onAddCategory={() => handleAddCategory()}
                onToggleInactive={setShowInactiveCategories}
                onToggleImages={setShowImages}
                onItemSizeChange={setItemSize}
                onLanguageChange={setSelectedLanguage}
                onSaveChanges={handleSaveChanges}
                onCancelChanges={() => modalState.setShowDiscardConfirmation(true)}
                onExpandAll={expandAll}
                onCollapseAll={collapseAll}
            />

            {/* Validation Errors Display */}
            <ValidationErrorsDisplay errors={validationErrors} />

            {/* Categories List Container */}
            <CategoryListContainer
                categoryCount={displayCategories.length}
                hasUnsavedChanges={hasUnsavedChanges}
                changedCategoriesCount={changedCategoriesCount}
            >
                <CategoryList
                    displayCategories={displayCategories}
                    expandedCategories={expandedCategories}
                    selectedLanguage={selectedLanguage}
                    availableLanguages={availableLanguages}
                    showImages={showImages}
                    itemSize={itemSize}
                    maxHierarchyLevel={maxHierarchyLevel}
                    getLocalizedName={getLocalizedName}
                    hasTranslation={hasTranslation}
                    getMissingTranslations={getMissingTranslations}
                    getChildrenCount={getChildrenCount}
                    onDragEnd={handleDragEnd}
                    onEdit={modalState.setSelectedCategoryForEdit}
                    onDelete={handleDeleteCategory}
                    onAddChild={handleAddCategory}
                    onOpenTranslations={(categoryId: string) =>
                    {
                        modalState.setTranslationCategoryId(categoryId);
                        modalState.setShowTranslationManager(true);
                    }}
                    onToggleExpanded={toggleExpanded}
                />
            </CategoryListContainer>

            {/* Modals */}
            {modalState.selectedCategoryForEdit && (
                <CategoryEditModal
                    category={modalState.selectedCategoryForEdit}
                    selectedLanguage={selectedLanguage}
                    onClose={() => modalState.setSelectedCategoryForEdit(null)}
                    onUpdate={(field, value) => updateCategoryField(modalState.selectedCategoryForEdit?.category_id ?? '', field, value)}
                    onUpdateLocalization={(lang, field, value) =>
                        updateLocalization(modalState.selectedCategoryForEdit?.category_id ?? '', lang, field, value)
                    }
                    onOpenIconGallery={() => { }} // No longer needed - handled internally
                    onImageUpload={(file) => { }} // No longer needed - handled internally  
                    availableLanguages={availableLanguages}
                    onSave={handleModalSave} // New save handler
                />
            )}

            {modalState.showTranslationManager && modalState.translationCategoryId && (
                <TranslationManagerModal
                    category={editingCategories.find(cat =>
                        cat.category_id === modalState.translationCategoryId || cat.temp_id === modalState.translationCategoryId
                    )}
                    onClose={() =>
                    {
                        modalState.setShowTranslationManager(false);
                        modalState.setTranslationCategoryId(null);
                    }}
                    onUpdateLocalization={(lang, field, value) =>
                        updateLocalization(modalState.translationCategoryId!, lang, field, value)
                    }
                    onAddTranslation={(lang) => handleAddTranslation(modalState.translationCategoryId!, lang)}
                    onRemoveTranslation={(lang) => handleRemoveTranslation(modalState.translationCategoryId!, lang)}
                    availableLanguages={availableLanguages}
                    hasTranslation={hasTranslation}
                    getMissingTranslations={getMissingTranslations}
                />
            )}

            <DiscardChangesConfirmationDialog
                isOpen={modalState.showDiscardConfirmation}
                onClose={() => modalState.setShowDiscardConfirmation(false)}
                onConfirm={handleConfirmDiscardChanges}
                changeCount={changedCategoriesCount}
            />
        </div>
    );
}