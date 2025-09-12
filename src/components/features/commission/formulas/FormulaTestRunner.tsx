// components/features/commission/formulas/FormulaTestRunner.tsx - Formula Testing Interface

'use client';

import React, { useState } from 'react';
import { Play, RefreshCw, CheckCircle, AlertCircle, Calculator } from 'lucide-react';

import { useCommissionHooks } from '@/hooks/api/commission-hooks';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export interface TestResult {
  success: boolean;
  result?: number;
  error?: string;
  test_data?: Record<string, any>;
  execution_time?: number;
  formula_used?: string;
}

interface FormulaTestRunnerProps {
  expression: string;
  disabled?: boolean;
  className?: string;
  predefinedTestData?: Record<string, number>;
}

export function FormulaTestRunner({
  expression,
  disabled = false,
  className,
  predefinedTestData
}: FormulaTestRunnerProps) {
  const [testData, setTestData] = useState<Record<string, number>>({});
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  // Commission hooks for testing
  const commissionHooks = useCommissionHooks();
  const testFormulaMutation = commissionHooks.testFormula();

  // Initialize predefined test data
  React.useEffect(() => {
    if (predefinedTestData) {
      setTestData(predefinedTestData);
    } else {
      // Default test data for common formula variables
      const defaultData: Record<string, number> = {
        sale_amount: 150.00,
        order_value: 180.00,
        product_price: 50.00,
        quantity: 3,
        creator_tier: 2,
        partnership_rate: 0.06,
        min_order_value: 25.00,
        max_order_value: 500.00
      };
      setTestData(defaultData);
    }
  }, [predefinedTestData]);

  // Generate default test values based on variable name
  const getDefaultTestValue = (variableName: string): number => {
    const name = variableName.toLowerCase();
    
    if (name.includes('amount') || name.includes('price') || name.includes('value')) {
      return 100.00;
    }
    if (name.includes('quantity')) {
      return 2;
    }
    if (name.includes('rate') || name.includes('percent')) {
      return 0.05; // 5%
    }
    if (name.includes('tier')) {
      return 1;
    }
    if (name.includes('bonus')) {
      return 10.00;
    }
    if (name.includes('min') || name.includes('max')) {
      return 50.00;
    }
    
    return 1; // Default value
  };

  // Handle test data changes
  const handleTestDataChange = (variable: string, value: string) => {
    const numericValue = parseFloat(value) || 0;
    setTestData(prev => ({
      ...prev,
      [variable]: numericValue
    }));
  };

  // Note: onTest function now provided through commission hooks from parent component

  // Run the formula test
  const runTest = async () => {
    if (!expression.trim() || disabled) return;

    setIsRunning(true);
    setTestResult(null);

    try {
      const apiResult = await testFormulaMutation.mutateAsync({ 
        expression, 
        variables: testData 
      });
      
      // Transform FormulaTestResponse to TestResult
      const result: TestResult = {
        success: apiResult.is_success,
        result: apiResult.result,
        error: apiResult.error_message,
        test_data: apiResult.variables,
        formula_used: apiResult.expression
      };
      
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        error: 'Test execution failed. Please try again.',
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Generate alternative test data based on current keys
  const generateAlternativeTestData = () => {
    const alternativeData: Record<string, number> = {};
    Object.keys(testData).forEach(variable => {
      const baseValue = getDefaultTestValue(variable);
      // Use predictable alternative values (double the base value)
      alternativeData[variable] = Math.round(baseValue * 2 * 100) / 100;
    });
    setTestData(alternativeData);
  };

  // Clear test result
  const clearResult = () => {
    setTestResult(null);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          Formula Test Runner
        </CardTitle>
        <CardDescription>
          Test your formula with sample data to verify calculations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Test Data Inputs */}
        {Object.keys(testData).length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Test Variables</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={generateAlternativeTestData}
                disabled={disabled}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Alternative Data
              </Button>
            </div>
            
            <div className="grid gap-3 md:grid-cols-2">
              {Object.keys(testData).map((variable) => (
                <div key={variable} className="space-y-1">
                  <Label htmlFor={`test-${variable}`} className="text-xs font-mono">
                    {variable}
                  </Label>
                  <Input
                    id={`test-${variable}`}
                    type="number"
                    step="0.01"
                    value={testData[variable] || ''}
                    onChange={(e) => handleTestDataChange(variable, e.target.value)}
                    placeholder="0.00"
                    className="font-mono text-sm"
                    disabled={disabled}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Formula Expression Display */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Formula Expression</Label>
          <div className="bg-muted/30 rounded-lg p-3 border">
            <code className="text-sm font-mono">
              {expression || 'No formula entered'}
            </code>
          </div>
        </div>

        {/* Test Controls */}
        <div className="flex items-center gap-2">
          <Button
            onClick={runTest}
            disabled={disabled || !expression.trim() || Object.keys(testData).length === 0 || isRunning}
            className="flex-1"
          >
            {isRunning ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Running Test...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run Test
              </>
            )}
          </Button>
          
          {testResult && (
            <Button
              variant="outline"
              size="icon"
              onClick={clearResult}
              disabled={disabled}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Test Results */}
        {testResult && (
          <>
            <Separator />
            <div className="space-y-3">
              <Label className="text-sm font-medium">Test Result</Label>
              
              {testResult.success ? (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Test Successful</AlertTitle>
                  <AlertDescription className="text-green-700">
                    <div className="space-y-2 mt-2">
                      <div className="text-lg font-semibold">
                        Result: ${testResult.result?.toFixed(2) || '0.00'}
                      </div>
                      
                      {testResult.execution_time && (
                        <div className="text-sm">
                          Execution time: {testResult.execution_time}ms
                        </div>
                      )}
                      
                      {testResult.test_data && Object.keys(testResult.test_data).length > 0 && (
                        <div className="space-y-1">
                          <span className="text-sm font-medium">Test Data Used:</span>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(testResult.test_data).map(([key, value]) => (
                              <Badge key={key} variant="outline" className="text-xs">
                                {key}: {typeof value === 'number' ? value.toFixed(2) : value}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Test Failed</AlertTitle>
                  <AlertDescription>
                    <div className="space-y-2 mt-2">
                      <p>{testResult.error || 'Unknown error occurred during test execution.'}</p>
                      
                      {testResult.formula_used && (
                        <div className="text-sm">
                          <span className="font-medium">Formula tested:</span>
                          <code className="ml-1 bg-background px-1 rounded text-xs">
                            {testResult.formula_used}
                          </code>
                        </div>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </>
        )}

        {/* Help Text */}
        {Object.keys(testData).length === 0 && (
          <Alert>
            <Calculator className="h-4 w-4" />
            <AlertDescription>
              Test data will be automatically loaded based on common formula variables (sale_amount, order_value, etc.). Enter a formula expression above to begin testing.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

// Loading skeleton for test runner
export function FormulaTestRunnerSkeleton({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}