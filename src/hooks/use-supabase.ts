import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { useTranslate } from '@/hooks/use-translate';

// Generic hook for fetching data from Supabase
export function useFetch<T>(
  tableName: string,
  options?: {
    columns?: string;
    filter?: { column: string; value: any; operator?: string };
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
  }
) {
  const [data, setData] = useState<T[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        let query = supabase
          .from(tableName)
          .select(options?.columns || '*');
        
        // Apply filter if provided
        if (options?.filter) {
          const { column, value, operator = '=' } = options.filter;
          query = query.filter(column, operator, value);
        }
        
        // Apply ordering if provided
        if (options?.orderBy) {
          const { column, ascending = true } = options.orderBy;
          query = query.order(column, { ascending });
        }
        
        // Apply limit if provided
        if (options?.limit) {
          query = query.limit(options.limit);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        setData(data as T[]);
      } catch (error) {
        setError(error as Error);
        toast({
          title: t('error'),
          description: (error as Error).message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableName, options, t]);

  return { data, error, loading };
}

// Hook for fetching a single item by ID
export function useFetchById<T>(
  tableName: string,
  id: string | undefined,
  options?: {
    columns?: string;
  }
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslate();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from(tableName)
          .select(options?.columns || '*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        setData(data as T);
      } catch (error) {
        setError(error as Error);
        toast({
          title: t('error'),
          description: (error as Error).message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableName, id, options, t]);

  return { data, error, loading };
}

// Hook for creating, updating, and deleting data
export function useSupabaseMutation<T>(tableName: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { t } = useTranslate();

  const create = async (data: Omit<T, 'id' | 'created_at'>) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: result, error } = await supabase
        .from(tableName)
        .insert(data)
        .select();
      
      if (error) throw error;
      
      return result[0];
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

  const update = async (id: string, data: Partial<T>) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: result, error } = await supabase
        .from(tableName)
        .update(data)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      return result[0];
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

  const remove = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
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

  return { create, update, remove, loading, error };
}
