import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabase';
import { toast } from '@/hooks/use-toast';

/**
 * Uploads a file to Supabase Storage and returns the public URL
 * @param file The file to upload
 * @param bucket The storage bucket name (default: 'public')
 * @param folder The folder path within the bucket (default: '')
 * @returns The public URL of the uploaded file or null if upload failed
 */
export async function uploadFile(
  file: File,
  bucket: string = 'public',
  folder: string = ''
): Promise<string | null> {
  try {
    // Generate a unique file name to avoid collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    
    // Create the file path
    const filePath = folder ? `${folder}/${fileName}` : fileName;
    
    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });
    
    if (error) {
      throw error;
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    toast({
      title: 'Upload Failed',
      description: error instanceof Error ? error.message : 'Failed to upload file',
      variant: 'destructive',
    });
    return null;
  }
}

/**
 * Deletes a file from Supabase Storage
 * @param url The public URL of the file to delete
 * @param bucket The storage bucket name (default: 'public')
 * @returns True if deletion was successful, false otherwise
 */
export async function deleteFile(
  url: string,
  bucket: string = 'public'
): Promise<boolean> {
  try {
    // Extract the file path from the URL
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/');
    const filePath = pathSegments.slice(pathSegments.indexOf(bucket) + 1).join('/');
    
    // Delete the file from Supabase Storage
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    toast({
      title: 'Deletion Failed',
      description: error instanceof Error ? error.message : 'Failed to delete file',
      variant: 'destructive',
    });
    return false;
  }
}

/**
 * Validates if a file meets the specified criteria
 * @param file The file to validate
 * @param options Validation options
 * @returns True if the file is valid, false otherwise
 */
export function validateFile(
  file: File,
  options: {
    maxSizeMB?: number;
    allowedTypes?: string[];
  } = {}
): boolean {
  const { maxSizeMB = 5, allowedTypes = [] } = options;
  
  // Check file size
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > maxSizeMB) {
    toast({
      title: 'File Too Large',
      description: `File size exceeds the maximum allowed size of ${maxSizeMB}MB`,
      variant: 'destructive',
    });
    return false;
  }
  
  // Check file type if allowedTypes is provided
  if (allowedTypes.length > 0) {
    const fileType = file.type;
    if (!allowedTypes.includes(fileType)) {
      toast({
        title: 'Invalid File Type',
        description: `File type ${fileType} is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
        variant: 'destructive',
      });
      return false;
    }
  }
  
  return true;
}
