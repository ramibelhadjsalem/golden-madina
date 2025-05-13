import React, { useState, useRef, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { uploadFile, validateFile } from '@/lib/storage-utils';
import { toast } from '@/hooks/use-toast';
import { useTranslate } from '@/hooks/use-translate';

interface FileUploadInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  accept?: string;
  maxSizeMB?: number;
  bucket?: string;
  folder?: string;
  className?: string;
  disabled?: boolean;
}

const FileUploadInput: React.FC<FileUploadInputProps> = ({
  value,
  onChange,
  placeholder = 'Enter URL or upload file',
  accept = 'image/*',
  maxSizeMB = 5,
  bucket = 'public',
  folder = '',
  className = '',
  disabled = false,
}) => {
  const { t } = useTranslate();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle URL input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // Handle file selection
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file
    const allowedTypes = accept === '*' ? [] : accept.split(',').map(type => type.trim());
    if (!validateFile(file, { maxSizeMB, allowedTypes })) {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    try {
      setIsUploading(true);

      // Upload file to Supabase Storage
      const fileUrl = await uploadFile(file, bucket, folder);

      if (fileUrl) {
        onChange(fileUrl);
        toast({
          title: t('uploadSuccess'),
          description: t('fileUploadedSuccessfully'),
        });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: t('uploadFailed'),
        description: error instanceof Error ? error.message : t('failedToUploadFile'),
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Trigger file input click
  const handleBrowseClick = (e: React.MouseEvent) => {
    // Prevent default behavior to avoid form submission or navigation
    e.preventDefault();

    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <Input
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="pr-24"
        disabled={disabled || isUploading}
      />

      <div className="absolute right-1 flex items-center">
        {isUploading ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled
            className="h-8 px-2"
          >
            <div className="flex items-center">
              <div className="animate-spin h-4 w-4 mr-2 border-2 border-slate-500 rounded-full border-t-transparent"></div>
              {t('uploading')}
            </div>
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleBrowseClick}
            disabled={disabled}
            className="h-8 px-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            {t('browse')}
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || isUploading}
      />
    </div>
  );
};

export { FileUploadInput };
