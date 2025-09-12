// components/categories/TranslationManagerModal.tsx
'use client'

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ResponsiveModal from '@/components/ui/responsive-modal';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useDeviceDetection } from '@/hooks/system/use-device-detection';
import { generateSlug } from '@/lib/slug-utils';
import { CategoryLocalizationDto } from '@/types';
import { EditingCategory, SUPPORTED_LANGUAGES, SupportedLanguageCode, getCategoryName } from '@/types/app/category-types';
import { Languages, Plus, Save, Trash2, X } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';

interface TranslationManagerModalProps
{
    category?: EditingCategory;
    onClose: () => void;
    onUpdateLocalization: (lang: SupportedLanguageCode, field: keyof CategoryLocalizationDto, value: string) => void;
    onAddTranslation: (lang: SupportedLanguageCode) => void;
    onRemoveTranslation: (lang: SupportedLanguageCode) => void;
    availableLanguages: typeof SUPPORTED_LANGUAGES[number][];
    hasTranslation: (cat: EditingCategory, lang: SupportedLanguageCode) => boolean;
    getMissingTranslations: (cat: EditingCategory) => SupportedLanguageCode[];
}

// Interface for pending translation changes
interface PendingTranslations
{
    [languageCode: string]: Partial<CategoryLocalizationDto>;
}

// Separate component for translation stats
const TranslationStatsSection = React.memo(({
    category,
    availableLanguages,
    missingTranslations
}: {
    category: EditingCategory;
    availableLanguages: typeof SUPPORTED_LANGUAGES[number][];
    missingTranslations: SupportedLanguageCode[];
}) =>
{
    const completedCount = availableLanguages.length - missingTranslations.length;
    const progressPercentage = Math.round((completedCount / availableLanguages.length) * 100);

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-[#090909] rounded-lg border border-[#202020]">
                <div className="text-2xl font-bold text-[#EDECF8]">
                    {category.localizations?.length || 0}
                </div>
                <div className="text-xs text-[#575757]">Total Languages</div>
            </div>
            <div className="text-center p-3 bg-[#090909] rounded-lg border border-[#202020]">
                <div className="text-2xl font-bold text-green-400">
                    {completedCount}
                </div>
                <div className="text-xs text-[#575757]">Complete</div>
            </div>
            <div className="text-center p-3 bg-[#090909] rounded-lg border border-[#202020]">
                <div className="text-2xl font-bold text-orange-400">
                    {missingTranslations.length}
                </div>
                <div className="text-xs text-[#575757]">Missing</div>
            </div>
            <div className="text-center p-3 bg-[#090909] rounded-lg border border-[#202020]">
                <div className="text-2xl font-bold text-blue-400">
                    {progressPercentage}%
                </div>
                <div className="text-xs text-[#575757]">Progress</div>
            </div>
        </div>
    );
});

TranslationStatsSection.displayName = 'TranslationStatsSection';

// Desktop language sidebar component
const LanguageSidebar = React.memo(({
    availableLanguages,
    selectedLang,
    category,
    hasTranslation,
    pendingTranslations,
    onLanguageSelect,
    onAddTranslation
}: {
    availableLanguages: typeof SUPPORTED_LANGUAGES[number][];
    selectedLang: SupportedLanguageCode;
    category: EditingCategory;
    hasTranslation: (lang: SupportedLanguageCode) => boolean;
    pendingTranslations: PendingTranslations;
    onLanguageSelect: (lang: SupportedLanguageCode) => void;
    onAddTranslation: (lang: SupportedLanguageCode) => void;
}) => (
    <div className="w-64 border-r border-[#202020] bg-[#171717] flex-shrink-0">
        <div className="p-4 border-b border-[#202020]">
            <h3 className="text-sm font-semibold text-[#EDECF8]">Languages</h3>
            <p className="text-xs text-[#575757] mt-1">Select a language to edit</p>
        </div>
        <ScrollArea className="h-full">
            <div className="p-2">
                {availableLanguages.map(lang =>
                {
                    const hasLangTranslation = hasTranslation(lang.code);
                    const hasPendingChanges = pendingTranslations[lang.code] && Object.keys(pendingTranslations[lang.code]).length > 0;
                    const isSelected = selectedLang === lang.code;

                    return (
                        <button
                            key={lang.code}
                            onClick={() => onLanguageSelect(lang.code)}
                            className={`w-full flex items-center justify-between p-3 rounded-lg transition-all mb-1 ${isSelected
                                ? 'bg-[#D78E59] text-[#171717]'
                                : 'text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]'
                                }`}
                        >
                            <div className="flex items-center space-x-3 min-w-0 flex-1">
                                <span className="text-lg flex-shrink-0">{lang.flag}</span>
                                <div className="text-left min-w-0 flex-1">
                                    <div className={`text-sm font-medium truncate ${isSelected ? 'text-[#171717]' : hasLangTranslation ? 'text-[#EDECF8]' : 'text-[#575757]'
                                        }`}>
                                        {lang.name}
                                    </div>
                                    <div className={`text-xs ${isSelected ? 'text-[#171717]/70' : 'text-[#575757]'
                                        }`}>
                                        {lang.code.toUpperCase()}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-1 flex-shrink-0">
                                {hasPendingChanges && (
                                    <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#171717]' : 'bg-yellow-400'
                                        }`} title="Has pending changes" />
                                )}
                                {hasLangTranslation ? (
                                    <Badge variant="secondary" className={`text-xs ${isSelected
                                        ? 'bg-[#171717]/20 text-[#171717]'
                                        : 'bg-green-500 text-white'
                                        }`}>
                                        ✓
                                    </Badge>
                                ) : lang.code !== 'en' ? (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) =>
                                        {
                                            e.stopPropagation();
                                            onAddTranslation(lang.code);
                                            onLanguageSelect(lang.code);
                                        }}
                                        className={`h-auto p-1 ${isSelected
                                            ? 'text-[#171717] hover:text-[#171717]/70'
                                            : 'text-[#575757] hover:text-[#EDECF8]'
                                            }`}
                                    >
                                        <Plus className="h-3 w-3" />
                                    </Button>
                                ) : null}
                            </div>
                        </button>
                    );
                })}
            </div>
        </ScrollArea>
    </div>
));

LanguageSidebar.displayName = 'LanguageSidebar';

// Mobile language selector (kept as fallback)
const MobileLanguageSelector = React.memo(({
    availableLanguages,
    selectedLang,
    category,
    hasTranslation,
    pendingTranslations,
    onLanguageSelect,
    onAddTranslation
}: {
    availableLanguages: typeof SUPPORTED_LANGUAGES[number][];
    selectedLang: SupportedLanguageCode;
    category: EditingCategory;
    hasTranslation: (lang: SupportedLanguageCode) => boolean;
    pendingTranslations: PendingTranslations;
    onLanguageSelect: (lang: SupportedLanguageCode) => void;
    onAddTranslation: (lang: SupportedLanguageCode) => void;
}) => (
    <div>
        <Label className="text-[#828288] text-sm mb-3 block">Select Language to Edit</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableLanguages.map(lang =>
            {
                const hasLangTranslation = hasTranslation(lang.code);
                const hasPendingChanges = pendingTranslations[lang.code] && Object.keys(pendingTranslations[lang.code]).length > 0;
                const isSelected = selectedLang === lang.code;

                return (
                    <button
                        key={lang.code}
                        onClick={() => onLanguageSelect(lang.code)}
                        className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all min-h-[70px] ${isSelected
                            ? 'border-[#D78E59] bg-[#D78E59]/10'
                            : hasLangTranslation
                                ? 'border-green-500/50 bg-green-500/10 hover:border-green-500'
                                : 'border-[#575757] bg-[#202020] hover:border-[#828288]'
                            }`}
                    >
                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                            <span className="text-lg flex-shrink-0">{lang.flag}</span>
                            <div className="text-left min-w-0">
                                <div className={`text-sm font-medium truncate ${isSelected ? 'text-[#D78E59]' : hasLangTranslation ? 'text-green-400' : 'text-[#828288]'
                                    }`}>
                                    {lang.name}
                                </div>
                                <div className="text-xs text-[#575757]">
                                    {lang.code.toUpperCase()}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                            {hasPendingChanges && (
                                <div className="w-2 h-2 bg-yellow-400 rounded-full" title="Has pending changes" />
                            )}
                            {hasLangTranslation ? (
                                <Badge variant="secondary" className="bg-green-500 text-white text-xs">
                                    ✓
                                </Badge>
                            ) : lang.code !== 'en' ? (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) =>
                                    {
                                        e.stopPropagation();
                                        onAddTranslation(lang.code);
                                        onLanguageSelect(lang.code);
                                    }}
                                    className="h-auto p-1 text-[#575757] hover:text-[#EDECF8]"
                                >
                                    <Plus className="h-3 w-3" />
                                </Button>
                            ) : null}
                        </div>
                    </button>
                );
            })}
        </div>
    </div>
));

MobileLanguageSelector.displayName = 'MobileLanguageSelector';

// Translation form component
const TranslationForm = React.memo(({
    category,
    selectedLang,
    currentLocalization,
    pendingChanges,
    onUpdatePendingLocalization,
    onRemoveTranslation,
    generateSlugForLanguage
}: {
    category: EditingCategory;
    selectedLang: SupportedLanguageCode;
    currentLocalization: CategoryLocalizationDto;
    pendingChanges: Partial<CategoryLocalizationDto>;
    onUpdatePendingLocalization: (field: keyof CategoryLocalizationDto, value: string) => void;
    onRemoveTranslation: (lang: SupportedLanguageCode) => void;
    generateSlugForLanguage: (name: string, language: SupportedLanguageCode) => string;
}) =>
{
    const handleNameChange = useCallback((value: string) =>
    {
        onUpdatePendingLocalization('name', value);
        // Auto-generate slug if it's empty or matches previous pattern
        const currentSlug = pendingChanges.slug || currentLocalization.slug;
        const originalName = currentLocalization.name || '';
        const expectedSlug = generateSlugForLanguage(originalName || '', selectedLang);

        if (!currentSlug || currentSlug === expectedSlug)
        {
            onUpdatePendingLocalization('slug', generateSlugForLanguage(value, selectedLang));
        }
    }, [pendingChanges.slug, currentLocalization, selectedLang, onUpdatePendingLocalization, generateSlugForLanguage]);

    const handleSlugChange = useCallback((value: string) =>
    {
        const cleanSlug = generateSlug(value, {
            preset: 'category',
            lang: selectedLang,
            maxLength: 50
        });
        onUpdatePendingLocalization('slug', cleanSlug);
    }, [selectedLang, onUpdatePendingLocalization]);

    const englishLocalization = useMemo(() =>
        category.localizations?.find(l => l.language_code === 'en'),
        [category.localizations]
    );

    // Get current values (pending changes override current localization)
    const displayName = pendingChanges.name !== undefined ? pendingChanges.name : currentLocalization.name;
    const displaySlug = pendingChanges.slug !== undefined ? pendingChanges.slug : currentLocalization.slug;
    const displayDescription = pendingChanges.description !== undefined ? pendingChanges.description : (currentLocalization.description || '');

    return (
        <div className="space-y-6 p-6 bg-[#090909] rounded-lg border border-[#202020]">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-[#EDECF8]">
                    Edit {selectedLang.toUpperCase()} Translation
                </h3>
                {selectedLang !== 'en' && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRemoveTranslation(selectedLang)}
                        className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                    </Button>
                )}
            </div>

            {/* Form fields */}
            <div className="space-y-4">
                <div>
                    <Label className="text-[#828288] text-sm">
                        Name ({selectedLang.toUpperCase()})
                        {selectedLang === 'en' && <span className="text-red-400 ml-1">*</span>}
                    </Label>
                    <Input
                        value={displayName || ''}
                        onChange={(e) => handleNameChange(e.target.value)}
                        className="bg-[#171717] border-[#575757] text-[#EDECF8] mt-1"
                        placeholder="Category name"
                        maxLength={100}
                    />
                    <div className="text-xs text-[#575757] mt-1">
                        {(displayName || '').length}/100 characters
                    </div>
                </div>

                <div>
                    <Label className="text-[#828288] text-sm">
                        Slug ({selectedLang.toUpperCase()})
                        {selectedLang === 'en' && <span className="text-red-400 ml-1">*</span>}
                    </Label>
                    <Input
                        value={displaySlug || ''}
                        onChange={(e) => handleSlugChange(e.target.value)}
                        className="bg-[#171717] border-[#575757] text-[#EDECF8] mt-1"
                        placeholder="category-slug"
                        maxLength={50}
                    />
                    <div className="text-xs text-[#575757] mt-1">
                        {(displaySlug || '').length}/50 characters • Generated using speakingurl with {selectedLang.toUpperCase()} support
                    </div>
                </div>

                <div>
                    <Label className="text-[#828288] text-sm">
                        Description ({selectedLang.toUpperCase()})
                    </Label>
                    <Textarea
                        value={displayDescription || ''}
                        onChange={(e) => onUpdatePendingLocalization('description', e.target.value)}
                        className="bg-[#171717] border-[#575757] text-[#EDECF8] mt-1"
                        placeholder="Category description"
                        rows={4}
                        maxLength={500}
                    />
                    <div className="text-xs text-[#575757] mt-1">
                        {(displayDescription || '').length}/500 characters
                    </div>
                </div>
            </div>

            {/* Reference Translation */}
            {selectedLang !== 'en' && englishLocalization && (
                <div className="border-t border-[#202020] pt-4">
                    <h4 className="text-sm font-medium text-[#828288] mb-3">
                        English Reference
                    </h4>
                    <div className="space-y-2 text-sm bg-[#171717] p-4 rounded-lg">
                        <div>
                            <span className="text-[#575757] font-medium">Name:</span>
                            <span className="text-[#EDECF8] ml-2">
                                {englishLocalization.name || 'Not set'}
                            </span>
                        </div>
                        <div>
                            <span className="text-[#575757] font-medium">Slug:</span>
                            <span className="text-[#EDECF8] ml-2 font-mono text-xs">
                                {englishLocalization.slug || 'Not set'}
                            </span>
                        </div>
                        <div>
                            <span className="text-[#575757] font-medium">Description:</span>
                            <div className="text-[#EDECF8] ml-2 mt-1">
                                {englishLocalization.description || 'Not set'}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

TranslationForm.displayName = 'TranslationForm';

// Missing translations notice component
const MissingTranslationsNotice = React.memo(({
    missingTranslations,
    availableLanguages,
    onAddTranslation,
    onLanguageSelect
}: {
    missingTranslations: SupportedLanguageCode[];
    availableLanguages: typeof SUPPORTED_LANGUAGES[number][];
    onAddTranslation: (lang: SupportedLanguageCode) => void;
    onLanguageSelect: (lang: SupportedLanguageCode) => void;
}) =>
{
    if (missingTranslations.length === 0) return null;

    return (
        <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
            <div className="flex items-start space-x-3">
                <Languages className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-medium text-orange-400 mb-2">
                        Missing Translations ({missingTranslations.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {missingTranslations.map(langCode =>
                        {
                            const lang = availableLanguages.find(l => l.code === langCode);
                            return (
                                <button
                                    key={langCode}
                                    onClick={() =>
                                    {
                                        onAddTranslation(langCode);
                                        onLanguageSelect(langCode);
                                    }}
                                    className="flex items-center px-3 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded text-xs transition-colors"
                                >
                                    <span className="mr-2">{lang?.flag}</span>
                                    <span className="font-medium">{lang?.name}</span>
                                    <Plus className="h-3 w-3 ml-2" />
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
});

MissingTranslationsNotice.displayName = 'MissingTranslationsNotice';

export default function TranslationManagerModal({
    category,
    onClose,
    onUpdateLocalization,
    onAddTranslation,
    onRemoveTranslation,
    availableLanguages,
    hasTranslation,
    getMissingTranslations
}: TranslationManagerModalProps)
{
    const [selectedLang, setSelectedLang] = useState<SupportedLanguageCode>('en');
    const [pendingTranslations, setPendingTranslations] = useState<PendingTranslations>({});

    // Local state for tracking translation additions and removals
    const [pendingAdditions, setPendingAdditions] = useState<Set<SupportedLanguageCode>>(new Set());
    const [pendingRemovals, setPendingRemovals] = useState<Set<SupportedLanguageCode>>(new Set());

    const { isMobile } = useDeviceDetection();

    if (!category) return null;

    // Enhanced helper functions that consider pending changes
    const hasTranslationWithPending = useCallback((lang: SupportedLanguageCode): boolean =>
    {
        // If pending removal, return false
        if (pendingRemovals.has(lang)) return false;

        // If pending addition, return true
        if (pendingAdditions.has(lang)) return true;

        // Otherwise use original function
        return hasTranslation(category, lang);
    }, [category, hasTranslation, pendingAdditions, pendingRemovals]);

    const getMissingTranslationsWithPending = useCallback((): SupportedLanguageCode[] =>
    {
        const originalMissing = getMissingTranslations(category);

        // Remove languages that are pending addition
        const afterAdditions = originalMissing.filter(lang => !pendingAdditions.has(lang));

        // Add languages that are pending removal
        const afterRemovals = [
            ...afterAdditions,
            ...Array.from(pendingRemovals).filter(lang =>
                !originalMissing.includes(lang) // Don't add if already missing
            )
        ];

        return afterRemovals;
    }, [category, getMissingTranslations, pendingAdditions, pendingRemovals]);

    const missingTranslations = useMemo(() => getMissingTranslationsWithPending(), [getMissingTranslationsWithPending]);
    const hasCurrentTranslation = useMemo(() => hasTranslationWithPending(selectedLang), [selectedLang, hasTranslationWithPending]);

    const currentLocalization = useMemo(() =>
    {
        // If this is a pending addition, return empty localization
        if (pendingAdditions.has(selectedLang) && !hasTranslation(category, selectedLang))
        {
            return { language_code: selectedLang, name: '', slug: '', description: '' };
        }

        // If this is a pending removal, we still want to show the form (but it will be discarded)
        return category.localizations?.find(loc => loc.language_code === selectedLang) ||
            { language_code: selectedLang, name: '', slug: '', description: '' };
    }, [category.localizations, selectedLang, pendingAdditions, hasTranslation]);

    // Enhanced slug generation using speakingurl
    const generateSlugForLanguage = useCallback((name: string, language: SupportedLanguageCode): string =>
    {
        return generateSlug(name, {
            preset: 'category',
            lang: language,
            maxLength: 50
        });
    }, []);

    const handleLanguageSelect = useCallback((lang: SupportedLanguageCode) =>
    {
        setSelectedLang(lang);
    }, []);

    // Handle adding translation (local only)
    const handleAddTranslationLocal = useCallback((lang: SupportedLanguageCode) =>
    {
        setPendingAdditions(prev => new Set([...prev, lang]));
        setPendingRemovals(prev =>
        {
            const newSet = new Set(prev);
            newSet.delete(lang); // Remove from removals if it was there
            return newSet;
        });

        // Initialize with empty localization if not exists
        if (!hasTranslation(category, lang))
        {

            const englishLocalization = category.localizations?.find(l => l.language_code === 'en');

            setPendingTranslations(prev => ({
                ...prev,
                [lang]: {
                    name: englishLocalization?.name || '',
                    slug: englishLocalization?.slug || '',
                    description: englishLocalization?.description || ''
                }
            }));
        }
    }, [category, hasTranslation]);

    // Handle removing translation (local only)
    const handleRemoveTranslationLocal = useCallback((lang: SupportedLanguageCode) =>
    {
        // If it was a pending addition, just remove it from additions
        if (pendingAdditions.has(lang))
        {
            setPendingAdditions(prev =>
            {
                const newSet = new Set(prev);
                newSet.delete(lang);
                return newSet;
            });

            // Also remove any pending changes for this language
            setPendingTranslations(prev =>
            {
                const newPending = { ...prev };
                delete newPending[lang];
                return newPending;
            });
        } else
        {
            // Otherwise mark for removal
            setPendingRemovals(prev => new Set([...prev, lang]));
        }

        // If this was the selected language and it's being removed, switch to English
        if (selectedLang === lang)
        {
            setSelectedLang('en');
        }
    }, [pendingAdditions, selectedLang]);

    // Update pending changes for specific language
    const updatePendingLocalization = useCallback((field: keyof CategoryLocalizationDto, value: string) =>
    {
        setPendingTranslations(prev => ({
            ...prev,
            [selectedLang]: {
                ...prev[selectedLang],
                [field]: value
            }
        }));
    }, [selectedLang]);

    // Check if there are any pending changes
    const hasChanges = useMemo(() =>
    {
        // Check for pending field changes
        const hasFieldChanges = Object.keys(pendingTranslations).some(lang =>
            pendingTranslations[lang] && Object.keys(pendingTranslations[lang]).length > 0
        );

        // Check for pending additions or removals
        const hasStructuralChanges = pendingAdditions.size > 0 || pendingRemovals.size > 0;

        return hasFieldChanges || hasStructuralChanges;
    }, [pendingTranslations, pendingAdditions, pendingRemovals]);

    // Save all pending changes
    const handleSaveChanges = useCallback(() =>
    {
        // Apply translation additions
        pendingAdditions.forEach(lang =>
        {
            onAddTranslation(lang);
        });

        // Apply translation removals
        pendingRemovals.forEach(lang =>
        {
            onRemoveTranslation(lang);
        });

        // Apply field changes
        Object.entries(pendingTranslations).forEach(([lang, changes]) =>
        {
            Object.entries(changes).forEach(([field, value]) =>
            {
                if (value !== undefined)
                {
                    onUpdateLocalization(lang as SupportedLanguageCode, field as keyof CategoryLocalizationDto, value || '');
                }
            });
        });

        onClose();
    }, [pendingAdditions, pendingRemovals, pendingTranslations, onAddTranslation, onRemoveTranslation, onUpdateLocalization, onClose]);

    // Cancel changes
    const handleCancel = useCallback(() =>
    {
        setPendingTranslations({});
        setPendingAdditions(new Set());
        setPendingRemovals(new Set());
        onClose();
    }, [onClose]);

    const footer = useMemo(() => (
        <div className="flex gap-3 justify-end">
            <Button
                variant="outline"
                onClick={handleCancel}
                className="border-[#575757] text-[#828288] hover:text-[#EDECF8]"
            >
                <X className="h-4 w-4 mr-2" />
                Cancel
            </Button>
            <Button
                onClick={handleSaveChanges}
                disabled={!hasChanges}
                className={`${hasChanges
                    ? 'bg-[#D78E59] hover:bg-[#FFAA6C]'
                    : 'bg-gray-500 cursor-not-allowed'
                    } text-[#171717]`}
            >
                <Save className="h-4 w-4 mr-2" />
                Save Translations
            </Button>
        </div>
    ), [handleCancel, handleSaveChanges, hasChanges]);

    return (
        <ResponsiveModal
            isOpen={true}
            onClose={handleCancel}
            title="Manage Translations"
            description={`${getCategoryName(category, 'en')} translations`}
            icon={<Languages className="h-5 w-5 text-[#D78E59]" />}
            maxWidth="5xl"
            height="90vh"
            scrollable
            footer={footer}
            useWideLayout={!isMobile}
        >
            {/* Unsaved Changes Warning */}
            {hasChanges && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mb-6">
                    <div className="text-sm text-yellow-400 font-medium">
                        You have unsaved translation changes. Click "Save Translations" to apply them.
                    </div>
                    {(pendingAdditions.size > 0 || pendingRemovals.size > 0) && (
                        <div className="text-xs text-yellow-300 mt-1">
                            {pendingAdditions.size > 0 && `Adding: ${Array.from(pendingAdditions).join(', ')} `}
                            {pendingRemovals.size > 0 && `Removing: ${Array.from(pendingRemovals).join(', ')}`}
                        </div>
                    )}
                </div>
            )}

            <div className="space-y-6">
                {/* Translation Status Overview */}
                <TranslationStatsSection
                    category={category}
                    availableLanguages={availableLanguages}
                    missingTranslations={missingTranslations}
                />

                {/* Missing Translations Notice */}
                <MissingTranslationsNotice
                    missingTranslations={missingTranslations}
                    availableLanguages={availableLanguages}
                    onAddTranslation={onAddTranslation}
                    onLanguageSelect={handleLanguageSelect}
                />

                {/* Main Content Area */}
                <div className={`flex ${isMobile ? 'flex-col space-y-6' : 'space-x-6 h-[500px]'}`}>
                    {/* Language Selection */}
                    {isMobile ? (
                        <MobileLanguageSelector
                            availableLanguages={availableLanguages}
                            selectedLang={selectedLang}
                            category={category}
                            hasTranslation={hasTranslationWithPending}
                            pendingTranslations={pendingTranslations}
                            onLanguageSelect={handleLanguageSelect}
                            onAddTranslation={handleAddTranslationLocal}
                        />
                    ) : (
                        <LanguageSidebar
                            availableLanguages={availableLanguages}
                            selectedLang={selectedLang}
                            category={category}
                            hasTranslation={hasTranslationWithPending}
                            pendingTranslations={pendingTranslations}
                            onLanguageSelect={handleLanguageSelect}
                            onAddTranslation={handleAddTranslationLocal}
                        />
                    )}

                    {/* Translation Form */}
                    <div className={`${isMobile ? 'w-full' : 'flex-1 min-w-0'}`}>
                        {hasCurrentTranslation || selectedLang === 'en' ? (
                            <TranslationForm
                                category={category}
                                selectedLang={selectedLang}
                                currentLocalization={currentLocalization}
                                pendingChanges={pendingTranslations[selectedLang] || {}}
                                onUpdatePendingLocalization={updatePendingLocalization}
                                onRemoveTranslation={handleRemoveTranslationLocal}
                                generateSlugForLanguage={generateSlugForLanguage}
                            />
                        ) : (
                            <div className="text-center py-8 bg-[#090909] rounded-lg border border-[#202020]">
                                <div className="text-[#575757] mb-4">
                                    No translation available for {selectedLang.toUpperCase()}
                                </div>
                                <Button
                                    onClick={() =>
                                    {
                                        handleAddTranslationLocal(selectedLang);
                                        // The form will now appear since hasCurrentTranslation will be true
                                    }}
                                    className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add {selectedLang.toUpperCase()} Translation
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ResponsiveModal>
    );
}