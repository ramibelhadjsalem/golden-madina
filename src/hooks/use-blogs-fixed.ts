import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { useTranslate } from '@/hooks/use-translate';

// Define database row type for Supabase
interface BlogRow {
  id: string;
  title: string;
  author: string;
  content: string;
  summary: string;
  image: string;
  status: 'published' | 'draft';
  created_at: string;
  published_at: string | null;
  language?: string;
  tags?: string[];
}

// Define the BlogPost type here to avoid circular dependencies
export interface BlogPost extends BlogRow {
  date: string; // For compatibility with existing code
}

interface BlogFilters {
  language?: string;
  status?: 'published' | 'draft' | 'all';
  limit?: number;
  searchQuery?: string;
  orderBy?: {
    column: string;
    ascending: boolean;
  };
}

export function useBlogs(filters: BlogFilters = {}) {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Get the translate function
  const { t } = useTranslate();

  // Memoize the filters to prevent unnecessary re-renders
  const memoizedFilters = useCallback(() => {
    return {
      language: filters.language,
      status: filters.status,
      searchQuery: filters.searchQuery,
      limit: filters.limit,
      orderBy: filters.orderBy ? {
        column: filters.orderBy.column,
        ascending: filters.orderBy.ascending
      } : undefined
    };
  }, [
    filters.language,
    filters.status,
    filters.searchQuery,
    filters.limit,
    filters.orderBy
  ]);

  // Create a stable fetchBlogs function with useCallback
  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);

      // Get the current filters
      const currentFilters = memoizedFilters();

      // Build query parameters
      const queryParams: Record<string, string> = {};

      // Apply filters
      if (currentFilters.language) {
        queryParams.language = currentFilters.language;
      }

      if (currentFilters.status && currentFilters.status !== 'all') {
        queryParams.status = currentFilters.status;
      }

      // Start building the query
      let query = supabase.from('blogs').select('*', { count: 'exact' });

      // Apply filters
      Object.entries(queryParams).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      // Apply search query if provided
      if (currentFilters.searchQuery) {
        query = query.or(`title.ilike.%${currentFilters.searchQuery}%,summary.ilike.%${currentFilters.searchQuery}%,content.ilike.%${currentFilters.searchQuery}%`);
      }

      // Apply ordering if provided
      if (currentFilters.orderBy) {
        query = query.order(currentFilters.orderBy.column, { ascending: currentFilters.orderBy.ascending });
      } else {
        // Default ordering by created_at descending
        query = query.order('created_at', { ascending: false });
      }

      // Apply limit if provided
      if (currentFilters.limit) {
        query = query.limit(currentFilters.limit);
      }

      // Execute the query
      const { data, error, count } = await query;

      if (error) throw error;

      // Transform the data to match the BlogPost interface
      const transformedData = data.map((blog: BlogRow) => ({
        ...blog,
        date: blog.published_at || blog.created_at // Ensure date field exists for compatibility
      }));

      setBlogs(transformedData);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError(error as Error);
      toast({
        title: t('errorFetchingBlogs'),
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [memoizedFilters, t]);

  // Call fetchBlogs when dependencies change
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return { blogs, loading, error, totalCount };
}

export async function getBlogById(id: string): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    // Transform the data to match the BlogPost interface
    return {
      ...data,
      date: data.published_at || data.created_at // Ensure date field exists for compatibility
    };
  } catch (error) {
    console.error('Error fetching blog by ID:', error);
    return null;
  }
}

export async function createBlog(blog: Omit<BlogPost, 'id' | 'created_at' | 'date'>): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .insert([
        {
          ...blog,
          created_at: new Date().toISOString(),
          published_at: blog.status === 'published' ? new Date().toISOString() : null,
        },
      ])
      .select();

    if (error) throw error;

    // Transform the data to match the BlogPost interface
    return {
      ...data[0],
      date: data[0].published_at || data[0].created_at // Ensure date field exists for compatibility
    };
  } catch (error) {
    console.error('Error creating blog:', error);
    return null;
  }
}

export async function updateBlog(id: string, blog: Partial<BlogPost>): Promise<BlogPost | null> {
  try {
    // If status is changing to published, set published_at
    const updates: Partial<BlogRow> = { ...blog };
    if (blog.status === 'published') {
      const { data: existingBlog } = await supabase
        .from('blogs')
        .select('status')
        .eq('id', id)
        .single();

      if (existingBlog && existingBlog.status !== 'published') {
        updates.published_at = new Date().toISOString();
      }
    }

    const { data, error } = await supabase
      .from('blogs')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;

    // Transform the data to match the BlogPost interface
    return {
      ...data[0],
      date: data[0].published_at || data[0].created_at // Ensure date field exists for compatibility
    };
  } catch (error) {
    console.error('Error updating blog:', error);
    return null;
  }
}

export async function deleteBlog(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error deleting blog:', error);
    return false;
  }
}
