// import { useState, useEffect, useRef } from 'react';
// import { supabase } from '@/lib/supabase';
// import { toast } from '@/hooks/use-toast';
// import { useTranslate } from '@/hooks/use-translate';
// import { BlogPost } from '@/components/admin/BlogEditor';

// interface BlogFilters {
//   language?: string;
//   status?: 'published' | 'draft' | 'all';
//   limit?: number;
//   searchQuery?: string;
//   orderBy?: {
//     column: string;
//     ascending: boolean;
//   };
// }

// export function useBlogs(filters: BlogFilters = {}) {
//   const [blogs, setBlogs] = useState<BlogPost[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<Error | null>(null);
//   const [totalCount, setTotalCount] = useState(0);

//   // Get the translate function but don't include it in dependencies
//   const { t } = useTranslate();

//   // Memoize the filters to prevent unnecessary re-renders
//   const memoizedFilters = useMemo(() => filters, [
//     filters.language,
//     filters.status,
//     filters.searchQuery,
//     filters.limit,
//     filters.orderBy?.column,
//     filters.orderBy?.ascending
//   ]);

//   useEffect(() => {
//     const fetchBlogs = async () => {
//       try {
//         setLoading(true);

//         // Start building the query
//         let query = supabase
//           .from('blogs')
//           .select('*', { count: 'exact' });

//         // Build query parameters
//         const queryParams: Record<string, string> = {};

//         // Apply filters
//         if (filters.language) {
//           queryParams.language = filters.language;
//         }

//         if (filters.status && filters.status !== 'all') {
//           queryParams.status = filters.status;
//         }

//         // Apply filters
//         Object.entries(queryParams).forEach(([key, value]) => {
//           query = query.eq(key, value);
//         });

//         // Apply search query if provided
//         if (filters.searchQuery) {
//           query = query.or(`title.ilike.%${filters.searchQuery}%,summary.ilike.%${filters.searchQuery}%,content.ilike.%${filters.searchQuery}%`);
//         }

//         // Apply ordering if provided
//         if (filters.orderBy) {
//           query = query.order(filters.orderBy.column, { ascending: filters.orderBy.ascending });
//         } else {
//           // Default ordering by created_at descending
//           query = query.order('created_at', { ascending: false });
//         }

//         // Apply limit if provided
//         if (filters.limit) {
//           query = query.limit(filters.limit);
//         }

//         // Execute the query
//         const { data, error, count } = await query;

//         if (error) throw error;

//         setBlogs(data as BlogPost[]);
//         setTotalCount(count || 0);
//       } catch (error) {
//         console.error('Error fetching blogs:', error);
//         setError(error as Error);
//         toast({
//           title: t('errorFetchingBlogs'),
//           description: (error as Error).message,
//           variant: 'destructive',
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBlogs();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [
//     filters.language,
//     filters.status,
//     filters.searchQuery,
//     filters.limit,
//     filters.orderBy?.column,
//     filters.orderBy?.ascending,
//     t
//   ]);

//   return { blogs, loading, error, totalCount };
// }

// export async function getBlogById(id: string): Promise<BlogPost | null> {
//   try {
//     const { data, error } = await supabase
//       .from('blogs')
//       .select('*')
//       .eq('id', id)
//       .single();

//     if (error) throw error;

//     return data as BlogPost;
//   } catch (error) {
//     console.error('Error fetching blog by ID:', error);
//     return null;
//   }
// }

// export async function createBlog(blog: Omit<BlogPost, 'id'>): Promise<BlogPost | null> {
//   try {
//     // Create a new blog object with all required fields
//     const newBlog = {
//       title: blog.title,
//       author: blog.author,
//       content: blog.content,
//       summary: blog.summary,
//       image: blog.image,
//       status: blog.status,
//       created_at: new Date().toISOString(),
//       published_at: blog.status === 'published' ? new Date().toISOString() : null,
//       language: blog.language
//     };

//     const { data, error } = await supabase
//       .from('blogs')
//       .insert([newBlog])
//       .select();

//     if (error) throw error;

//     return data[0] as BlogPost;
//   } catch (error) {
//     console.error('Error creating blog:', error);
//     return null;
//   }
// }

// export async function updateBlog(id: string, blog: Partial<BlogPost>): Promise<BlogPost | null> {
//   try {
//     // If status is changing to published, set published_at
//     const updates: Partial<BlogPost> = { ...blog };
//     if (blog.status === 'published') {
//       const { data: existingBlog } = await supabase
//         .from('blogs')
//         .select('status')
//         .eq('id', id)
//         .single();

//       if (existingBlog && existingBlog.status !== 'published') {
//         updates.published_at = new Date().toISOString();
//       }
//     }

//     const { data, error } = await supabase
//       .from('blogs')
//       .update(updates)
//       .eq('id', id)
//       .select();

//     if (error) throw error;

//     return data[0] as BlogPost;
//   } catch (error) {
//     console.error('Error updating blog:', error);
//     return null;
//   }
// }

// export async function deleteBlog(id: string): Promise<boolean> {
//   try {
//     const { error } = await supabase
//       .from('blogs')
//       .delete()
//       .eq('id', id);

//     if (error) throw error;

//     return true;
//   } catch (error) {
//     console.error('Error deleting blog:', error);
//     return false;
//   }
// }
