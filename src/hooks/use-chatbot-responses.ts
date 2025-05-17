import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { useTranslate } from '@/hooks/use-translate';

// Define the ChatbotResponse type
export interface ChatbotResponse {
  id: string;
  intent: string;
  pattern: string[]; // Array of pattern strings
  response_en: string;
  response_fr: string | null;
  response_ar: string | null;
  priority: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Hook to fetch all chatbot responses
export function useChatbotResponses() {
  const [responses, setResponses] = useState<ChatbotResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { t } = useTranslate();

  const fetchResponses = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('chatbot_responses')
        .select('*')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) throw error;

      setResponses(data as ChatbotResponse[]);
    } catch (error) {
      setError(error as Error);
      console.error('Error fetching chatbot responses:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResponses();
  }, [fetchResponses]);

  return { responses, loading, error, refetch: fetchResponses };
}

// Hook to manage chatbot responses (CRUD operations)
export function useChatbotResponsesAdmin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { t } = useTranslate();

  // Create a new response
  const createResponse = async (response: Omit<ChatbotResponse, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('chatbot_responses')
        .insert(response)
        .select();

      if (error) throw error;

      toast({
        title: t('success'),
        description: t('chatbotResponseCreated'),
      });

      return data[0] as ChatbotResponse;
    } catch (error) {
      setError(error as Error);
      toast({
        title: t('error'),
        description: (error as Error).message,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing response
  const updateResponse = async (id: string, updates: Partial<Omit<ChatbotResponse, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('chatbot_responses')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;

      toast({
        title: t('success'),
        description: t('chatbotResponseUpdated'),
      });

      return data[0] as ChatbotResponse;
    } catch (error) {
      setError(error as Error);
      toast({
        title: t('error'),
        description: (error as Error).message,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a response
  const deleteResponse = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('chatbot_responses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: t('success'),
        description: t('chatbotResponseDeleted'),
      });

      return true;
    } catch (error) {
      setError(error as Error);
      toast({
        title: t('error'),
        description: (error as Error).message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createResponse, updateResponse, deleteResponse, loading, error };
}

// Hook to get a response for a user message
export function useGetChatbotResponse() {
  const { currentLanguage } = useLanguage();
  const { responses, loading } = useChatbotResponses();

  // Function to find the best matching response for a user message
  const getResponse = useCallback((userMessage: string): string | null => {
    if (loading || !responses.length) return null;

    const lowerCaseMessage = userMessage.toLowerCase().trim();

    // Find all matching responses
    const matchingResponses = responses
      .filter(response => response.is_active)
      .filter(response => {
        // Check if any pattern in the pattern array matches
        return response.pattern.some(p =>
          lowerCaseMessage.includes(p.toLowerCase())
        );
      })
      .sort((a, b) => b.priority - a.priority); // Sort by priority (highest first)

    if (!matchingResponses.length) {
      // Return default response if no matches
      const defaultResponse = responses.find(r => r.intent === 'default');
      if (!defaultResponse) return null;

      // Return response in the current language or fall back to English
      if (currentLanguage.code === 'fr' && defaultResponse.response_fr) {
        return defaultResponse.response_fr;
      } else if (currentLanguage.code === 'ar' && defaultResponse.response_ar) {
        return defaultResponse.response_ar;
      } else {
        return defaultResponse.response_en;
      }
    }

    // Get the highest priority matching response
    const bestMatch = matchingResponses[0];

    // Return response in the current language or fall back to English
    if (currentLanguage.code === 'fr' && bestMatch.response_fr) {
      return bestMatch.response_fr;
    } else if (currentLanguage.code === 'ar' && bestMatch.response_ar) {
      return bestMatch.response_ar;
    } else {
      return bestMatch.response_en;
    }
  }, [responses, loading, currentLanguage.code]);

  return { getResponse, loading };
}
