// components/categories/DiscardChangesConfirmationDialog.tsx
'use client'

import { Button } from '@/components/ui/button';
import ResponsiveModal from '@/components/ui/responsive-modal';
import { AlertTriangle, X } from 'lucide-react';

interface DiscardChangesConfirmationDialogProps
{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    changeCount: number;
    title?: string;
    description?: string;
}

export default function DiscardChangesConfirmationDialog({
    isOpen,
    onClose,
    onConfirm,
    changeCount,
    title = "Discard Changes",
    description
}: DiscardChangesConfirmationDialogProps)
{
    const defaultDescription = `You have ${changeCount} unsaved ${changeCount === 1 ? 'change' : 'changes'}. Are you sure you want to discard them? This action cannot be undone.`;

    const footer = (
        <div className="flex gap-3 justify-end">
            <Button
                variant="outline"
                onClick={onClose}
                className="border-[#575757] text-[#828288] hover:text-[#EDECF8]"
            >
                <X className="h-4 w-4 mr-2" />
                Cancel
            </Button>
            <Button
                onClick={onConfirm}
                className="bg-red-600 hover:bg-red-700 text-white"
            >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Discard Changes
            </Button>
        </div>
    );

    return (
        <ResponsiveModal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            description={description || defaultDescription}
            icon={<AlertTriangle className="h-5 w-5 text-red-400" />}
            maxWidth="md"
            height="auto"
            scrollable
            footer={footer}
        >
            <div className="space-y-4">
                <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
                    <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-medium text-red-400 mb-1">
                                Warning: This action cannot be undone
                            </h4>
                            <p className="text-sm text-red-300">
                                All your unsaved changes will be permanently lost, including:
                            </p>
                            <ul className="text-sm text-red-300 mt-2 ml-4 space-y-1">
                                <li>• Modified category names and descriptions</li>
                                <li>• Reordered categories</li>
                                <li>• New categories that haven't been saved</li>
                                <li>• Translation changes</li>
                                <li>• Image and icon updates</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="text-sm text-[#828288]">
                    If you want to keep your changes, click "Cancel" and then use the "Save" button
                    to save your changes before continuing.
                </div>
            </div>
        </ResponsiveModal>
    );
}