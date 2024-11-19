import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { Message, Property, User } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { da } from 'date-fns/locale';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  currentUser: User;
  messages: Message[];
  onSendMessage: (content: string) => void;
}

export default function MessageModal({
  isOpen,
  onClose,
  property,
  currentUser,
  messages,
  onSendMessage,
}: MessageModalProps) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onSendMessage(newMessage.trim());
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full h-[600px] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{property.title}</h2>
            <p className="text-sm text-gray-500">{property.location}</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <p>Ingen beskeder endnu.</p>
              <p className="text-sm mt-2">Start samtalen ved at sende en besked.</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender_id === currentUser.id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender_id === currentUser.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="break-words">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender_id === currentUser.id
                        ? 'text-blue-100'
                        : 'text-gray-500'
                    }`}
                  >
                    {formatDistanceToNow(new Date(message.created_at), {
                      addSuffix: true,
                      locale: da,
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Skriv en besked..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={1000}
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || isSubmitting}
              className={`px-4 py-2 rounded-lg bg-blue-600 text-white flex items-center gap-2 transition-colors ${
                !newMessage.trim() || isSubmitting
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-blue-700'
              }`}
            >
              <Send size={20} />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {newMessage.length}/1000 tegn
          </div>
        </form>
      </div>
    </div>
  );
}