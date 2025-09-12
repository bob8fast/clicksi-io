// components/features/commission/shared/CommissionScopeSelector.tsx - Scope Selection with Validation

'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, Info, CheckCircle, Target } from 'lucide-react';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { CommissionRuleScope } from '@/types/app/commission';

interface ScopeValidation {
  isValid: boolean;
  message?: string;
  requirements?: string[];
  availableOptions?: string[];
}

interface CommissionScopeSelectorProps {
  value?: CommissionRuleScope;
  onValueChange: (scope: CommissionRuleScope) => void;
  teamId?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  showValidation?: boolean;
  showDescription?: boolean;
}

// Mock validation function - in real implementation, this would call API
const validateScope = async (scope: CommissionRuleScope, teamId: string): Promise<ScopeValidation> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  switch (scope) {
    case CommissionRuleScope.ExclusiveCampaignCommission:
      // Check if team has active campaigns
      const hasActiveCampaigns = Math.random() > 0.3; // Mock check
      return {
        isValid: hasActiveCampaigns,
        message: hasActiveCampaigns 
          ? 'Team has active campaigns available' 
          : 'No active campaigns found for your team',
        requirements: hasActiveCampaigns ? [] : [
          'Create an active campaign',
          'Ensure campaign is approved and running'
        ]
      };

    case CommissionRuleScope.PartnershipDefinedCommission:
      // Check if team has active partnerships
      const hasActivePartnerships = Math.random() > 0.4; // Mock check
      return {
        isValid: hasActivePartnerships,
        message: hasActivePartnerships 
          ? 'Team has active partnerships available' 
          : 'No active partnerships found for your team',
        requirements: hasActivePartnerships ? [] : [
          'Establish partnerships with other brands/retailers',
          'Ensure partnerships are active and approved'
        ]
      };

    case CommissionRuleScope.GeneralBusinessSpecificCommission:
      // This scope is always available
      return {
        isValid: true,
        message: 'General business rules are always available'
      };

    default:
      return {
        isValid: false,
        message: 'Invalid scope selected'
      };
  }
};

export function CommissionScopeSelector({
  value,
  onValueChange,
  teamId,
  disabled = false,
  required = false,
  className,
  showValidation = true,
  showDescription = true
}: CommissionScopeSelectorProps) {
  const [validation, setValidation] = useState<ScopeValidation | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Validate scope when it changes
  useEffect(() => {
    if (value && teamId && showValidation) {
      setIsValidating(true);
      validateScope(value, teamId).then(result => {
        setValidation(result);
        setIsValidating(false);
      }).catch(() => {
        setValidation({
          isValid: false,
          message: 'Validation failed. Please try again.'
        });
        setIsValidating(false);
      });
    }
  }, [value, teamId, showValidation]);

  // Handle scope change
  const handleScopeChange = (scope: string) => {
    const scopeValue = scope as CommissionRuleScope;
    onValueChange(scopeValue);
  };

  // Get scope information
  const getScopeInfo = (scope: CommissionRuleScope) => {
    switch (scope) {
      case CommissionRuleScope.ExclusiveCampaignCommission:
        return {
          title: 'Exclusive Campaign Commission',
          description: 'Commission rules that apply only to specific marketing campaigns. Higher rates for exclusive campaign participation.',
          badge: { text: 'Campaign', variant: 'default' as const },
          requirements: ['Active campaigns required']
        };
      case CommissionRuleScope.PartnershipDefinedCommission:
        return {
          title: 'Partnership Defined Commission',
          description: 'Commission rules based on specific partnership agreements between brands and retailers.',
          badge: { text: 'Partnership', variant: 'secondary' as const },
          requirements: ['Active partnerships required']
        };
      case CommissionRuleScope.GeneralBusinessSpecificCommission:
        return {
          title: 'General Business Commission',
          description: 'Standard commission rules that apply to regular business operations without special conditions.',
          badge: { text: 'General', variant: 'outline' as const },
          requirements: ['Always available']
        };
      default:
        return {
          title: 'Unknown Scope',
          description: 'Please select a valid commission scope.',
          badge: { text: 'Unknown', variant: 'destructive' as const },
          requirements: []
        };
    }
  };

  const getValidationIcon = () => {
    if (isValidating) {
      return <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />;
    }
    if (validation?.isValid) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    if (validation && !validation.isValid) {
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
    return null;
  };

  return (
    <div className={`space-y-3 ${className || ''}`}>
      {/* Scope Selector */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label>Commission Rule Scope {required && '*'}</Label>
          {showValidation && getValidationIcon()}
        </div>
        
        <Select
          value={value || ''}
          onValueChange={handleScopeChange}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select commission scope..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={CommissionRuleScope.GeneralBusinessSpecificCommission}>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                General Business Commission
              </div>
            </SelectItem>
            <SelectItem value={CommissionRuleScope.ExclusiveCampaignCommission}>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Exclusive Campaign Commission
              </div>
            </SelectItem>
            <SelectItem value={CommissionRuleScope.PartnershipDefinedCommission}>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Partnership Defined Commission
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Scope Description */}
      {value && showDescription && (
        <Card>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-sm">{getScopeInfo(value).title}</h4>
                <Badge variant={getScopeInfo(value).badge.variant}>
                  {getScopeInfo(value).badge.text}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {getScopeInfo(value).description}
              </p>
              
              <div className="space-y-1">
                <span className="text-xs font-medium">Requirements:</span>
                <ul className="text-xs text-muted-foreground space-y-0.5">
                  {getScopeInfo(value).requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <span className="mt-1">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Results */}
      {showValidation && validation && !isValidating && (
        <Alert 
          variant={validation.isValid ? 'default' : 'destructive'}
          className={validation.isValid ? 'border-green-200 bg-green-50' : ''}
        >
          {validation.isValid ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle className={validation.isValid ? 'text-green-800' : ''}>
            {validation.isValid ? 'Scope Available' : 'Scope Not Available'}
          </AlertTitle>
          <AlertDescription className={validation.isValid ? 'text-green-700' : ''}>
            <div className="space-y-2">
              <p>{validation.message}</p>
              
              {validation.requirements && validation.requirements.length > 0 && (
                <div className="space-y-1">
                  <span className="font-medium text-sm">Requirements:</span>
                  <ul className="list-disc list-inside space-y-0.5">
                    {validation.requirements.map((requirement, index) => (
                      <li key={index} className="text-sm">{requirement}</li>
                    ))}
                  </ul>
                </div>
              )}

              {validation.availableOptions && validation.availableOptions.length > 0 && (
                <div className="space-y-1">
                  <span className="font-medium text-sm">Available options:</span>
                  <div className="flex flex-wrap gap-1">
                    {validation.availableOptions.map((option, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {option}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isValidating && (
        <Card>
          <CardContent className="pt-4 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </CardContent>
        </Card>
      )}
    </div>
  );
}