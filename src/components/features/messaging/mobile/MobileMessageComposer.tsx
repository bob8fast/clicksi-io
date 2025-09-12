// src/components/features/messaging/mobile/MobileMessageComposer.tsx

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMobileKeyboard } from '../hooks/useMobileKeyboard';

interface MobileMessageComposerProps {
  onSend: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const MobileMessageComposer: React.FC<MobileMessageComposerProps> = ({
  onSend,
  placeholder = "Type a message...",
  disabled = false,
  onFocus,
  onBlur
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { keyboardHeight, isKeyboardVisible } = useMobileKeyboard();
  
  // Auto-resize textarea based on content
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFocus = () => {
    onFocus?.();
  };

  const handleBlur = () => {
    onBlur?.();
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    // TODO: Implement voice recording functionality
  };

  return (
    <div 
      className={`mobile-message-composer bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 transition-all duration-300`}
      style={{
        paddingBottom: isKeyboardVisible ? `${Math.max(keyboardHeight - 100, 0)}px` : '0px'
      }}
    >
      <div className="px-4 py-3 pb-safe-area-inset-bottom">
        <div className="flex items-end space-x-2">
          {/* Attachment button */}
          <Button
            variant="ghost"
            size="sm"
            disabled={disabled}
            className="p-2 flex-shrink-0"
          >
            <Paperclip className="w-5 h-5 text-gray-500" />
          </Button>
          
          {/* Message input container */}
          <div className="flex-1 relative">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2 min-h-[40px] flex items-end">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                disabled={disabled}
                className="flex-1 bg-transparent border-none outline-none resize-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 leading-5"
                style={{
                  minHeight: '24px',
                  maxHeight: '120px'
                }}
                rows={1}
              />
              
              {/* Emoji button */}
              <Button
                variant="ghost"
                size="sm"
                disabled={disabled}
                className="p-1 ml-2 flex-shrink-0"
              >
                <Smile className="w-4 h-4 text-gray-500" />
              </Button>
            </div>
          </div>
          
          {/* Send or voice button */}
          {message.trim() ? (
            <Button
              onClick={handleSend}
              disabled={disabled}
              className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0"
              size="sm"
            >
              <Send className="w-5 h-5" />
            </Button>
          ) : (
            <Button
              onClick={handleVoiceRecord}
              disabled={disabled}
              variant={isRecording ? "destructive" : "ghost"}
              className={`p-2 rounded-full flex-shrink-0 ${
                isRecording 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'text-gray-500'
              }`}
              size="sm"
            >
              <Mic className={`w-5 h-5 ${isRecording ? 'animate-pulse' : ''}`} />
            </Button>
          )}
        </div>
        
        {/* Recording indicator */}
        {isRecording && (
          <div className="flex items-center justify-center mt-2 py-2">
            <div className="flex items-center space-x-2 text-red-600">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Recording...</span>
              <span className="text-sm">Tap to stop</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};