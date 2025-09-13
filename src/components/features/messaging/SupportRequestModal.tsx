// src/components/features/messaging/SupportRequestModal.tsx

'use client';

import React, { useState } from 'react';
import { Headphones, AlertCircle, HelpCircle, CreditCard, Settings, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useMessagingHooks } from '@/hooks/api/messaging-hooks';
import type { CreateSupportRequest } from '@/types/app/messaging-types';

interface SupportRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestCreated?: (conversationId: string) => void;
}

type SupportCategory = {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
};

const SUPPORT_CATEGORIES: SupportCategory[] = [
  {
    id: 'billing',
    label: 'Billing & Payments',
    description: 'Subscription, payments, invoices, commission issues',
    icon: CreditCard,
    color: 'text-green-600 bg-green-50 dark:bg-green-900/20'
  },
  {
    id: 'technical',
    label: 'Technical Issue',
    description: 'Bugs, errors, performance problems, app not working',
    icon: Bug,
    color: 'text-red-600 bg-red-50 dark:bg-red-900/20'
  },
  {
    id: 'account',
    label: 'Account & Settings',
    description: 'Profile, team management, permissions, verification',
    icon: Settings,
    color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
  },
  {
    id: 'general',
    label: 'General Support',
    description: 'Questions, guidance, how-to, feature requests',
    icon: HelpCircle,
    color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20'
  },
  {
    id: 'urgent',
    label: 'Urgent Issue',
    description: 'Critical problems affecting your business operations',
    icon: AlertCircle,
    color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20'
  }
];

export const SupportRequestModal: React.FC<SupportRequestModalProps> = ({
  isOpen,
  onClose,
  onRequestCreated
}) => {
  const [selectedCategory, setSelectedCategory] = useState<SupportCategory | null>(null);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const messagingHooks = useMessagingHooks();
  const { mutate: createSupportConversation } = messagingHooks.createSupportConversation();

  const handleCreateRequest = async () => {
    if (!selectedCategory || !subject.trim() || !description.trim()) return;

    setIsCreating(true);
    
    try {
      const request: CreateSupportRequest = {
        subject: `[${selectedCategory.label}] ${subject.trim()}`,
        initial_message: description.trim()
      };

      createSupportConversation(request);
      
      // Mock success - in real implementation, this would come from the mutation's onSuccess
      setTimeout(() => {
        const mockConversationId = `support-${Date.now()}`;
        onRequestCreated?.(mockConversationId);
        handleClose();
      }, 1000);
      
    } catch (error) {
      console.error('Failed to create support request:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setSelectedCategory(null);
    setSubject('');
    setDescription('');
    setIsCreating(false);
    onClose();
  };

  const canCreate = selectedCategory && subject.trim().length > 0 && description.trim().length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Headphones className="w-5 h-5 text-blue-600" />
            <span>Contact Support</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col space-y-4">
          {/* Category Selection */}
          {!selectedCategory ? (
            <div className="flex-1 overflow-y-auto">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Select the category that best describes your issue:
              </p>
              
              <div className="space-y-3">
                {SUPPORT_CATEGORIES.map((category) => {
                  const IconComponent = category.icon;
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category)}
                      className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors group"
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${category.color} group-hover:scale-105 transition-transform`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                            {category.label}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                            {category.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              {/* Selected Category Display */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedCategory.color}`}>
                      <selectedCategory.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        {selectedCategory.label}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedCategory.description}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                  >
                    Change Category
                  </Button>
                </div>
              </div>

              {/* Subject Field */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief description of your issue"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={100}
                />
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {subject.length}/100 characters
                </div>
              </div>

              {/* Description Field */}
              <div className="flex-1 flex flex-col">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce, or relevant information..."
                  rows={6}
                  className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  maxLength={2000}
                />
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {description.length}/2000 characters
                </div>
              </div>

              {/* Priority Notice */}
              {selectedCategory.id === 'urgent' && (
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-orange-800 dark:text-orange-200">
                        Urgent Support Request
                      </p>
                      <p className="text-orange-700 dark:text-orange-300 mt-1">
                        Our team will prioritize your request and respond within 2 hours during business hours.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={handleClose} disabled={isCreating}>
            Cancel
          </Button>
          {selectedCategory && (
            <Button 
              onClick={handleCreateRequest}
              disabled={!canCreate || isCreating}
              className="min-w-[120px]"
            >
              {isCreating ? 'Submitting...' : 'Submit Request'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};