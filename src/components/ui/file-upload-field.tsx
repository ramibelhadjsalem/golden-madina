import React from 'react';
import { FileUploadInput } from './file-upload-input';
import { FilePreview } from './file-preview';
import { Label } from './label';
import { useTranslate } from '@/hooks/use-translate';

interface FileUploadFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  accept?: string;
  maxSizeMB?: number;
  bucket?: string;
  folder?: string;
  className?: string;
  disabled?: boolean;
  showPreview?: boolean;
  previewWidth?: number | string;
  previewHeight?: number | string;
  previewAlt?: string;
  required?: boolean;
  description?: string;
  error?: string;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  accept = 'image/*',
  maxSizeMB = 5,
  bucket = 'public',
  folder = '',
  className = '',
  disabled = false,
  showPreview = true,
  previewWidth = 200,
  previewHeight = 200,
  previewAlt,
  required = false,
  description,
  error,
}) => {
  const { t } = useTranslate();
  
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label htmlFor={label.replace(/\s+/g, '-').toLowerCase()}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <FileUploadInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        accept={accept}
        maxSizeMB={maxSizeMB}
        bucket={bucket}
        folder={folder}
        disabled={disabled}
        className={error ? 'border-red-500' : ''}
      />
      
      {description && (
        <p className="text-sm text-slate-500">{description}</p>
      )}
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      
      {showPreview && value && (
        <div className="mt-4">
          <FilePreview
            url={value}
            width={previewWidth}
            height={previewHeight}
            alt={previewAlt || label || t('filePreview')}
          />
        </div>
      )}
    </div>
  );
};

export { FileUploadField };
