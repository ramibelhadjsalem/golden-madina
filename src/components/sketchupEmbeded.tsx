import React, { useState, useEffect } from 'react';
import { useTranslate } from '@/hooks/use-translate';
import { AlertCircle } from 'lucide-react';

interface SketchfabEmbedProps {
    modelUrl: string;
}

const SketchfabEmbed: React.FC<SketchfabEmbedProps> = ({ modelUrl = "014bab740f934d4697701fdadf5e94bc" }) => {
    const { t } = useTranslate();
    const [error, setError] = useState(false);

    const handleIframeError = () => {

        setError(true);

    };

    return (
        <div className="sketchfab-embed-wrapper h-full w-full relative">
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-red-600 mb-2">{t('modelLoadError')}</h3>
                        <p className="text-slate-600 mb-4">
                            {t('modelNotFoundOrUnavailable')}
                        </p>
                        <p className="text-sm text-slate-500">
                            {t('modelId')}: {modelUrl}
                        </p>
                    </div>
                </div>
            )}
            {!error && <iframe
                title="3D Model Viewer"
                frameBorder="0"
                allow="autoplay; fullscreen; xr-spatial-tracking"
                allowFullScreen
                src={`https://sketchfab.com/models/${modelUrl}/embed`}
                className='h-full w-full'
                onError={handleIframeError}

            ></iframe>}

        </div>
    );
};

export default SketchfabEmbed;
