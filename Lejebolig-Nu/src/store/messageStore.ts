import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Message, Conversation } from '../types';

interface MessageState {
  conversations: Conversation[];
  loading: boolean;
  error: string | null;
  fetchConversations: () => Promise<void>;
  sendMessage: (content: string, propertyId: string, receiverId: string) => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  conversations: [],
  loading: false,
  error: null,

  fetchConversations: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          messages (
            id,
            content,
            sender_id,
            created_at,
            read
          ),
          properties (
            id,
            title,
            location,
            price,
            images
          )
        `)
        .or(`tenant_id.eq.${userData.user.id},landlord_id.eq.${userData.user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      // Sort messages within each conversation by date
      const conversationsWithSortedMessages = data?.map(conversation => ({
        ...conversation,
        messages: conversation.messages.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
      })) || [];

      set({ conversations: conversationsWithSortedMessages, error: null });
    } catch (error: any) {
      set({ error: error.message });
      console.error('Error fetching conversations:', error);
    } finally {
      set({ loading: false });
    }
  },

  sendMessage: async (content: string, propertyId: string, receiverId: string) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('User not authenticated');

    set({ loading: true });
    try {
      // First, find or create a conversation
      let conversation;
      const { data: existingConversation, error: conversationError } = await supabase
        .from('conversations')
        .select('*')
        .or(
          `and(tenant_id.eq.${userData.user.id},landlord_id.eq.${receiverId}),` +
          `and(tenant_id.eq.${receiverId},landlord_id.eq.${userData.user.id})`
        )
        .eq('property_id', propertyId)
        .single();

      if (conversationError && conversationError.code !== 'PGRST116') {
        throw conversationError;
      }

      if (!existingConversation) {
        const { data: newConversation, error: createError } = await supabase
          .from('conversations')
          .insert([{
            tenant_id: userData.user.id,
            landlord_id: receiverId,
            property_id: propertyId,
            last_message_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (createError) throw createError;
        conversation = newConversation;
      } else {
        conversation = existingConversation;
      }

      // Then, create the message
      const { data: message, error: messageError } = await supabase
        .from('messages')
        .insert([{
          conversation_id: conversation.id,
          sender_id: userData.user.id,
          content,
          created_at: new Date().toISOString(),
          read: false
        }])
        .select()
        .single();

      if (messageError) throw messageError;

      // Update conversation's last_message_at
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversation.id);

      // Update local state
      const { conversations } = get();
      const updatedConversations = conversations.map(conv => {
        if (conv.id === conversation.id) {
          return {
            ...conv,
            messages: [...conv.messages, message],
            last_message_at: new Date().toISOString()
          };
        }
        return conv;
      });

      set({ conversations: updatedConversations, error: null });
    } catch (error: any) {
      set({ error: error.message });
      console.error('Error sending message:', error);
    } finally {
      set({ loading: false });
    }
  },

  markAsRead: async (conversationId: string) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    set({ loading: true });
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', userData.user.id)
        .eq('read', false);

      if (error) throw error;

      // Update local state
      const { conversations } = get();
      const updatedConversations = conversations.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: conv.messages.map(msg => ({
              ...msg,
              read: msg.sender_id === userData.user.id ? msg.read : true
            }))
          };
        }
        return conv;
      });

      set({ conversations: updatedConversations, error: null });
    } catch (error: any) {
      set({ error: error.message });
      console.error('Error marking messages as read:', error);
    } finally {
      set({ loading: false });
    }
  },
}));