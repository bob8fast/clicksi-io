// components/features/commission/shared/PartnershipSelector.tsx - Partnership Selection Component (Mock)

'use client';

import { useState, useEffect } from 'react';
import { Building2, CheckCircle, AlertCircle, Users } from 'lucide-react';

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

// Mock partnership data - in real implementation, this would come from API
interface Partnership {
  id: string;
  name: string;
  type: 'brand' | 'retailer';
  status: 'active' | 'pending' | 'inactive';
  establishedDate: string;
  commissionsEnabled: boolean;
  description?: string;
}

// Mock function to generate partnerships
const generateMockPartnerships = (teamType: 'brand' | 'retailer'): Partnership[] => {
  const partnerships: Partnership[] = [];
  const partnerType = teamType === 'brand' ? 'retailer' : 'brand';
  
  // Generate 5-8 mock partnerships
  const count = Math.floor(Math.random() * 4) + 5;
  
  for (let i = 1; i <= count; i++) {
    partnerships.push({
      id: `partnership-${i}`,
      name: partnerType === 'brand' 
        ? `Beauty Brand ${i}` 
        : `Fashion Retailer ${i}`,
      type: partnerType,
      status: Math.random() > 0.8 ? 'pending' : Math.random() > 0.9 ? 'inactive' : 'active',
      establishedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      commissionsEnabled: Math.random() > 0.3,
      description: `Partnership with ${partnerType} for commission management`
    });
  }
  
  return partnerships;
};

interface PartnershipSelectorProps {
  value?: string;
  onValueChange: (partnershipId: string) => void;
  teamId?: string;
  teamType?: 'brand' | 'retailer';
  disabled?: boolean;
  required?: boolean;
  className?: string;
  showPartnershipInfo?: boolean;
  filterActive?: boolean;
}

export function PartnershipSelector({
  value,
  onValueChange,
  teamId,
  teamType = 'brand',
  disabled = false,
  required = false,
  className,
  showPartnershipInfo = true,
  filterActive = true
}: PartnershipSelectorProps) {
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPartnership, setSelectedPartnership] = useState<Partnership | null>(null);

  // Mock API call to fetch partnerships
  useEffect(() => {
    const fetchPartnerships = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockPartnerships = generateMockPartnerships(teamType);
      const filteredPartnerships = filterActive 
        ? mockPartnerships.filter(p => p.status === 'active' && p.commissionsEnabled)
        : mockPartnerships;
      
      setPartnerships(filteredPartnerships);
      setIsLoading(false);
    };

    if (teamId) {
      fetchPartnerships();
    }
  }, [teamId, teamType, filterActive]);

  // Update selected partnership when value changes
  useEffect(() => {
    if (value && partnerships.length > 0) {
      const partnership = partnerships.find(p => p.id === value);
      setSelectedPartnership(partnership || null);
    } else {
      setSelectedPartnership(null);
    }
  }, [value, partnerships]);

  const handlePartnershipChange = (partnershipId: string) => {
    if (partnershipId === 'none') {
      onValueChange('');
      setSelectedPartnership(null);
    } else {
      onValueChange(partnershipId);
      const partnership = partnerships.find(p => p.id === partnershipId);
      setSelectedPartnership(partnership || null);
    }
  };

  const getStatusIcon = (status: Partnership['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      case 'inactive':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: Partnership['status']) => {
    const variants = {
      active: 'default',
      pending: 'secondary',
      inactive: 'outline'
    } as const;

    const colors = {
      active: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-amber-100 text-amber-800 border-amber-200',
      inactive: 'bg-gray-100 text-gray-600 border-gray-200'
    };

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
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
      {/* Partnership Selector */}
      <div className="space-y-2">
        <Label>
          Partnership {required && '*'}
          <span className="text-muted-foreground ml-2">
            ({partnerships.length} available)
          </span>
        </Label>
        
        <Select
          value={value || ''}
          onValueChange={handlePartnershipChange}
          disabled={disabled || partnerships.length === 0}
        >
          <SelectTrigger>
            <SelectValue 
              placeholder={
                partnerships.length === 0 
                  ? "No partnerships available" 
                  : "Select partnership..."
              } 
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No partnership</SelectItem>
            {partnerships.map((partnership) => (
              <SelectItem key={partnership.id} value={partnership.id}>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span>{partnership.name}</span>
                  {getStatusIcon(partnership.status)}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* No Partnerships Available */}
      {partnerships.length === 0 && (
        <Alert>
          <Users className="h-4 w-4" />
          <AlertDescription>
            No {filterActive ? 'active' : ''} partnerships found. Establish partnerships with other{' '}
            {teamType === 'brand' ? 'retailers' : 'brands'} to enable partnership-specific commission rules.
          </AlertDescription>
        </Alert>
      )}

      {/* Partnership Information */}
      {selectedPartnership && showPartnershipInfo && (
        <Card>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <h4 className="font-medium">{selectedPartnership.name}</h4>
                </div>
                {getStatusBadge(selectedPartnership.status)}
              </div>
              
              {selectedPartnership.description && (
                <p className="text-sm text-muted-foreground">
                  {selectedPartnership.description}
                </p>
              )}
              
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <p className="font-medium capitalize">{selectedPartnership.type}</p>
                </div>
                
                <div>
                  <span className="text-muted-foreground">Established:</span>
                  <p className="font-medium">
                    {new Date(selectedPartnership.establishedDate).toLocaleDateString()}
                  </p>
                </div>
                
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <div className="flex items-center gap-1 mt-1">
                    {getStatusIcon(selectedPartnership.status)}
                    <span className="capitalize font-medium">{selectedPartnership.status}</span>
                  </div>
                </div>
                
                <div>
                  <span className="text-muted-foreground">Commissions:</span>
                  <p className="font-medium">
                    {selectedPartnership.commissionsEnabled ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>

              {!selectedPartnership.commissionsEnabled && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Commission rules are not enabled for this partnership. Contact the partner to enable commission functionality.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Partnership Statistics */}
      {partnerships.length > 0 && (
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="text-center">
            <p className="font-medium text-green-600">
              {partnerships.filter(p => p.status === 'active').length}
            </p>
            <p className="text-muted-foreground">Active</p>
          </div>
          <div className="text-center">
            <p className="font-medium text-amber-600">
              {partnerships.filter(p => p.status === 'pending').length}
            </p>
            <p className="text-muted-foreground">Pending</p>
          </div>
          <div className="text-center">
            <p className="font-medium text-blue-600">
              {partnerships.filter(p => p.commissionsEnabled).length}
            </p>
            <p className="text-muted-foreground">With Commissions</p>
          </div>
        </div>
      )}
    </div>
  );
}