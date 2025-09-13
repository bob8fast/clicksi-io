'use client'

import Script from 'next/script';
import { useEffect, useRef } from 'react';

interface TallyFormProps
{
    formId: string;
    title?: string;
    className?: string;
    tallyMode?: TallyMode;
    height?: number;
    hideTitle?: boolean;
    transparentBackground?: boolean;
    alignLeft?: boolean;
    onSubmit?: (data: TallyForm) => void;
    modalDimensions?: { width: number; height: number };
}

type TallyForm = TallyContactWithUseFormType;

export interface TallyContactWithUseFormType
{
    email_address: string;
    full_name: string;
    name: string;
    email: string;
    message: string;
}

type TallyMode = 'embed' | 'full_page';

const TallyForm: React.FC<TallyFormProps> = ({
    formId,
    className = '',
    tallyMode = 'embed',
    title = '',
    height = 0,
    hideTitle = true,
    transparentBackground = true,
    alignLeft = true,
    onSubmit,
    modalDimensions
}) =>
{
    // https://github.com/vercel/next.js/discussions/63836
    if (typeof window === "undefined")
    {
        return (<></>);
    }

    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Calculate responsive height based on modal dimensions
    const calculateHeight = () =>
    {
        if (height && height > 0)
        {
            return height;
        }

        if (modalDimensions && modalDimensions.height > 0)
        {
            // Use 85% of available modal height, accounting for padding
            return Math.max(400, Math.floor(modalDimensions.height * 0.85));
        }

        return 400;
    };

    const responsiveHeight = calculateHeight();

    // Build the Tally URL with parameters
    const params = new URLSearchParams();
    if (alignLeft) params.append('alignLeft', '1');
    if (hideTitle) params.append('hideTitle', '1');
    if (transparentBackground) params.append('transparentBackground', '1');

    // by default embedded
    let tallyUrl = '';

    if (tallyMode == 'full_page')
    {
        tallyUrl = `https://tally.so/r/${formId}?${params.toString()}`;
    }
    else
    {
        tallyUrl = `https://tally.so/embed/${formId}?${params.toString()}`;
    }

    useEffect(() =>
    {
        // Force iframe reload
        if (iframeRef.current)
        {
            iframeRef.current.src = tallyUrl;
        }

        // Initialize Tally
        const initTally = () =>
        {
            // @ts-ignore
            if (typeof Tally !== 'undefined')
            {
                // @ts-ignore
                Tally.loadEmbeds();
            }
        };

        // Wait a bit for the script to load
        setTimeout(initTally, 100);

        // Listen for Tally form submissions
        const handleMessage = (event: MessageEvent) =>
        {
            if (event.origin !== 'https://tally.so') return;

            if (event.data && event.data.event === 'FormSubmitted' && event.data.formId === formId)
            {
                if (onSubmit && event.data.fields)
                {
                    const formData = event.data.fields.reduce((acc: any, field: any) =>
                    {
                        if (field.label && field.value)
                        {
                            const key = field.label.toLowerCase().replace(/\s+/g, '_');
                            acc[key] = field.value;
                        }
                        return acc;
                    }, {});

                    onSubmit(formData);
                }
            }
        };

        window.addEventListener('message', handleMessage);

        return () =>
        {
            window.removeEventListener('message', handleMessage);
        };
    }, [formId, onSubmit, tallyUrl]);

    return (
        <>
            <div className={`w-full h-full flex ${className}`}>
                <iframe
                    ref={iframeRef}
                    data-tally-src={tallyUrl}
                    loading="eager"
                    width="100%"
                    height={tallyMode == 'full_page' ? '100%' : responsiveHeight}
                    frameBorder={0}
                    marginHeight={0}
                    marginWidth={0}
                    title={title}
                    className="w-full flex-1"
                    style={{
                        border: 'none'
                    }}
                />
            </div>

            <Script
                id="tally-js"
                src="https://tally.so/widgets/embed.js"
                strategy="afterInteractive"
                onLoad={() =>
                {
                    // @ts-ignore
                    if (typeof Tally !== 'undefined')
                    {
                        // @ts-ignore
                        Tally.loadEmbeds();
                    }
                }}
            />
        </>
    );
};

export default TallyForm;