// src/components/features/messaging/MessageComposer.tsx

'use client';

import React, { useState, useRef, KeyboardEvent } from 'react';
import { Send, X, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmojiPicker, { EmojiClickData, SkinTonePickerLocation, Theme } from 'emoji-picker-react';
import { useTheme } from 'next-themes';
import type { MessageComposerProps } from '@/types/app/messaging-types';

interface ExtendedMessageComposerProps extends MessageComposerProps {
  initialValue?: string;
  isEditing?: boolean;
  onCancel?: () => void;
}

export const MessageComposer: React.FC<ExtendedMessageComposerProps> = ({
  onSend,
  placeholder = 'Type your message...',
  replyToMessage,
  disabled = false,
  isMobile = false,
  onFocus,
  onBlur,
  initialValue = '',
  isEditing = false,
  onCancel
}) => {
  const [message, setMessage] = useState(initialValue);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { theme } = useTheme();

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSend(trimmedMessage);
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    
    if (e.key === 'Escape' && isEditing && onCancel) {
      e.preventDefault();
      onCancel();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  const handleFocus = () => {
    onFocus?.();
  };

  const handleBlur = () => {
    onBlur?.();
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
    
    // Focus back to textarea after emoji selection
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const canSend = message.trim().length > 0 && !disabled;

  return (
    <div className="message-composer">
      {/* Reply preview is handled by parent component */}
      
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={disabled ? 'This conversation is read-only' : placeholder}
            disabled={disabled}
            rows={1}
            className={`
              w-full resize-none border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3
              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
              placeholder:text-gray-400 dark:placeholder:text-gray-500
              focus:ring-2 focus:ring-blue-500 focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
              ${isMobile ? 'text-base' : 'text-sm'}
              max-h-30 overflow-y-auto
            `}
            style={{ minHeight: '44px' }} // Touch-friendly minimum height
          />
        </div>
        
        <div className="flex items-center gap-2 relative">
          {/* Emoji picker button */}
          {!isEditing && (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                disabled={disabled}
                className={`h-11 px-3 ${showEmojiPicker ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' : ''}`}
                title="Add emoji"
              >
                <Smile className="w-4 h-4" />
              </Button>
              
              {/* Desktop emoji picker popup */}
              {showEmojiPicker && (
                <>
                  {/* Backdrop for mobile */}
                  {isMobile && (
                    <div 
                      className="fixed inset-0 z-40 bg-black/20"
                      onClick={() => setShowEmojiPicker(false)}
                    />
                  )}
                  
                  <div className={`absolute bottom-full ${isMobile ? 'left-1/2 transform -translate-x-1/2' : 'right-0'} z-50 mb-2`}>
                    <EmojiPicker
                      onEmojiClick={handleEmojiClick}
                      theme={theme === 'dark' ? Theme.DARK : theme === 'light' ? Theme.LIGHT : Theme.AUTO}
                      height={isMobile ? 300 : 400}
                      width={isMobile ? 280 : 350}
                      searchDisabled={false}
                      skinTonePickerLocation={SkinTonePickerLocation.PREVIEW}
                      previewConfig={{
                        showPreview: !isMobile, // Show preview on desktop, hide on mobile
                        defaultEmoji: "1f60a", // 😊
                        defaultCaption: "What's your mood?"
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          )}
          
          {isEditing && onCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="h-11 px-3"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          
          <Button
            onClick={handleSend}
            disabled={!canSend}
            size="sm"
            className={`h-11 px-3 ${isMobile ? 'min-w-[44px]' : ''}`}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Editing indicator */}
      {isEditing && (
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
          <span>Press Enter to save, Escape to cancel</span>
        </div>
      )}
      
      {/* Send indicator */}
      {!isEditing && (
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
          <span>Press Enter to send, Shift+Enter for new line</span>
          {replyToMessage && (
            <span>Replying to {replyToMessage.sender?.name || 'Unknown'}</span>
          )}
        </div>
      )}
    </div>
  );
};