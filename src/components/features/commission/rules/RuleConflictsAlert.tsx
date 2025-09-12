// components/features/commission/rules/RuleConflictsAlert.tsx - Conflict Detection and Alerts

'use client';

import { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, Info, AlertCircle, Zap } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Skeleton } from '@/components/ui/skeleton';

import { CommissionStateBadge } from '../shared/CommissionStateBadge';
import type { RuleConflictsResult, RuleConflict } from '@/types/app/commission';

interface RuleConflictsAlertProps {
  teamId: string;
  conflicts?: RuleConflictsResult;
  isLoading?: boolean;
  className?: string;
}

export function RuleConflictsAlert({ 
  teamId, 
  conflicts, 
  isLoading, 
  className 
}: RuleConflictsAlertProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Don't render if loading or no team ID
  if (isLoading || !teamId) {
    return (
      <div className={className}>
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  // Don't render if no conflicts data or no conflicts
  if (!conflicts || !conflicts.has_conflicts) {
    return (
      <Alert className={`border-green-200 bg-green-50 ${className || ''}`}>
        <Info className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">No Rule Conflicts</AlertTitle>
        <AlertDescription className="text-green-700">
          All commission rules are compatible and have no conflicts.
        </AlertDescription>
      </Alert>
    );
  }

  // Get severity styling
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'medium':
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      case 'low':
        return <Info className="h-4 w-4 text-blue-600" />;
      default:
        return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAlertStyling = () => {
    const hasHighSeverity = conflicts.conflicts.some(c => c.severity === 'high');
    const hasMediumSeverity = conflicts.conflicts.some(c => c.severity === 'medium');
    
    if (hasHighSeverity) {
      return 'border-red-200 bg-red-50';
    } else if (hasMediumSeverity) {
      return 'border-amber-200 bg-amber-50';
    } else {
      return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <Alert className={`${getAlertStyling()} ${className || ''}`}>
      <AlertTriangle className="h-4 w-4" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <AlertTitle className="flex items-center gap-2">
            Commission Rule Conflicts Detected
            <Badge variant="destructive" className="text-xs">
              {conflicts.conflict_count} conflict{conflicts.conflict_count !== 1 ? 's' : ''}
            </Badge>
          </AlertTitle>
          
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-4">
              <div className="space-y-4">
                {/* Conflicts List */}
                <div className="space-y-3">
                  {conflicts.conflicts.map((conflict, index) => (
                    <ConflictItem key={index} conflict={conflict} />
                  ))}
                </div>

                {/* Recommendations */}
                {conflicts.recommendations.length > 0 && (
                  <div className="pt-3 border-t">
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Recommendations
                    </h4>
                    <ul className="space-y-1">
                      {conflicts.recommendations.map((recommendation, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-xs mt-1">•</span>
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <AlertDescription className="mt-1">
          {conflicts.conflict_count === 1 
            ? 'One rule conflict needs attention before activation.'
            : `${conflicts.conflict_count} rule conflicts need attention before activation.`
          }
          {!isExpanded && ' Click to view details.'}
        </AlertDescription>
      </div>
    </Alert>
  );
}

// Individual Conflict Item Component
function ConflictItem({ conflict }: { conflict: RuleConflict }) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'medium':
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      case 'low':
        return <Info className="h-4 w-4 text-blue-600" />;
      default:
        return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white/50 rounded-lg p-3 border border-white/20">
      <div className="flex items-start gap-3">
        {getSeverityIcon(conflict.severity)}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h5 className="font-medium text-sm">{conflict.description}</h5>
            <Badge
              variant="outline"
              className={`text-xs ${getSeverityColor(conflict.severity)}`}
            >
              {conflict.severity.toUpperCase()}
            </Badge>
          </div>

          {/* Conflicting Rules */}
          <div className="mb-2">
            <span className="text-xs font-medium text-muted-foreground">Affected Rules:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {conflict.conflicting_rules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center gap-1 bg-white rounded px-2 py-1 border text-xs"
                >
                  <span className="font-medium">{rule.name}</span>
                  <CommissionStateBadge state={rule.state} className="text-xs" />
                </div>
              ))}
            </div>
          </div>

          {/* Resolution Suggestions */}
          {conflict.resolution_suggestions.length > 0 && (
            <div>
              <span className="text-xs font-medium text-muted-foreground">Suggested Solutions:</span>
              <ul className="mt-1 space-y-0.5">
                {conflict.resolution_suggestions.map((suggestion, index) => (
                  <li key={index} className="text-xs text-muted-foreground flex items-start gap-1">
                    <span className="mt-0.5">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}