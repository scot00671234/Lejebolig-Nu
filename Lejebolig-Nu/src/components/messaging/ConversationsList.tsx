import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Conversation, Property, User } from '../../types';

interface ConversationsListProps {
  conversations: Conversation[];
  properties: Property[];
  users: User[];
  currentUser: User;
  onSelectConversation: (conversation: Conversation) => void;
}

export default function ConversationsList({
  conversations,
  properties,
  users,
  currentUser,
  onSelectConversation,
}: ConversationsListProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Beskeder</h2>
      <div className="space-y-2">
        {conversations.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle size={48} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">Ingen beskeder endnu</p>
          </div>
        ) : (
          conversations.map((conversation) => {
            const property = properties.find((p) => p.id === conversation.propertyId)!;
            const otherUser = users.find(
              (u) => u.id === (currentUser.type === 'landlord' ? conversation.tenantId : conversation.landlordId)
            )!;
            const lastMessage = conversation.messages[conversation.messages.length - 1];

            return (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation)}
                className="w-full p-4 rounded-lg hover:bg-gray-50 transition-colors text-left border border-gray-200"
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-900">{property.title}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(lastMessage.createdAt).toLocaleDateString('da-DK')}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-1">
                  {otherUser.name}
                </p>
                <p className="text-sm text-gray-600 truncate">
                  {lastMessage.content}
                </p>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}