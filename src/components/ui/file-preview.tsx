import React, { useState, useEffect } from 'react';
import { useTranslate } from '@/hooks/use-translate';

interface FilePreviewProps {
  url: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  alt?: string;
  onError?: (error: string) => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({
  url,
  className = '',
  width = 200,
  height = 'auto',
  alt = 'File preview',
  onError,
}) => {
  const { t } = useTranslate();
  const [fileType, setFileType] = useState<'image' | 'video' | 'audio' | 'pdf' | 'other'>('other');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!url) {
      setFileType('other');
      return;
    }

    // Reset error state when URL changes
    setError(false);

    // Determine file type based on URL extension or content type
    const extension = url.split('.').pop()?.toLowerCase();

    if (/\.(jpg|jpeg|png|gif|webp|svg|avif)$/i.test(url)) {
      setFileType('image');
    } else if (/\.(mp4|webm|ogg|mov)$/i.test(url)) {
      setFileType('video');
    } else if (/\.(mp3|wav|ogg|aac)$/i.test(url)) {
      setFileType('audio');
    } else if (/\.(pdf)$/i.test(url)) {
      setFileType('pdf');
    } else {
      // Try to determine if it's an image by loading it
      const img = new Image();
      img.onload = () => setFileType('image');
      img.onerror = () => setFileType('other');
      img.src = url;
    }
  }, [url]);

  const handleImageError = () => {
    setError(true);
    if (onError) {
      onError(t('failedToLoadPreview'));
    }
  };

  // Handle empty URLs or placeholder URLs
  if (!url || url.startsWith('placeholder-')) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 rounded-md ${className}`} style={{ width, height }}>
        <span className="text-slate-400 text-sm">{t('noFileSelected')}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 rounded-md ${className}`} style={{ width, height }}>
        <span className="text-red-500 text-sm">{t('failedToLoadPreview')}</span>
      </div>
    );
  }

  switch (fileType) {
    case 'image':
      return (
        <img
          src={url}
          alt={alt}
          className={`object-contain rounded-md ${className}`}
          style={{ width, height }}
          onError={handleImageError}
        />
      );

    case 'video':
      return (
        <video
          src={url}
          controls
          className={`rounded-md ${className}`}
          style={{ width, height }}
        >
          {t('browserDoesNotSupportVideo')}
        </video>
      );

    case 'audio':
      return (
        <audio
          src={url}
          controls
          className={`w-full ${className}`}
        >
          {t('browserDoesNotSupportAudio')}
        </audio>
      );

    case 'pdf':
      return (
        <div className={`flex flex-col items-center justify-center ${className}`} style={{ width, height }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-500 mb-2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M9 15v-2h6v2" />
            <path d="M12 15v3" />
            <path d="M9 11h.01" />
          </svg>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline text-sm"
          >
            {t('viewPdf')}
          </a>
        </div>
      );

    default:
      return (
        <div className={`flex flex-col items-center justify-center bg-slate-100 rounded-md ${className}`} style={{ width, height }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-slate-400 mb-2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline text-sm"
          >
            {t('viewFile')}
          </a>
        </div>
      );
  }
};

export { FilePreview };
