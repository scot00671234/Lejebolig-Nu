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
          messages:messages(*)
        `)
        .or(`landlord_id.eq.${userData.user.id},tenant_id.eq.${userData.user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      set({ conversations: data, error: null });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  sendMessage: async (content: string, propertyId: string, receiverId: string) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('User not authenticated');

    try {
      // First, ensure conversation exists
      let { data: conversation } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(property_id.eq.${propertyId},landlord_id.eq.${userData.user.id},tenant_id.eq.${receiverId}),
             and(property_id.eq.${propertyId},landlord_id.eq.${receiverId},tenant_id.eq.${userData.user.id})`)
        .single();

      if (!conversation) {
        const { data: newConversation, error: convError } = await supabase
          .from('conversations')
          .insert([
            {
              property_id: propertyId,
              landlord_id: receiverId,
              tenant_id: userData.user.id,
              last_message_at: new Date().toISOString(),
            },
          ])
          .select()
          .single();

        if (convError) throw convError;
        conversation = newConversation;
      }

      // Send message
      const { error: messageError } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: conversation.id,
            sender_id: userData.user.id,
            content,
            created_at: new Date().toISOString(),
          },
        ]);

      if (messageError) throw messageError;

      // Update conversation last_message_at
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversation.id);

      // Refresh conversations
      get().fetchConversations();
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  markAsRead: async (conversationId: string) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', userData.user.id);

      if (error) throw error;
      get().fetchConversations();
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));