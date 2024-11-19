import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Property, User } from '../../types';
import MessageModal from './MessageModal';
import { useMessageStore } from '../../store/messageStore';

interface MessageButtonProps {
  property: Property;
  currentUser: User | null;
}

export default function MessageButton({ property, currentUser }: MessageButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { sendMessage, conversations, fetchConversations } = useMessageStore();

  const handleOpenModal = () => {
    if (!currentUser) {
      // Redirect to login or show login modal
      return;
    }
    fetchConversations();
    setIsModalOpen(true);
  };

  const handleSendMessage = async (content: string) => {
    if (!currentUser || !property.landlord_id) return;
    await sendMessage(content, property.id, property.landlord_id);
  };

  // Find existing conversation for this property
  const conversation = conversations.find(
    (conv) => conv.property_id === property.id
  );

  const messages = conversation?.messages || [];

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        disabled={!currentUser}
      >
        <MessageCircle size={20} />
        <span>Kontakt udlejer</span>
      </button>

      {isModalOpen && (
        <MessageModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          property={property}
          currentUser={currentUser!}
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      )}
    </>
  );
}
