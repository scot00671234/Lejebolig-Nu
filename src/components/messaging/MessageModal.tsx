import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { Property, User } from '../../types';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  currentUser: User | null;
  onSendMessage: (content: string) => void;
}

export default function MessageModal({
  isOpen,
  onClose,
  property,
  currentUser,
  onSendMessage,
}: MessageModalProps) {
  const [newMessage, setNewMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full h-[400px] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{property.title}</h2>
            <p className="text-sm text-gray-500">{property.location}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 p-4">
          <p className="text-gray-600 mb-4">
            Send en besked til udlejeren af denne bolig. Vær venlig at være konkret og høflig i din henvendelse.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
          <div className="flex flex-col gap-3">
            <textarea
              placeholder="Skriv din besked her..."
              className="w-full p-3 border border-gray-200 rounded-lg resize-none h-32"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors w-full flex items-center justify-center gap-2"
            >
              <Send size={20} />
              <span>Send besked</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}