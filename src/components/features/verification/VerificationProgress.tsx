// components/verification/VerificationProgress.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { VerificationApplicationDto } from '@/types';
import { CheckCircle, Clock, FileText } from 'lucide-react';

interface VerificationProgressProps
{
    verification: VerificationApplicationDto;
    totalRequiredDocs: number;
    totalOptionalDocs: number;
    className?: string;
}

export function VerificationProgress({ verification, totalRequiredDocs, totalOptionalDocs, className = '' }: VerificationProgressProps)
{
    const verificationDocuments = verification.documents || [];
    const requiredDocsUploaded = verificationDocuments.filter(doc => doc.is_required).length;
    const optionalDocsUploaded = verificationDocuments.filter(doc => !doc.is_required).length;

    const progress = totalRequiredDocs > 0 ? Math.round((requiredDocsUploaded / totalRequiredDocs) * 100) : 100;
    const isComplete = totalRequiredDocs <= requiredDocsUploaded;

    return (
        <Card className={`bg-[#090909] border-[#202020] ${className}`}>
            <CardHeader className="pb-3">
                <CardTitle className="text-[#EDECF8] text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Document Progress
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Required Documents Progress */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[#828288] text-sm">Required Documents</span>
                        <span className="text-[#EDECF8] text-sm font-medium">
                            {verificationDocuments.filter(doc => doc.is_required).length}/{totalRequiredDocs}
                        </span>
                    </div>
                    <Progress
                        value={progress}
                        className="h-2 bg-[#202020]"
                    />
                    <div className="flex items-center gap-1 mt-1">
                        {isComplete ? (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : (
                            <Clock className="w-3 h-3 text-[#FFAA6C]" />
                        )}
                        <span className="text-xs text-[#575757]">
                            {isComplete ? 'All required documents uploaded' : `${totalRequiredDocs - requiredDocsUploaded} documents remaining`}
                        </span>
                    </div>
                </div>

                {/* Optional Documents */}
                {totalOptionalDocs > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[#828288] text-sm">Optional Documents</span>
                            <span className="text-[#EDECF8] text-sm font-medium">
                                {optionalDocsUploaded}/{totalOptionalDocs}
                            </span>
                        </div>
                        <div className="text-xs text-[#575757]">
                            {optionalDocsUploaded > 0
                                ? `${optionalDocsUploaded} optional documents uploaded`
                                : 'No optional documents uploaded'
                            }
                        </div>
                    </div>
                )}

                {/* Total Documents */}
                <div className="pt-2 border-t border-[#575757]">
                    <div className="flex items-center justify-between">
                        <span className="text-[#828288] text-sm">Total Documents</span>
                        <span className="text-[#EDECF8] font-medium">
                            {verificationDocuments.length}
                        </span>
                    </div>
                </div>

                {/* Status Information */}
                <div className="pt-2 border-t border-[#575757]">
                    <div className="flex items-center justify-between">
                        <span className="text-[#828288] text-sm">Status</span>
                        <span className="text-[#EDECF8] font-medium">
                            {verification.status}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}