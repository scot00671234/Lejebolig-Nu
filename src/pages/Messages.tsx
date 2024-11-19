import React, { useEffect, useState, useRef } from 'react';
import { useMessageStore } from '../store/messageStore';
import { useAuthStore } from '../store/authStore';
import { Send, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { da } from 'date-fns/locale';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

interface Conversation {
  userId: string;
  userName: string;
  lastMessage?: Message;
  unreadCount: number;
}

export default function Messages() {
  const { user } = useAuthStore();
  const { sendMessage, getMessages, subscribeToMessages } = useMessageStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    // Load conversations
    const loadConversations = async () => {
      try {
        const conversations = await getMessages();
        setConversations(conversations);
      } catch (err) {
        setError('Kunne ikke indlæse beskeder');
      }
    };

    loadConversations();

    // Subscribe to new messages
    const subscription = subscribeToMessages((message: Message) => {
      setMessages(prev => [...prev, message]);
      setConversations(prev => {
        const conversation = prev.find(c => c.userId === message.senderId);
        if (conversation) {
          return prev.map(c => 
            c.userId === message.senderId 
              ? { ...c, lastMessage: message, unreadCount: c.unreadCount + 1 }
              : c
          );
        }
        return prev;
      });
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [user, getMessages, subscribeToMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConversation || !newMessage.trim()) return;

    try {
      await sendMessage({
        content: newMessage,
        receiverId: selectedConversation,
      });
      setNewMessage('');
    } catch (err) {
      setError('Kunne ikke sende besked');
    }
  };

  const formatMessageDate = (date: string) => {
    return format(new Date(date), 'dd. MMM yyyy HH:mm', { locale: da });
  };

  return (
    <div className="h-screen flex">
      {/* Conversation List */}
      <div className="w-1/3 border-r bg-gray-50">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Beskeder</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-73px)]">
          {conversations.map(conversation => (
            <button
              key={conversation.userId}
              onClick={() => setSelectedConversation(conversation.userId)}
              className={`w-full p-4 border-b hover:bg-gray-100 flex items-start space-x-3 ${
                selectedConversation === conversation.userId ? 'bg-gray-100' : ''
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {conversation.userName}
                </p>
                {conversation.lastMessage && (
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.lastMessage.content}
                  </p>
                )}
              </div>
              {conversation.unreadCount > 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {conversation.unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Message Thread */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                {conversations.find(c => c.userId === selectedConversation)?.userName}
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === user?.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderId === user?.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.senderId === user?.id ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatMessageDate(message.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Skriv en besked..."
                  className="flex-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Vælg en samtale for at se beskeder
          </div>
        )}
      </div>

      {error && (
        <div className="fixed bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
