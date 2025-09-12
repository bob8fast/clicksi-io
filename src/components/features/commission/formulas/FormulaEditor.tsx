// components/features/commission/formulas/FormulaEditor.tsx - Formula Creation/Editing Component

'use client';

import { useState, useCallback } from 'react';
import { Play, CheckCircle, AlertCircle, HelpCircle, Calculator } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

import { FormulaValidator } from './FormulaValidator';
import { FormulaTestRunner } from './FormulaTestRunner';
import { FormulaKeywordsHelper } from './FormulaKeywordsHelper';
import { CommissionRuleScope } from '@/types/app/commission';
import { useCommissionHooks } from '@/hooks/api/commission-hooks';

export interface FormulaData {
  expression: string;
  description: string;
}

export interface ValidationResult {
  is_valid: boolean;
  error_message?: string;
  allowed_keywords?: string[];
  security_issues?: string[];
}

export interface TestResult {
  success: boolean;
  result?: number;
  error?: string;
  test_data?: Record<string, any>;
}

interface FormulaEditorProps {
  formula: FormulaData;
  onFormulaChange: (formula: Partial<FormulaData>) => void;
  scope?: CommissionRuleScope;
  className?: string;
  disabled?: boolean;
  showTestRunner?: boolean;
  showKeywordsHelper?: boolean;
  enableDragDrop?: boolean;
}

export function FormulaEditor({
  formula,
  onFormulaChange,
  scope,
  className,
  disabled = false,
  showTestRunner = true,
  showKeywordsHelper = true,
  enableDragDrop = true
}: FormulaEditorProps) {
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [showHelper, setShowHelper] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<number>(0);

  // Commission hooks for API integration
  const commissionHooks = useCommissionHooks();
  const validateFormulaMutation = commissionHooks.validateFormula();
  const testFormulaMutation = commissionHooks.testFormula();

  // Suggested formulas based on scope
  const getSuggestedFormulas = useCallback((scope?: CommissionRuleScope) => {
    if (!scope) return [];
    
    switch (scope) {
      case CommissionRuleScope.ExclusiveCampaignCommission:
        return [
          { expression: 'sale_amount * 0.08', description: '8% campaign commission' },
          { expression: 'max(sale_amount * 0.06, 10)', description: '6% with minimum $10' },
        ];
      case CommissionRuleScope.PartnershipDefinedCommission:
        return [
          { expression: 'sale_amount * partnership_rate', description: 'Partnership-defined rate' },
          { expression: 'sale_amount * 0.04 + partnership_bonus', description: '4% plus partnership bonus' },
        ];
      default:
        return [
          { expression: 'sale_amount * 0.05', description: '5% standard commission' },
          { expression: 'min(sale_amount * 0.07, 50)', description: '7% with maximum $50' },
        ];
    }
  }, []);

  const suggestedFormulas = getSuggestedFormulas(scope);

  // Handle expression change with debounced validation
  const handleExpressionChange = useCallback(
    async (expression: string) => {
      onFormulaChange({ expression });

      // Auto-validate on blur using commission hooks
      if (expression.trim()) {
        setIsValidating(true);
        try {
          const result = await validateFormulaMutation.mutateAsync({ 
            expression
          });
          setValidation(result);
        } catch (error) {
          setValidation({
            is_valid: false,
            error_message: 'Validation failed. Please try again.',
          });
        } finally {
          setIsValidating(false);
        }
      }
    },
    [onFormulaChange, validateFormulaMutation]
  );

  // Manual validation trigger
  const handleManualValidation = async () => {
    if (!formula.expression.trim()) return;

    setIsValidating(true);
    try {
      const result = await validateFormulaMutation.mutateAsync({ 
        expression: formula.expression
      });
      setValidation(result);
    } catch (error) {
      setValidation({
        is_valid: false,
        error_message: 'Validation failed. Please try again.',
      });
    } finally {
      setIsValidating(false);
    }
  };

  // Handle keyword insertion (drag-drop or click)
  const insertKeywordAtCursor = useCallback((keyword: string) => {
    const expression = formula.expression;
    const before = expression.substring(0, cursorPosition);
    const after = expression.substring(cursorPosition);
    const newExpression = before + keyword + after;
    
    onFormulaChange({ expression: newExpression });
    
    // Update cursor position to end of inserted keyword
    setCursorPosition(cursorPosition + keyword.length);
  }, [formula.expression, cursorPosition, onFormulaChange]);

  // Handle suggested formula application
  const applySuggestedFormula = useCallback((suggestion: { expression: string; description: string }) => {
    onFormulaChange({
      expression: suggestion.expression,
      description: suggestion.description
    });
  }, [onFormulaChange]);

  // Get validation status icon
  const getValidationIcon = () => {
    if (isValidating) {
      return <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />;
    }
    if (validation?.is_valid) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    if (validation && !validation.is_valid) {
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
    return null;
  };

  return (
    <div className={`space-y-6 ${className || ''}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Formula Editor
            {showKeywordsHelper && (
              <Popover open={showHelper} onOpenChange={setShowHelper}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="ml-auto">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96" align="end">
                  <FormulaKeywordsHelper 
                    onKeywordSelect={enableDragDrop ? insertKeywordAtCursor : undefined}
                  />
                </PopoverContent>
              </Popover>
            )}
          </CardTitle>
          <CardDescription>
            Create mathematical expressions for commission calculations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Suggested Formulas */}
          {suggestedFormulas.length > 0 && (
            <div className="space-y-2">
              <Label>Suggested Formulas</Label>
              <div className="grid gap-2 md:grid-cols-2">
                {suggestedFormulas.map((suggestion, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="outline"
                    className="h-auto p-3 text-left justify-start"
                    onClick={() => applySuggestedFormula(suggestion)}
                    disabled={disabled}
                  >
                    <div className="space-y-1">
                      <code className="text-xs font-mono">{suggestion.expression}</code>
                      <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                    </div>
                  </Button>
                ))}
              </div>
              <Separator />
            </div>
          )}

          {/* Formula Expression */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="formula-expression">Expression *</Label>
              {getValidationIcon()}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleManualValidation}
                disabled={disabled || isValidating || !formula.expression.trim()}
                className="ml-auto text-xs"
              >
                Validate
              </Button>
            </div>
            
            <div className="relative">
              <Input
                id="formula-expression"
                value={formula.expression}
                onChange={(e) => {
                  handleExpressionChange(e.target.value);
                  setCursorPosition(e.target.selectionStart || 0);
                }}
                onBlur={() => handleExpressionChange(formula.expression)}
                onSelect={(e) => setCursorPosition(e.currentTarget.selectionStart || 0)}
                placeholder="e.g., sale_amount * 0.05"
                className="font-mono text-sm"
                disabled={disabled}
                title="Click the help icon to see available keywords and drag them here"
              />
            </div>

            {/* Validation Feedback */}
            {validation && (
              <FormulaValidator 
                validation={validation}
                className="mt-2"
              />
            )}
          </div>

          <Separator />

          {/* Formula Description */}
          <div className="space-y-2">
            <Label htmlFor="formula-description">Description *</Label>
            <Input
              id="formula-description"
              value={formula.description}
              onChange={(e) => onFormulaChange({ description: e.target.value })}
              placeholder="e.g., 5% commission on sale amount"
              disabled={disabled}
            />
          </div>

          {/* Variables section removed - not part of API schema */}

          {/* Security Information */}
          {validation?.security_issues && validation.security_issues.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">Security Issues:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {validation.security_issues.map((issue, index) => (
                      <li key={index} className="text-sm">{issue}</li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Formula Test Runner */}
      {showTestRunner && (
        <FormulaTestRunner
          expression={formula.expression}
          disabled={disabled || !validation?.is_valid}
        />
      )}

      {/* Formula Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Common Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                sale_amount * 0.05
              </code>
              <p className="text-xs text-muted-foreground">5% commission</p>
            </div>
            
            <div className="space-y-1">
              <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                max(sale_amount * 0.03, 5)
              </code>
              <p className="text-xs text-muted-foreground">3% with $5 minimum</p>
            </div>
            
            <div className="space-y-1">
              <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                min(sale_amount * 0.08, 100)
              </code>
              <p className="text-xs text-muted-foreground">8% with $100 cap</p>
            </div>
            
            <div className="space-y-1">
              <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                sale_amount * (tier_rate / 100)
              </code>
              <p className="text-xs text-muted-foreground">Variable tier rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}