// components/verification/DocumentViewer.tsx
'use client'

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { VerificationDocumentDto } from '@/types';
import { Download, FileText, Image as ImageIcon, Loader2, RotateCcw, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useDocumentDownload, useDocumentPreview } from './hooks';

interface DocumentViewerProps
{
    verificationDocument: VerificationDocumentDto | null;
    isOpen: boolean;
    onClose: () => void;
    onDownload?: (document: VerificationDocumentDto) => Promise<void>;
}

export function DocumentViewer({ verificationDocument, isOpen, onClose, onDownload }: DocumentViewerProps)
{
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [isLoadingPreview, setIsLoadingPreview] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Use shared download and preview hooks
    const { downloadDocument, isDownloading } = useDocumentDownload({
        successMessage: 'Document downloaded successfully',
        errorMessage: 'Failed to download document'
    });
    const { createDocumentBlobUrl } = useDocumentPreview();

    const resetView = () =>
    {
        setZoom(1);
        setRotation(0);
    };

    // Load document for preview when dialog opens
    useEffect(() =>
    {
        if (verificationDocument && isOpen && !previewUrl)
        {
            loadDocumentForPreview();
        }
        return () =>
        {
            // Cleanup blob URL when component unmounts or document changes
            if (previewUrl)
            {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
            }
        };
    }, [verificationDocument, isOpen]);

    const loadDocumentForPreview = useCallback(async () =>
    {
        if (!verificationDocument) return;

        setIsLoadingPreview(true);
        try
        {
            const url = await createDocumentBlobUrl(verificationDocument);
            setPreviewUrl(url);
        } catch (error)
        {
            console.error('Failed to load document for preview:', error);
            toast.error('Failed to load document preview');
        } finally
        {
            setIsLoadingPreview(false);
        }
    }, [verificationDocument, createDocumentBlobUrl]);

    const handleDownload = useCallback(async () =>
    {
        if (!verificationDocument) return;

        try
        {
            if (onDownload)
            {
                await onDownload(verificationDocument);
            } else
            {
                // Use shared download hook
                await downloadDocument(verificationDocument);
            }
        } catch (error)
        {
            // Error handling is already done in the hook
            console.error('Download failed:', error);
        }
    }, [verificationDocument, onDownload, downloadDocument]);

    // Reset view when document changes
    // useEffect(() =>
    // {
    //     if (document)
    //     {
    //         resetView();
    //     }
    // }, [document]);

    if (!verificationDocument) return null;

    const isImage = verificationDocument.mime_type?.startsWith('image/');
    const isPDF = verificationDocument.mime_type === 'application/pdf';

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#171717] border-[#575757] max-w-6xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="text-[#EDECF8] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {isImage ? (
                                <ImageIcon className="w-5 h-5 text-[#D78E59]" />
                            ) : (
                                <FileText className="w-5 h-5 text-[#D78E59]" />
                            )}
                            <span>{verificationDocument.file_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {isImage && (
                                <>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setZoom(prev => Math.max(0.25, prev - 0.25))}
                                        className="border-[#575757] text-[#828288] hover:text-[#EDECF8]"
                                    >
                                        <ZoomOut className="w-4 h-4" />
                                    </Button>
                                    <span className="text-[#828288] text-sm min-w-[60px] text-center">
                                        {Math.round(zoom * 100)}%
                                    </span>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setZoom(prev => Math.min(4, prev + 0.25))}
                                        className="border-[#575757] text-[#828288] hover:text-[#EDECF8]"
                                    >
                                        <ZoomIn className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setRotation(prev => (prev - 90) % 360)}
                                        className="border-[#575757] text-[#828288] hover:text-[#EDECF8]"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setRotation(prev => (prev + 90) % 360)}
                                        className="border-[#575757] text-[#828288] hover:text-[#EDECF8]"
                                    >
                                        <RotateCw className="w-4 h-4" />
                                    </Button>
                                </>
                            )}
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleDownload}
                                disabled={isDownloading}
                                className="border-[#575757] text-[#828288] hover:text-[#EDECF8]"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                {isDownloading ? 'Downloading...' : 'Download'}
                            </Button>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-auto bg-[#202020] rounded-lg max-h-[70vh]">
                    {isLoadingPreview ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-[#D78E59] mb-4" />
                            <p className="text-[#828288]">Loading document preview...</p>
                        </div>
                    ) : previewUrl && isImage ? (
                        <div className="flex justify-center items-center min-h-full p-4">
                            <div
                                style={{
                                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                                    transformOrigin: 'center center',
                                    transition: 'transform 0.2s ease',
                                }}
                                className="relative"
                            >
                                <div className="bg-white p-2 rounded shadow-lg">
                                    <Image
                                        src={previewUrl}
                                        alt={verificationDocument.file_name || 'Document'}
                                        width={800}
                                        height={600}
                                        className="max-w-full h-auto"
                                        style={{
                                            maxHeight: '60vh',
                                            objectFit: 'contain',
                                        }}
                                        onError={() =>
                                        {
                                            toast.error('Failed to load image');
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : previewUrl && isPDF ? (
                        <div className="w-full h-full min-h-[70vh]">
                            <iframe
                                src={`${previewUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                                className="w-full h-full min-h-[70vh] border-0 rounded"
                                title={verificationDocument.file_name || 'Document'}
                                onError={() =>
                                {
                                    toast.error('Failed to load PDF');
                                }}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <FileText className="w-16 h-16 text-[#575757] mb-4" />
                            <h3 className="text-lg font-semibold text-[#EDECF8] mb-2">
                                Preview not available
                            </h3>
                            <p className="text-[#828288] mb-4">
                                This file type cannot be previewed in the browser.
                            </p>
                            <div className="text-sm text-[#575757] mb-6">
                                <p>File: {verificationDocument.file_name}</p>
                                <p>Type: {verificationDocument.mime_type}</p>
                                <p>Size: {Math.round((verificationDocument.file_size || 0) / 1024)} KB</p>
                            </div>
                            <Button
                                onClick={handleDownload}
                                disabled={isDownloading}
                                className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                {isDownloading ? 'Downloading...' : 'Download to View'}
                            </Button>
                        </div>
                    )}
                </div>

                {/* Quick info bar */}
                <div className="bg-[#090909] p-3 rounded-lg border border-[#202020] text-sm">
                    <div className="flex items-center justify-between text-[#575757]">
                        <span>
                            {verificationDocument.file_name} • {Math.round((verificationDocument.file_size || 0) / 1024)} KB
                        </span>
                        <span>
                            {verificationDocument.mime_type}
                        </span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}