// components/features/commission/shared/CommissionMetrics.tsx - Metrics Display Component

'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, Calendar, BarChart3, RefreshCw } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

export interface CommissionMetric {
  label: string;
  value: number | string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  format?: 'currency' | 'percentage' | 'number';
  icon?: React.ReactNode;
}

export interface CommissionMetricsData {
  totalCommissions: number;
  activeRules: number;
  avgCommissionRate: number;
  monthlyChange: number;
  topPerformingRule?: {
    name: string;
    amount: number;
  };
  metrics: CommissionMetric[];
  lastUpdated: string;
}

interface CommissionMetricsProps {
  data?: CommissionMetricsData;
  isLoading?: boolean;
  onRefresh?: () => void;
  className?: string;
  compact?: boolean;
}

// Mock data for development
const generateMockData = (): CommissionMetricsData => ({
  totalCommissions: 15420.50,
  activeRules: 12,
  avgCommissionRate: 6.8,
  monthlyChange: 12.5,
  topPerformingRule: {
    name: 'Premium Product Commission',
    amount: 3250.00
  },
  metrics: [
    {
      label: 'Total Commissions',
      value: 15420.50,
      change: 12.5,
      changeType: 'increase',
      format: 'currency',
      icon: <DollarSign className="h-4 w-4" />
    },
    {
      label: 'Active Rules',
      value: 12,
      change: 2,
      changeType: 'increase',
      format: 'number',
      icon: <Target className="h-4 w-4" />
    },
    {
      label: 'Avg Commission Rate',
      value: 6.8,
      change: -0.5,
      changeType: 'decrease',
      format: 'percentage',
      icon: <BarChart3 className="h-4 w-4" />
    },
    {
      label: 'This Month',
      value: 4280.75,
      change: 18.2,
      changeType: 'increase',
      format: 'currency',
      icon: <Calendar className="h-4 w-4" />
    },
  ],
  lastUpdated: new Date().toISOString()
});

export function CommissionMetrics({
  data,
  isLoading = false,
  onRefresh,
  className,
  compact = false
}: CommissionMetricsProps) {
  const [refreshing, setRefreshing] = useState(false);
  
  // Use mock data if no data provided
  const metricsData = data || generateMockData();

  const handleRefresh = async () => {
    if (!onRefresh) return;
    
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  const formatValue = (value: number | string, format?: string) => {
    if (typeof value === 'string') return value;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'number':
        return value.toLocaleString();
      default:
        return value.toString();
    }
  };

  const getChangeIcon = (changeType?: string) => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'decrease':
        return <TrendingDown className="h-3 w-3 text-red-600" />;
      default:
        return null;
    }
  };

  const getChangeColor = (changeType?: string) => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  if (isLoading) {
    return <CommissionMetricsSkeleton compact={compact} className={className} />;
  }

  if (compact) {
    return (
      <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-4 ${className || ''}`}>
        {metricsData.metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{metric.label}</p>
                  <p className="text-2xl font-bold">{formatValue(metric.value, metric.format)}</p>
                </div>
                {metric.icon && (
                  <div className="text-muted-foreground">
                    {metric.icon}
                  </div>
                )}
              </div>
              {metric.change !== undefined && (
                <div className="flex items-center gap-1 mt-2">
                  {getChangeIcon(metric.changeType)}
                  <span className={`text-xs ${getChangeColor(metric.changeType)}`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </span>
                  <span className="text-xs text-muted-foreground">from last month</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Commission Metrics</h3>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date(metricsData.lastUpdated).toLocaleString()}
          </p>
        </div>
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        )}
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricsData.metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                  <p className="text-3xl font-bold">{formatValue(metric.value, metric.format)}</p>
                  {metric.change !== undefined && (
                    <div className="flex items-center gap-1">
                      {getChangeIcon(metric.changeType)}
                      <span className={`text-sm font-medium ${getChangeColor(metric.changeType)}`}>
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </span>
                      <span className="text-sm text-muted-foreground">from last month</span>
                    </div>
                  )}
                </div>
                {metric.icon && (
                  <div className="p-3 bg-muted/50 rounded-full text-muted-foreground">
                    {metric.icon}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Performing Rule */}
      {metricsData.topPerformingRule && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Performing Rule</CardTitle>
            <CardDescription>
              Highest earning commission rule this month
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{metricsData.topPerformingRule.name}</p>
                <p className="text-sm text-muted-foreground">Commission Rule</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  {formatValue(metricsData.topPerformingRule.amount, 'currency')}
                </p>
                <p className="text-sm text-muted-foreground">Generated</p>
              </div>
            </div>
            
            {/* Progress bar showing contribution to total */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Contribution to total</span>
                <span>
                  {((metricsData.topPerformingRule.amount / metricsData.totalCommissions) * 100).toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={(metricsData.topPerformingRule.amount / metricsData.totalCommissions) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Active Rules</span>
              </div>
              <p className="text-2xl font-bold">{metricsData.activeRules}</p>
              <p className="text-xs text-muted-foreground">Commission rules currently active</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Avg Rate</span>
              </div>
              <p className="text-2xl font-bold">{metricsData.avgCommissionRate}%</p>
              <p className="text-xs text-muted-foreground">Average commission rate</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Monthly Growth</span>
              </div>
              <div className="flex items-center gap-1">
                <p className="text-2xl font-bold text-green-600">+{metricsData.monthlyChange}%</p>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-xs text-muted-foreground">Compared to last month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Loading skeleton
export function CommissionMetricsSkeleton({ 
  compact = false, 
  className 
}: { 
  compact?: boolean; 
  className?: string; 
}) {
  if (compact) {
    return (
      <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-4 ${className || ''}`}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className || ''}`}>
      <div className="flex justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-20" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6 space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-6 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}