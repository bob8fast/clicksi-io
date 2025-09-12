'use client'

import { useEffect } from 'react';
import { InlineWidget } from 'react-calendly';

interface CalendlyWrapperProps
{
    url: string;
    prefill?: {
        name?: string;
        email?: string;
    };
    modalDimensions?: { width: number; height: number };
}

const CalendlyWrapper: React.FC<CalendlyWrapperProps> = ({
    url,
    prefill,
    modalDimensions
}) =>
{
    // https://github.com/vercel/next.js/discussions/63836
    if (typeof window === "undefined")
    {
        return (<></>);
    }

    // Calculate responsive height based on modal dimensions
    const calculateHeight = () =>
    {
        if (modalDimensions && modalDimensions.height > 0)
        {
            // Use 85% of available modal height, with a minimum of 400px
            return Math.max(400, Math.floor(modalDimensions.height * 0.9));
        }
        return 400;
    };

    const responsiveHeight = calculateHeight();

    useEffect(() =>
    {
        // Add custom styles for Calendly iframe
        const style = document.createElement('style');
        style.textContent = `
            .calendly-inline-widget iframe {
                background-color: #202020 !important;
            }
            .calendly-inline-widget {
                background-color: #202020;
            }
        `;
        document.head.appendChild(style);

        return () =>
        {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <>
            <InlineWidget
                url={url}
                styles={{
                    height: `${responsiveHeight}px`,
                    width: '100%',
                }}
                pageSettings={{
                    backgroundColor: '#202020',
                    hideEventTypeDetails: true,
                    hideLandingPageDetails: true,
                    primaryColor: '#D78E59',
                    textColor: '#EDECF8',
                    hideGdprBanner: true,
                }}
                prefill={prefill}
                utm={{
                    utmCampaign: 'clicksi-consultation',
                    utmSource: 'website',
                    utmMedium: 'modal'
                }}
            />
        </>
    );
};

export default CalendlyWrapper;