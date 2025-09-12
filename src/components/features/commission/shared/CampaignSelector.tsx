// components/features/commission/shared/CampaignSelector.tsx - Campaign Selection Component (Mock)

'use client';

import { useState, useEffect } from 'react';
import { Megaphone, CheckCircle, AlertCircle, Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

// Mock campaign data - in real implementation, this would come from API
interface Campaign {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'scheduled' | 'ended' | 'paused';
  startDate: string;
  endDate: string;
  commissionRate?: number;
  targetAudience: string;
  budget?: number;
  spent?: number;
  conversions?: number;
}

// Mock function to generate campaigns
const generateMockCampaigns = (): Campaign[] => {
  const campaigns: Campaign[] = [];
  const campaignNames = [
    'Summer Beauty Collection',
    'Holiday Fashion Sale',
    'Back to School Special',
    'New Product Launch',
    'Influencer Collaboration',
    'Black Friday Exclusive',
    'Spring Wellness Campaign',
    'Premium Brand Partnership'
  ];

  // Generate 4-6 mock campaigns
  const count = Math.floor(Math.random() * 3) + 4;
  
  for (let i = 0; i < count; i++) {
    const startDate = new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000); // Last 60 days
    const endDate = new Date(startDate.getTime() + (Math.random() * 90 + 30) * 24 * 60 * 60 * 1000); // 30-120 days duration
    const budget = Math.floor(Math.random() * 50000) + 10000;
    const spent = Math.floor(budget * (Math.random() * 0.8 + 0.1)); // 10-90% spent
    
    let status: Campaign['status'] = 'active';
    if (endDate < new Date()) status = 'ended';
    else if (startDate > new Date()) status = 'scheduled';
    else if (Math.random() > 0.8) status = 'paused';

    campaigns.push({
      id: `campaign-${i + 1}`,
      name: campaignNames[i] || `Campaign ${i + 1}`,
      description: `Marketing campaign focused on ${Math.random() > 0.5 ? 'brand awareness' : 'conversion optimization'}`,
      status,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      commissionRate: Math.floor(Math.random() * 8) + 5, // 5-12%
      targetAudience: Math.random() > 0.5 ? 'Young Adults (18-35)' : 'Fashion Enthusiasts',
      budget,
      spent,
      conversions: Math.floor(Math.random() * 500) + 50
    });
  }
  
  return campaigns.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
};

interface CampaignSelectorProps {
  value?: string;
  onValueChange: (campaignId: string) => void;
  teamId?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  showCampaignInfo?: boolean;
  filterActive?: boolean;
}

export function CampaignSelector({
  value,
  onValueChange,
  teamId,
  disabled = false,
  required = false,
  className,
  showCampaignInfo = true,
  filterActive = true
}: CampaignSelectorProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  // Mock API call to fetch campaigns
  useEffect(() => {
    const fetchCampaigns = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const mockCampaigns = generateMockCampaigns();
      const filteredCampaigns = filterActive 
        ? mockCampaigns.filter(c => c.status === 'active')
        : mockCampaigns;
      
      setCampaigns(filteredCampaigns);
      setIsLoading(false);
    };

    if (teamId) {
      fetchCampaigns();
    }
  }, [teamId, filterActive]);

  // Update selected campaign when value changes
  useEffect(() => {
    if (value && campaigns.length > 0) {
      const campaign = campaigns.find(c => c.id === value);
      setSelectedCampaign(campaign || null);
    } else {
      setSelectedCampaign(null);
    }
  }, [value, campaigns]);

  const handleCampaignChange = (campaignId: string) => {
    if (campaignId === 'none') {
      onValueChange('');
      setSelectedCampaign(null);
    } else {
      onValueChange(campaignId);
      const campaign = campaigns.find(c => c.id === campaignId);
      setSelectedCampaign(campaign || null);
    }
  };

  const getStatusIcon = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'scheduled':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'paused':
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      case 'ended':
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: Campaign['status']) => {
    const variants = {
      active: 'bg-green-100 text-green-800 border-green-200',
      scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
      paused: 'bg-amber-100 text-amber-800 border-amber-200',
      ended: 'bg-gray-100 text-gray-600 border-gray-200'
    };

    return (
      <Badge variant="outline" className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getCampaignProgress = (campaign: Campaign) => {
    if (!campaign.budget || !campaign.spent) return 0;
    return Math.min((campaign.spent / campaign.budget) * 100, 100);
  };

  const getDaysRemaining = (campaign: Campaign) => {
    const now = new Date();
    const endDate = new Date(campaign.endDate);
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  if (isLoading) {
    return (
      <div className={`space-y-3 ${className || ''}`}>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className || ''}`}>
      {/* Campaign Selector */}
      <div className="space-y-2">
        <Label>
          Campaign {required && '*'}
          <span className="text-muted-foreground ml-2">
            ({campaigns.length} available)
          </span>
        </Label>
        
        <Select
          value={value || ''}
          onValueChange={handleCampaignChange}
          disabled={disabled || campaigns.length === 0}
        >
          <SelectTrigger>
            <SelectValue 
              placeholder={
                campaigns.length === 0 
                  ? "No campaigns available" 
                  : "Select campaign..."
              } 
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No campaign</SelectItem>
            {campaigns.map((campaign) => (
              <SelectItem key={campaign.id} value={campaign.id}>
                <div className="flex items-center gap-2">
                  <Megaphone className="h-4 w-4" />
                  <span>{campaign.name}</span>
                  {getStatusIcon(campaign.status)}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* No Campaigns Available */}
      {campaigns.length === 0 && (
        <Alert>
          <Megaphone className="h-4 w-4" />
          <AlertDescription>
            No {filterActive ? 'active' : ''} campaigns found. Create marketing campaigns to enable campaign-specific commission rules.
          </AlertDescription>
        </Alert>
      )}

      {/* Campaign Information */}
      {selectedCampaign && showCampaignInfo && (
        <Card>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5 text-muted-foreground" />
                  <h4 className="font-medium">{selectedCampaign.name}</h4>
                </div>
                {getStatusBadge(selectedCampaign.status)}
              </div>
              
              <p className="text-sm text-muted-foreground">
                {selectedCampaign.description}
              </p>
              
              {/* Campaign Metrics */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">Commission Rate:</span>
                  <p className="font-medium">{selectedCampaign.commissionRate}%</p>
                </div>
                
                <div>
                  <span className="text-muted-foreground">Target Audience:</span>
                  <p className="font-medium">{selectedCampaign.targetAudience}</p>
                </div>
                
                <div>
                  <span className="text-muted-foreground">Start Date:</span>
                  <div className="flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3" />
                    <span className="font-medium">
                      {format(new Date(selectedCampaign.startDate), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
                
                <div>
                  <span className="text-muted-foreground">End Date:</span>
                  <div className="flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3" />
                    <span className="font-medium">
                      {format(new Date(selectedCampaign.endDate), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Campaign Progress */}
              {selectedCampaign.budget && selectedCampaign.spent && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Budget Progress</span>
                    <span>${selectedCampaign.spent.toLocaleString()} / ${selectedCampaign.budget.toLocaleString()}</span>
                  </div>
                  <Progress value={getCampaignProgress(selectedCampaign)} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {getCampaignProgress(selectedCampaign).toFixed(1)}% of budget used
                  </p>
                </div>
              )}

              {/* Days Remaining */}
              {selectedCampaign.status === 'active' && (
                <div className="flex items-center justify-between text-sm p-2 bg-blue-50 rounded">
                  <span className="text-blue-700">Days remaining:</span>
                  <span className="font-medium text-blue-800">
                    {getDaysRemaining(selectedCampaign)} days
                  </span>
                </div>
              )}

              {/* Performance Metrics */}
              {selectedCampaign.conversions && (
                <div className="pt-2 border-t">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="text-center">
                      <p className="font-medium text-lg">{selectedCampaign.conversions}</p>
                      <p className="text-muted-foreground">Conversions</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-lg">
                        ${selectedCampaign.spent && selectedCampaign.conversions 
                          ? (selectedCampaign.spent / selectedCampaign.conversions).toFixed(2) 
                          : '0.00'
                        }
                      </p>
                      <p className="text-muted-foreground">Cost per conversion</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedCampaign.status === 'ended' && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This campaign has ended. Commission rules using this campaign will not apply to new transactions.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Campaign Statistics */}
      {campaigns.length > 0 && (
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="text-center">
            <p className="font-medium text-green-600">
              {campaigns.filter(c => c.status === 'active').length}
            </p>
            <p className="text-muted-foreground">Active</p>
          </div>
          <div className="text-center">
            <p className="font-medium text-blue-600">
              {campaigns.filter(c => c.status === 'scheduled').length}
            </p>
            <p className="text-muted-foreground">Scheduled</p>
          </div>
          <div className="text-center">
            <p className="font-medium text-amber-600">
              {campaigns.filter(c => c.status === 'paused').length}
            </p>
            <p className="text-muted-foreground">Paused</p>
          </div>
          <div className="text-center">
            <p className="font-medium text-gray-600">
              {campaigns.filter(c => c.status === 'ended').length}
            </p>
            <p className="text-muted-foreground">Ended</p>
          </div>
        </div>
      )}
    </div>
  );
}