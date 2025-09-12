// utils/categoryDragDropManager.ts

import { EditingCategory, getCategoryName } from '@/types/app/category-types';

export interface DragDropResult
{
    isValid: boolean;
    reason?: string;
}

export interface ParentDetermination
{
    parent_path?: string | null;
    parentCategory?: EditingCategory;
}

export interface StateUpdateParams
{
    draggedCategory: EditingCategory;
    destinationIndex: number;
    displayCategories: EditingCategory[];
    newParentPath?: string | null;
    originalParentPath?: string | null;
    editingCategories: EditingCategory[];
}

export interface StateUpdateResult
{
    updatedCategories: EditingCategory[];
    categoryIndex: number;
    wasParentChanged: boolean;
}

/**
 * Helper functions for common operations
 */
const CategoryHelpers = {
    /**
     * Checks if a category is a descendant of the dragged category
     */
    isDescendantOfDragged: (category: EditingCategory, draggedCategory: EditingCategory): boolean =>
    {
        return category.parent_path?.startsWith(draggedCategory.path + '.') ||
            category.parent_path === draggedCategory.path;
    },

    /**
     * Checks if two categories are the same
     */
    isSameCategory: (cat1: EditingCategory, cat2: EditingCategory): boolean =>
    {
        return (cat1.category_id === cat2.category_id) || (cat1.temp_id === cat2.temp_id);
    },

    /**
     * Finds a category index in the categories array
     */
    findCategoryIndex: (categories: EditingCategory[], targetCategory: EditingCategory): number =>
    {
        return categories.findIndex(cat => CategoryHelpers.isSameCategory(cat, targetCategory));
    },

    /**
     * Gets all siblings with the same parent
     */
    getSiblings: (categories: EditingCategory[], parentPath?: string | null, excludeCategory?: EditingCategory): EditingCategory[] =>
    {
        return categories.filter(cat =>
        {
            if (excludeCategory && CategoryHelpers.isSameCategory(cat, excludeCategory))
            {
                return false;
            }
            return cat.parent_path === parentPath;
        });
    },

    /**
     * Gets the maximum display order among siblings
     */
    getMaxDisplayOrder: (siblings: EditingCategory[]): number =>
    {
        return siblings.length > 0 ? Math.max(...siblings.map(c => c.display_order || 0)) : 0;
    },

    /**
     * Walks backwards through display categories to find a parent at the target level
     */
    findParentAtLevel: (
        startCategory: EditingCategory,
        targetLevel: number,
        displayCategories: EditingCategory[]
    ): EditingCategory | null =>
    {
        // For a category to be placed at targetLevel, we need to find a parent at targetLevel - 1
        const requiredParentLevel = targetLevel - 1;
        let potentialParent: EditingCategory | null = startCategory;

        // If the start category is already at the required parent level, use it
        if ((potentialParent.level || 1) === requiredParentLevel)
        {
            return potentialParent;
        }

        // Walk backwards to find a category at the required parent level
        while (potentialParent && (potentialParent.level || 1) > requiredParentLevel)
        {
            const prevIndex: number = displayCategories.indexOf(potentialParent) - 1;
            potentialParent = prevIndex >= 0 ? displayCategories[prevIndex] : null;
        }

        // Return the parent if it's at the correct level
        return (potentialParent && (potentialParent.level || 1) === requiredParentLevel) ? potentialParent : null;
    },

    /**
     * Normalizes display orders for categories with the same parent
     */
    normalizeDisplayOrders: (categories: EditingCategory[], parentPath?: string): EditingCategory[] =>
    {
        // Get all categories with the specified parent
        const siblings = categories.filter(cat => cat.parent_path === parentPath);

        // Sort by current display order
        siblings.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

        // Reassign display orders starting from 1
        const updatedCategories = [...categories];
        siblings.forEach((sibling, index) =>
        {
            const catIndex = updatedCategories.findIndex(
                cat => CategoryHelpers.isSameCategory(cat, sibling)
            );
            if (catIndex !== -1)
            {
                updatedCategories[catIndex] = {
                    ...updatedCategories[catIndex],
                    display_order: index + 1
                };
            }
        });

        return updatedCategories;
    }
};

/**
 * Reference category selection logic
 */
const ReferenceSelector = {
    /**
     * Gets reference category for root level movements
     */
    getReferenceCategoryForRootLevel: (
        targetIndex: number,
        displayCategories: EditingCategory[],
        draggedCategory: EditingCategory
    ): EditingCategory | null =>
    {
        // For root level movements, we need to be more careful about reference selection

        if (targetIndex === 0)
        {
            return null; // Moving to beginning
        }

        // Look backwards from target position to find a valid root level reference
        for (let i = targetIndex - 1; i >= 0; i--)
        {
            const candidate = displayCategories[i];

            // Skip if it's the dragged category or its descendant
            if (CategoryHelpers.isSameCategory(candidate, draggedCategory) ||
                CategoryHelpers.isDescendantOfDragged(candidate, draggedCategory))
            {
                continue;
            }

            // If it's a root level category, use it
            if (!candidate.parent_path)
            {
                return candidate;
            }
        }

        return null;
    },

    /**
     * Finds a valid reference category for determining parent relationships
     */
    findValidReferenceCategory: (
        draggedCategory: EditingCategory,
        targetIndex: number,
        displayCategories: EditingCategory[]
    ): EditingCategory | null =>
    {
        // Helper for validation
        const isValidReference = (category: EditingCategory): boolean =>
        {
            return Math.abs((category.level || 1) - (draggedCategory.level || 1)) <= 1 &&
                !CategoryHelpers.isSameCategory(category, draggedCategory) &&
                !CategoryHelpers.isDescendantOfDragged(category, draggedCategory);
        };

        // Special handling for root level categories
        if (!draggedCategory.parent_path && (draggedCategory.level || 1) === 1)
        {
            return ReferenceSelector.getReferenceCategoryForRootLevel(
                targetIndex,
                displayCategories,
                draggedCategory
            );
        }

        // Case 1: Dropping at the end
        if (targetIndex >= displayCategories.length - 1)
        {
            for (let i = displayCategories.length - 1; i >= 0; i--)
            {
                const candidate = displayCategories[i];
                if (isValidReference(candidate))
                {
                    return candidate;
                }
            }
            return null;
        }

        // Case 2: Dropping in the middle - prioritize what comes BEFORE
        if (targetIndex > 0)
        {
            const beforeCategory = displayCategories[targetIndex - 1];
            if (isValidReference(beforeCategory))
            {
                return beforeCategory;
            }

            // Walk backwards to find a valid reference
            for (let i = targetIndex - 2; i >= 0; i--)
            {
                const candidate = displayCategories[i];
                if (isValidReference(candidate))
                {
                    return candidate;
                }
            }
        }

        // Case 3: Use target category as fallback
        const targetCategory = displayCategories[targetIndex];
        if (targetCategory && isValidReference(targetCategory))
        {
            return targetCategory;
        }

        return null;
    }
};

/**
 * Validation logic for drag and drop operations
 */
const DragDropValidator = {
    /**
     * Validates if moving to the beginning is allowed
     */
    validateBeginningPlacement: (draggedCategory: EditingCategory): DragDropResult =>
    {
        if ((draggedCategory.level || 1) === 1)
        {
            return { isValid: true };
        }
        return {
            isValid: false,
            reason: 'Only level 1 categories can be placed at the beginning'
        };
    },

    /**
     * Validates same level movements
     */
    validateSameLevelMove: (
        draggedCategory: EditingCategory,
        referenceCategory: EditingCategory
    ): DragDropResult =>
    {
        // Same level moves are generally allowed, but check for circular dependency
        if (referenceCategory.path || ''.startsWith(draggedCategory.path + '.') ||
            referenceCategory.path || '' === draggedCategory.path)
        {
            return {
                isValid: false,
                reason: 'Cannot move category under itself or its descendant'
            };
        }
        return { isValid: true };
    },

    /**
     * Validates child movements (making category a child of reference)
     */
    validateChildMove: (
        draggedCategory: EditingCategory,
        referenceCategory: EditingCategory
    ): DragDropResult =>
    {
        // Check for circular dependency
        if (referenceCategory.path || ''.startsWith(draggedCategory.path + '.') ||
            referenceCategory.path || '' === draggedCategory.path)
        {
            return {
                isValid: false,
                reason: 'Cannot move category under itself or its descendant'
            };
        }
        return { isValid: true };
    },

    /**
     * Validates complex level movements
     */
    validateLevelJump: (
        draggedCategory: EditingCategory,
        referenceCategory: EditingCategory,
        targetIndex: number,
        displayCategories: EditingCategory[]
    ): DragDropResult =>
    {
        const targetLevel = draggedCategory.level || 1;

        // Check for invalid level jumps after level 1 categories
        if ((referenceCategory.level || 1) === 1 && targetLevel > 2)
        {
            return {
                isValid: false,
                reason: `Level ${targetLevel} category cannot be placed after a level 1 category - requires a level ${targetLevel - 1} parent`
            };
        }

        // Try to find appropriate parent by walking backwards
        const potentialParent = CategoryHelpers.findParentAtLevel(
            referenceCategory,
            targetLevel,
            displayCategories
        );

        // Check if we found a valid parent at the required level
        if (!potentialParent)
        {
            return {
                isValid: false,
                reason: `Level ${targetLevel} category cannot be moved to this position - requires a level ${targetLevel - 1} parent`
            };
        }

        // Check for circular dependency with the found parent
        if ((potentialParent.path || '').startsWith((draggedCategory.path || '') + '.') ||
            (potentialParent.path || '') === (draggedCategory.path || ''))
        {
            return {
                isValid: false,
                reason: 'Cannot move category under itself or its descendant'
            };
        }

        return { isValid: true };
    }
};

/**
 * Parent determination logic
 */
const ParentDeterminator = {
    /**
     * Validates parent determination result
     */
    validateParentDetermination: (
        draggedCategory: EditingCategory,
        parentDetermination: ParentDetermination
    ): boolean =>
    {
        // Level 1 categories must have no parent
        if ((draggedCategory.level || 1) === 1 && parentDetermination.parent_path)
        {
            return false;
        }

        // Non-level 1 categories must have a parent
        if ((draggedCategory.level || 1) > 1 && !parentDetermination.parent_path)
        {
            return false;
        }

        // Parent must be exactly one level up
        if (parentDetermination.parentCategory)
        {
            const expectedParentLevel = (draggedCategory.level || 1) - 1;
            if ((parentDetermination.parentCategory.level || 1) !== expectedParentLevel)
            {
                return false;
            }
        }

        // Check for circular dependency
        if (parentDetermination.parent_path)
        {
            if (parentDetermination.parent_path.startsWith(draggedCategory.path + '.') ||
                parentDetermination.parent_path === draggedCategory.path)
            {
                return false;
            }
        }

        return true;
    },

    /**
     * Determines parent from reference category
     */
    determineParentFromReference: (
        draggedCategory: EditingCategory,
        referenceCategory: EditingCategory,
        targetIndex: number,
        displayCategories: EditingCategory[],
        allEditingCategories: EditingCategory[]
    ): ParentDetermination =>
    {
        const draggedLevel = draggedCategory.level || 1;
        const referenceLevel = referenceCategory.level || 1;

        // Key insight: The reference category tells us the context
        // But we need to check what comes AFTER to understand intent

        // Look at what comes after the reference in the display
        const nextIndex = displayCategories.indexOf(referenceCategory) + 1;
        const nextCategory = nextIndex < displayCategories.length ? displayCategories[nextIndex] : null;

        // Case 1: Reference could be the parent
        if (draggedLevel === referenceLevel + 1)
        {
            // Check if the next item is a child of reference
            if (nextCategory && nextCategory.parent_path === referenceCategory.path || '')
            {
                // Reference has children - dragged joins them
                return {
                    parent_path: referenceCategory.path || undefined,
                    parentCategory: referenceCategory
                };
            }

            // Check if we're at the drop position right after reference
            if (nextIndex === targetIndex || !nextCategory)
            {
                // We're dropping right after reference - become its child
                return {
                    parent_path: referenceCategory.path || undefined,
                    parentCategory: referenceCategory
                };
            }

            // If next is same level as reference, and we're dropping after reference
            if (nextCategory && (nextCategory.level || 1) === referenceLevel)
            {
                return {
                    parent_path: referenceCategory.path || undefined,
                    parentCategory: referenceCategory
                };
            }
        }

        // Case 2: Same level - share parent
        if (draggedLevel === referenceLevel)
        {
            return {
                parent_path: referenceCategory.parent_path || undefined,
                parentCategory: referenceCategory.parent_path ?
                    allEditingCategories.find(cat => cat.path === referenceCategory.parent_path) :
                    undefined
            };
        }

        // Case 3: Complex level relationships
        return ParentDeterminator.findAppropriateParent(
            draggedCategory,
            referenceCategory,
            allEditingCategories
        );
    },

    findAppropriateParent: (
        draggedCategory: EditingCategory,
        fromCategory: EditingCategory,
        allEditingCategories: EditingCategory[]
    ): ParentDetermination =>
    {
        const requiredParentLevel = (draggedCategory.level || 1) - 1;

        if (requiredParentLevel === 0)
        {
            return { parent_path: undefined, parentCategory: undefined };
        }

        // Strategy: Look for the nearest category at the required parent level
        // First check the fromCategory and its ancestors
        let current: EditingCategory | null = fromCategory;
        const visited = new Set<string>();

        while (current && !visited.has(current.path || ''))
        {
            visited.add(current.path || '');

            if ((current.level || 1) === requiredParentLevel)
            {
                return {
                    parent_path: current.path || '',
                    parentCategory: current
                };
            }

            // Only go up if we're too deep
            if ((current.level || 1) > requiredParentLevel && current.parent_path)
            {
                current = allEditingCategories.find(cat => cat.path === current?.parent_path) || null;
            } else
            {
                break;
            }
        }

        // If we couldn't find in the hierarchy, this might be an invalid position
        return { parent_path: undefined, parentCategory: undefined };
    },
    /**
     * Main method to determine new parent
     */
    determineNewParent: (
        draggedCategory: EditingCategory,
        targetIndex: number,
        displayCategories: EditingCategory[],
        allEditingCategories: EditingCategory[]
    ): ParentDetermination =>
    {
        // Case 1: Moving to the beginning - always root
        if (targetIndex === 0)
        {
            return { parent_path: undefined, parentCategory: undefined };
        }

        // Get info about what's immediately before and at the target position
        const beforeCategory = targetIndex > 0 ? displayCategories[targetIndex - 1] : null;
        const targetCategory = targetIndex < displayCategories.length ? displayCategories[targetIndex] : null;

        // Filter out invalid references (self and descendants)
        const isValidReference = (cat: EditingCategory | null): boolean =>
        {
            if (!cat) return false;
            return Math.abs((cat.level || 1) - (draggedCategory.level || 1)) <= 1 &&
                !CategoryHelpers.isSameCategory(cat, draggedCategory) &&
                !CategoryHelpers.isDescendantOfDragged(cat, draggedCategory);
        };

        // Case 2: Dropping at the very end of the list
        if (targetIndex >= displayCategories.length - 1)
        {
            // Use the last valid category as reference
            for (let i = displayCategories.length - 1; i >= 0; i--)
            {
                const candidate = displayCategories[i];
                if (isValidReference(candidate))
                {
                    return ParentDeterminator.determineParentForEndPosition(
                        draggedCategory,
                        candidate,
                        allEditingCategories
                    );
                }
            }
            // No valid reference found - default to root
            return { parent_path: undefined, parentCategory: undefined };
        }

        // Case 3: Dropping between items - need to determine intent
        // The key is to understand: are we dropping to become a child of 'before' 
        // or a sibling of 'target'?

        // First, check if we have valid references
        const validBefore = beforeCategory && isValidReference(beforeCategory) ? beforeCategory : null;
        const validTarget = targetCategory && isValidReference(targetCategory) ? targetCategory : null;

        // If no valid references at all, look further back
        let validReference = validBefore || validTarget;
        if (!validReference)
        {
            for (let i = targetIndex - 2; i >= 0; i--)
            {
                const candidate = displayCategories[i];
                if (isValidReference(candidate))
                {
                    validReference = candidate;
                    break;
                }
            }
        }

        if (!validReference)
        {
            // No valid reference found - this shouldn't happen in normal cases
            return (draggedCategory.level || 1) === 1 ?
                { parent_path: undefined, parentCategory: undefined } :
                { parent_path: undefined, parentCategory: undefined };
        }

        // Now determine parent based on the drop position context
        return ParentDeterminator.determineParentForMidPosition(
            draggedCategory,
            validBefore,
            validTarget,
            validReference,
            targetIndex,
            displayCategories,
            allEditingCategories
        );
    },

    determineParentForEndPosition: (
        draggedCategory: EditingCategory,
        lastCategory: EditingCategory,
        allEditingCategories: EditingCategory[]
    ): ParentDetermination =>
    {
        const draggedLevel = draggedCategory.level || 1;
        const lastLevel = lastCategory.level || 1;

        // If dragged is one level deeper than last, last becomes parent
        if (draggedLevel === lastLevel + 1)
        {
            return {
                parent_path: lastCategory.path,
                parentCategory: lastCategory
            };
        }

        // If same level, share parent
        if (draggedLevel === lastLevel)
        {
            return {
                parent_path: lastCategory.parent_path,
                parentCategory: lastCategory.parent_path ?
                    allEditingCategories.find(cat => cat.path === lastCategory.parent_path) :
                    undefined
            };
        }

        // If dragged is shallower, find appropriate parent
        if (draggedLevel < lastLevel)
        {
            return ParentDeterminator.findParentForShallowerLevel(
                draggedCategory,
                lastCategory,
                allEditingCategories
            );
        }

        // If dragged is deeper by more than 1 level, this is complex
        // Try to find an appropriate parent at the required level
        const requiredParentLevel = draggedLevel - 1;

        // Walk up from last category to find parent at required level
        let current: EditingCategory | null = lastCategory;
        while (current)
        {
            if ((current.level || 1) === requiredParentLevel)
            {
                return {
                    parent_path: current.path || '',
                    parentCategory: current
                };
            }

            if (current.parent_path)
            {
                current = allEditingCategories.find(cat => cat.path === current?.parent_path) || null;
            } else
            {
                break;
            }
        }

        // Fallback
        return { parent_path: undefined, parentCategory: undefined };
    },

    determineParentForMidPosition: (
        draggedCategory: EditingCategory,
        beforeCategory: EditingCategory | null,
        targetCategory: EditingCategory | null,
        referenceCategory: EditingCategory,
        targetIndex: number,
        displayCategories: EditingCategory[],
        allEditingCategories: EditingCategory[]
    ): ParentDetermination =>
    {
        const draggedLevel = draggedCategory.level || 1;

        // Special handling based on what we're dropping between
        if (beforeCategory && targetCategory)
        {
            const beforeLevel = beforeCategory.level || 1;
            const targetLevel = targetCategory.level || 1;

            // Case 1: Dropping after a potential parent (before is one level up)
            if (draggedLevel === beforeLevel + 1)
            {
                // Check if target is a sibling or child of before
                if (targetLevel === beforeLevel)
                {
                    // Target is sibling of before - dragged becomes last child of before
                    return {
                        parent_path: beforeCategory.path,
                        parentCategory: beforeCategory
                    };
                } else if (targetLevel > beforeLevel)
                {
                    // Target is deeper - dragged becomes child of before
                    return {
                        parent_path: beforeCategory.path,
                        parentCategory: beforeCategory
                    };
                }
            }

            // Case 2: Dropping between siblings
            if (draggedLevel === beforeLevel && draggedLevel === targetLevel &&
                beforeCategory.parent_path === targetCategory.parent_path)
            {
                // All same level and parent - maintain parent
                return {
                    parent_path: beforeCategory.parent_path,
                    parentCategory: beforeCategory.parent_path ?
                        allEditingCategories.find(cat => cat.path === beforeCategory.parent_path) :
                        undefined
                };
            }

            // Case 3: Target is a different parent level
            if (targetLevel < draggedLevel)
            {
                // We're inserting before a shallower item
                // Need to use before's context
                if (beforeLevel === draggedLevel - 1)
                {
                    // Before could be our parent
                    return {
                        parent_path: beforeCategory.path,
                        parentCategory: beforeCategory
                    };
                } else if (beforeLevel === draggedLevel)
                {
                    // Before is a sibling - share parent
                    return {
                        parent_path: beforeCategory.parent_path,
                        parentCategory: beforeCategory.parent_path ?
                            allEditingCategories.find(cat => cat.path === beforeCategory.parent_path) :
                            undefined
                    };
                }
            }
        }

        // Fallback to standard logic based on reference
        return ParentDeterminator.determineParentFromReference(
            draggedCategory,
            referenceCategory,
            targetIndex,
            displayCategories,
            allEditingCategories
        );
    },

    findParentForShallowerLevel: (
        draggedCategory: EditingCategory,
        deeperCategory: EditingCategory,
        allEditingCategories: EditingCategory[]
    ): ParentDetermination =>
    {
        const requiredParentLevel = (draggedCategory.level || 1) - 1;

        // If root level needed
        if (requiredParentLevel === 0)
        {
            return { parent_path: undefined, parentCategory: undefined };
        }

        // Walk up the deeper category's hierarchy
        let current = deeperCategory;
        const visited = new Set<string>();

        while (current && !visited.has(current.path || ''))
        {
            visited.add(current.path || '');

            // Check if current or its parent is at required level
            if ((current.level || 1) === requiredParentLevel)
            {
                return {
                    parent_path: current.path || '',
                    parentCategory: current
                };
            }

            if (current.parent_path)
            {
                const parent = allEditingCategories.find(cat => cat.path === current.parent_path);
                if (parent)
                {
                    if ((parent.level || 1) === requiredParentLevel)
                    {
                        return {
                            parent_path: parent.path,
                            parentCategory: parent
                        };
                    }
                    current = parent;
                } else
                {
                    break;
                }
            } else
            {
                break;
            }
        }

        // Couldn't find in hierarchy - shouldn't happen with valid data
        return { parent_path: undefined, parentCategory: undefined };
    },

    determineParentFromCandidate: (
        draggedCategory: EditingCategory,
        candidateCategory: EditingCategory,
        allEditingCategories: EditingCategory[]
    ): ParentDetermination =>
    {
        const draggedLevel = draggedCategory.level || 1;
        const candidateLevel = candidateCategory.level || 1;

        // Case 1: Dragged is becoming child of candidate
        // This happens when dragged level = candidate level + 1
        if (draggedLevel === candidateLevel + 1)
        {
            return {
                parent_path: candidateCategory.path,
                parentCategory: candidateCategory
            };
        }

        // Case 2: Same level - share parent
        if (draggedLevel === candidateLevel)
        {
            return {
                parent_path: candidateCategory.parent_path,
                parentCategory: candidateCategory.parent_path ?
                    allEditingCategories.find(cat => cat.path === candidateCategory.parent_path) :
                    undefined
            };
        }

        // Case 3: Dragged is higher level than candidate
        // Need to find appropriate parent by walking up candidate's hierarchy
        if (draggedLevel < candidateLevel)
        {
            // We need a parent at level (draggedLevel - 1)
            const requiredParentLevel = draggedLevel - 1;

            // If we need root level parent
            if (requiredParentLevel === 0)
            {
                return { parent_path: undefined, parentCategory: undefined };
            }

            // Walk up candidate's parent chain
            let current: EditingCategory | null = candidateCategory;
            while (current)
            {
                // Check if current is at the required parent level
                if ((current.level || 1) === requiredParentLevel)
                {
                    return {
                        parent_path: current.path || '',
                        parentCategory: current
                    };
                }

                // Check current's parent
                if (current.parent_path)
                {
                    const parent = allEditingCategories.find(cat => cat.path === current?.parent_path);
                    if (parent && (parent.level || 1) === requiredParentLevel)
                    {
                        return {
                            parent_path: parent.path,
                            parentCategory: parent
                        };
                    }
                    current = parent || null;
                } else
                {
                    break;
                }
            }

            // Couldn't find appropriate parent in hierarchy
            return { parent_path: undefined, parentCategory: undefined };
        }

        // Case 4: Dragged is deeper level than candidate
        // This means we're looking for a parent deeper in the hierarchy

        // First, check if we can use candidate as parent
        if (candidateLevel === draggedLevel - 1)
        {
            return {
                parent_path: candidateCategory.path,
                parentCategory: candidateCategory
            };
        }

        // Otherwise, we need to find a descendant of candidate or a later category
        // This case is tricky - we're essentially saying "place after candidate's children"
        // The parent should be determined by what comes after in the display

        // For now, use candidate's parent if the level difference is too large
        return {
            parent_path: candidateCategory.parent_path,
            parentCategory: candidateCategory.parent_path ?
                allEditingCategories.find(cat => cat.path === candidateCategory.parent_path) :
                undefined
        };
    }
};

/**
 * State update logic
 */
const StateUpdater = {
    /**
     * Updates category state for new parent assignment
     */
    updateForNewParent: (
        categoryIndex: number,
        newParentPath: string | null| undefined,
        categories: EditingCategory[]
    ): EditingCategory[] =>
    {
        const newCategories = [...categories];
        const existingSiblings = CategoryHelpers.getSiblings(categories, newParentPath, categories[categoryIndex]);
        const maxOrder = CategoryHelpers.getMaxDisplayOrder(existingSiblings);

        newCategories[categoryIndex] = {
            ...newCategories[categoryIndex],
            parent_path: newParentPath,
            display_order: maxOrder + 1,
            is_dirty: true
        };

        return newCategories;
    },

    /**
     * Updates category state for same parent reordering
     */
    updateForSameParentReorder: (
        categoryIndex: number,
        destinationIndex: number,
        displayCategories: EditingCategory[],
        parent_path: string | null | undefined,
        categories: EditingCategory[]
    ): EditingCategory[] =>
    {
        const newCategories = [...categories];
        const draggedCategory = categories[categoryIndex];

        // Get all siblings with the same parent (including the dragged category)
        const allSiblingsIncludingDragged = categories.filter(cat => cat.parent_path === parent_path)
            .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

        // Remove the dragged category from the siblings list
        const siblingsWithoutDragged = allSiblingsIncludingDragged.filter(
            cat => !CategoryHelpers.isSameCategory(cat, draggedCategory)
        );

        // Calculate the visual position where we want to insert
        // This is based on counting how many siblings appear before the destination in the visual display
        let targetPosition = 0;

        if (destinationIndex >= displayCategories.length)
        {
            // Dropping at the very end - insert after all siblings
            targetPosition = siblingsWithoutDragged.length;
        } else
        {
            // Count how many siblings (excluding dragged) appear before the destination index
            for (let i = 0; i < destinationIndex; i++)
            {
                const category = displayCategories[i];
                if (category.parent_path === parent_path &&
                    !CategoryHelpers.isSameCategory(category, draggedCategory))
                {
                    targetPosition++;
                }
            }

            // Check if we're dropping ON a sibling (not just before it)
            // This handles the case where we want to push a sibling down
            const targetCategory = displayCategories[destinationIndex];
            if (targetCategory &&
                targetCategory.parent_path === parent_path &&
                !CategoryHelpers.isSameCategory(targetCategory, draggedCategory))
            {

                // We're dropping on a sibling position
                // The behavior depends on whether we're moving forward or backward
                const draggedCurrentIndex = displayCategories.findIndex(
                    cat => CategoryHelpers.isSameCategory(cat, draggedCategory)
                );

                // If we're moving backward (to a lower index), we insert before
                // If we're moving forward (to a higher index), we insert after
                if (draggedCurrentIndex > destinationIndex)
                {
                    // Moving backward - insert before the target
                    // targetPosition is already correct
                } else
                {
                    // Moving forward - insert after the target
                    targetPosition++;
                }
            }
        }

        // Ensure target position is within bounds
        targetPosition = Math.max(0, Math.min(targetPosition, siblingsWithoutDragged.length));

        // Create new ordered list
        const reorderedSiblings: EditingCategory[] = [];

        // Insert siblings up to the target position
        for (let i = 0; i < targetPosition; i++)
        {
            reorderedSiblings.push(siblingsWithoutDragged[i]);
        }

        // Insert the dragged category
        reorderedSiblings.push(draggedCategory);

        // Insert remaining siblings
        for (let i = targetPosition; i < siblingsWithoutDragged.length; i++)
        {
            reorderedSiblings.push(siblingsWithoutDragged[i]);
        }

        // Update display orders for all affected categories
        reorderedSiblings.forEach((cat, index) =>
        {
            const catIndex = CategoryHelpers.findCategoryIndex(newCategories, cat);
            if (catIndex !== -1)
            {
                newCategories[catIndex] = {
                    ...newCategories[catIndex],
                    display_order: index + 1, // 1-based display order
                    is_dirty: true
                };
            }
        });

        return newCategories;
    }
};

/**
 * Name validation logic
 */
const NameValidator = {
    /**
     * Validates category names for duplicates within parent groups
     */
    validateCategoryNames: (categories: EditingCategory[]): string[] =>
    {
        const errors: string[] = [];
        const parentGroups = new Map<string | undefined, EditingCategory[]>();

        // Group categories by parent
        categories.forEach(cat =>
        {
            const parentKey = cat.parent_path || 'root';
            if (!parentGroups.has(parentKey))
            {
                parentGroups.set(parentKey, []);
            }
            parentGroups.get(parentKey)?.push(cat);
        });

        // Check for duplicate names within each parent group
        parentGroups.forEach((siblings, parentKey) =>
        {
            const nameCount = new Map<string, EditingCategory[]>();

            siblings.forEach(cat =>
            {
                const name = getCategoryName(cat, 'en').trim().toLowerCase();
                if (name)
                {
                    if (!nameCount.has(name))
                    {
                        nameCount.set(name, []);
                    }
                    nameCount.get(name)?.push(cat);
                }
            });

            // Report duplicates
            nameCount.forEach((cats, name) =>
            {
                if (cats.length > 1)
                {
                    const parentName = parentKey === 'root' ? 'root level' : parentKey;
                    const categoryNames = cats.map(c => `"${getCategoryName(c, 'en')}"`).join(', ');
                    errors.push(`Duplicate name "${name}" found in ${parentName}: ${categoryNames}`);
                }
            });
        });

        return errors;
    }
};

/**
 * Main CategoryDragDropManager with refactored modular structure
 */
export const CategoryDragDropManager = {
    /**
     * Validates if a drag and drop operation is allowed
     */
    validateDragDrop: (
        draggedCategory: EditingCategory,
        targetIndex: number,
        allCategories: EditingCategory[]
    ): DragDropResult =>
    {
        // Case 1: Moving to the beginning
        if (targetIndex === 0)
        {
            return DragDropValidator.validateBeginningPlacement(draggedCategory);
        }

        // Find reference category
        const referenceCategory = ReferenceSelector.findValidReferenceCategory(
            draggedCategory, targetIndex, allCategories
        );

        if (!referenceCategory)
        {
            // Special case: if no valid reference found, check if it's because of circular dependency
            // Look at the actual target category to see if it's a descendant
            if (targetIndex < allCategories.length)
            {
                const targetCategory = allCategories[targetIndex];
                if (CategoryHelpers.isDescendantOfDragged(targetCategory, draggedCategory))
                {
                    return {
                        isValid: false,
                        reason: 'Cannot move category under itself or its descendant'
                    };
                }
            }

            // Check categories around the target position for descendants
            for (let i = Math.max(0, targetIndex - 1); i <= Math.min(allCategories.length - 1, targetIndex + 1); i++)
            {
                const candidate = allCategories[i];
                if (candidate && CategoryHelpers.isDescendantOfDragged(candidate, draggedCategory))
                {
                    return {
                        isValid: false,
                        reason: 'Cannot move category under itself or its descendant'
                    };
                }
            }

            return { isValid: false, reason: 'No valid reference category found' };
        }

        // Case 2: Same level movement
        if ((draggedCategory.level || 1) === (referenceCategory.level || 1))
        {
            return DragDropValidator.validateSameLevelMove(draggedCategory, referenceCategory);
        }

        // Case 3: Child movement (level + 1)
        if ((draggedCategory.level || 1) === (referenceCategory.level || 1) + 1)
        {
            return DragDropValidator.validateChildMove(draggedCategory, referenceCategory);
        }

        // Case 4: Complex level movements
        return DragDropValidator.validateLevelJump(
            draggedCategory, referenceCategory, targetIndex, allCategories
        );
    },

    /**
     * Determines what the new parent would be after a drop operation
     */
    determineNewParent: ParentDeterminator.determineNewParent,

    /**
     * Updates the editing categories state after a successful drag and drop operation
     */
    updateCategoriesState: (params: StateUpdateParams): StateUpdateResult =>
    {
        const {
            draggedCategory,
            destinationIndex,
            displayCategories,
            newParentPath,
            originalParentPath,
            editingCategories
        } = params;

        const categoryIndex = CategoryHelpers.findCategoryIndex(editingCategories, draggedCategory);

        if (categoryIndex === -1)
        {
            return {
                updatedCategories: editingCategories,
                categoryIndex: -1,
                wasParentChanged: false
            };
        }

        const wasParentChanged = newParentPath !== originalParentPath;

        let updatedCategories: EditingCategory[];

        if (wasParentChanged)
        {
            // Moving to a new parent
            updatedCategories = StateUpdater.updateForNewParent(
                categoryIndex, newParentPath, editingCategories
            );
        } else
        {
            // Same parent - handle reordering
            updatedCategories = StateUpdater.updateForSameParentReorder(
                categoryIndex, destinationIndex, displayCategories, newParentPath, editingCategories
            );
        }

        // CRITICAL: Sort the categories to match their display order
        // Group by parent and sort each group by display order
        const sortedCategories = CategoryDragDropManager.sortCategoriesByDisplayOrder(updatedCategories);

        // Find the new index of the moved category after sorting
        const newCategoryIndex = CategoryHelpers.findCategoryIndex(sortedCategories, draggedCategory);

        return {
            updatedCategories: sortedCategories,
            categoryIndex: newCategoryIndex,
            wasParentChanged
        };
    },

    /**
     * Sorts categories by their display order within each parent group
     */
    sortCategoriesByDisplayOrder: (categories: EditingCategory[]): EditingCategory[] =>
    {
        // Group categories by parent path
        const parentGroups = new Map<string | null | undefined, EditingCategory[]>();

        categories.forEach(category =>
        {
            const parentKey = category.parent_path;
            if (!parentGroups.has(parentKey))
            {
                parentGroups.set(parentKey, []);
            }
            parentGroups.get(parentKey)?.push(category);
        });

        // Sort each group by display order and flatten
        const sortedCategories: EditingCategory[] = [];

        // Process root categories first (undefined parent)
        const rootCategories = parentGroups.get(undefined) || [];
        rootCategories.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

        // Recursively add categories and their children in display order
        const addCategoryAndChildren = (category: EditingCategory) =>
        {
            sortedCategories.push(category);

            // Add children if they exist, sorted by display order
            const children = parentGroups.get(category.path) || [];
            children.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
            children.forEach(child => addCategoryAndChildren(child));
        };

        // Start with root categories
        rootCategories.forEach(rootCat => addCategoryAndChildren(rootCat));

        return sortedCategories;
    },

    /**
     * Validates category names for duplicates within parent groups
     */
    validateCategoryNames: NameValidator.validateCategoryNames,

    /**
     * Optional simplified reorder handler for common cases
     */
    handleSimpleReorder: (
        draggedCategory: EditingCategory,
        fromIndex: number,
        toIndex: number,
        categories: EditingCategory[]
    ): EditingCategory[] =>
    {
        const parentPath = draggedCategory.parent_path;

        // Get siblings in display order
        const siblings = categories
            .filter(cat => cat.parent_path === parentPath)
            .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

        // Find current position in siblings array
        const currentPos = siblings.findIndex(
            cat => CategoryHelpers.isSameCategory(cat, draggedCategory)
        );

        if (currentPos === -1) return categories;

        // Remove from current position
        const reordered = [...siblings];
        reordered.splice(currentPos, 1);

        // Calculate new position in siblings array
        // This accounts for the fact that removing the item shifts indices
        let newPos = 0;
        for (let i = 0; i < toIndex && i < categories.length; i++)
        {
            const cat = categories[i];
            if (cat.parent_path === parentPath &&
                !CategoryHelpers.isSameCategory(cat, draggedCategory))
            {
                newPos++;
            }
        }

        // Insert at new position
        reordered.splice(newPos, 0, draggedCategory);

        // Update display orders
        const updatedCategories = [...categories];
        reordered.forEach((cat, index) =>
        {
            const catIndex = updatedCategories.findIndex(
                c => CategoryHelpers.isSameCategory(c, cat)
            );
            if (catIndex !== -1)
            {
                updatedCategories[catIndex] = {
                    ...updatedCategories[catIndex],
                    display_order: index + 1,
                    is_dirty: true
                };
            }
        });

        return updatedCategories;
    }
};

export default CategoryDragDropManager;