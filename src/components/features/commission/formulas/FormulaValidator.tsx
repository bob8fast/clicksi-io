// components/features/commission/formulas/FormulaValidator.tsx - Real-time Validation Display

'use client';

import { CheckCircle, AlertCircle, Shield, Info } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export interface ValidationResult {
  is_valid: boolean;
  error_message?: string;
  allowed_keywords?: string[];
  security_issues?: string[];
  warnings?: string[];
  suggestions?: string[];
}

interface FormulaValidatorProps {
  validation: ValidationResult;
  className?: string;
  showKeywords?: boolean;
  compact?: boolean;
}

export function FormulaValidator({ 
  validation, 
  className, 
  showKeywords = false,
  compact = false 
}: FormulaValidatorProps) {
  // Get alert variant based on validation result
  const getAlertVariant = () => {
    if (!validation.is_valid) return 'destructive';
    if (validation.warnings && validation.warnings.length > 0) return 'default';
    return 'default';
  };

  // Get status icon
  const getStatusIcon = () => {
    if (validation.is_valid) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    return <AlertCircle className="h-4 w-4 text-red-600" />;
  };

  // Get status color classes
  const getStatusClasses = () => {
    if (validation.is_valid) {
      return {
        border: 'border-green-200',
        bg: 'bg-green-50',
        text: 'text-green-800',
        title: 'text-green-800'
      };
    }
    return {
      border: 'border-red-200',
      bg: 'bg-red-50', 
      text: 'text-red-700',
      title: 'text-red-800'
    };
  };

  const statusClasses = getStatusClasses();

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className || ''}`}>
        {getStatusIcon()}
        <span className={`text-sm ${validation.is_valid ? 'text-green-700' : 'text-red-700'}`}>
          {validation.is_valid ? 'Valid formula' : validation.error_message || 'Invalid formula'}
        </span>
      </div>
    );
  }

  return (
    <Alert variant={getAlertVariant()} className={`${statusClasses.border} ${statusClasses.bg} ${className || ''}`}>
      {getStatusIcon()}
      <div className="flex-1">
        <AlertTitle className={statusClasses.title}>
          {validation.is_valid ? 'Formula Valid' : 'Formula Invalid'}
        </AlertTitle>
        
        <AlertDescription className={statusClasses.text}>
          <div className="space-y-3 mt-2">
            {/* Main Message */}
            {validation.error_message && (
              <p>{validation.error_message}</p>
            )}
            
            {validation.is_valid && !validation.error_message && (
              <p>Your formula passes all security and syntax checks.</p>
            )}

            {/* Security Issues */}
            {validation.security_issues && validation.security_issues.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="font-medium text-sm">Security Issues:</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 ml-6">
                  {validation.security_issues.map((issue, index) => (
                    <li key={index} className="text-sm">{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warnings */}
            {validation.warnings && validation.warnings.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span className="font-medium text-sm">Warnings:</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 ml-6">
                  {validation.warnings.map((warning, index) => (
                    <li key={index} className="text-sm text-amber-700">{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {validation.suggestions && validation.suggestions.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-sm">Suggestions:</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 ml-6">
                  {validation.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm text-blue-700">{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Allowed Keywords */}
            {showKeywords && validation.allowed_keywords && validation.allowed_keywords.length > 0 && (
              <>
                <Separator className="my-2" />
                <div className="space-y-2">
                  <span className="font-medium text-sm">Available Keywords:</span>
                  <div className="flex flex-wrap gap-1">
                    {validation.allowed_keywords.map((keyword, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-xs font-mono"
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </AlertDescription>
      </div>
    </Alert>
  );
}

// Simple inline validator for quick status display
interface InlineValidatorProps {
  isValid?: boolean;
  message?: string;
  className?: string;
}

export function InlineValidator({ isValid, message, className }: InlineValidatorProps) {
  if (isValid === undefined) return null;

  return (
    <div className={`flex items-center gap-1 text-sm ${className || ''}`}>
      {isValid ? (
        <>
          <CheckCircle className="h-3 w-3 text-green-600" />
          <span className="text-green-700">{message || 'Valid'}</span>
        </>
      ) : (
        <>
          <AlertCircle className="h-3 w-3 text-red-600" />
          <span className="text-red-700">{message || 'Invalid'}</span>
        </>
      )}
    </div>
  );
}