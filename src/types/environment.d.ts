declare namespace NodeJS
{
    interface ProcessEnv
    {
        NODE_ENV: 'development' | 'production' | 'test';

        // Gateway
        NEXT_PUBLIC_API_GATEWAY_URL: string;

        // Auth server
        NEXT_PUBLIC_AUTH_SERVER_URL: string;
        AUTH_SERVER_URL: string;
        AUTH_SECRET: string;
        WEB_AUTH_CLIENT_ID: string;
        WEB_AUTH_CLIENT_SECRET: string;

        // External Auth
        GOOGLE_CLIENT_ID: string;
        GOOGLE_CLIENT_SECRET: string;
        FACEBOOK_APP_ID: string;
        FACEBOOK_APP_SECRET: string;

        // TODO
        NEXT_PUBLIC_ENABLE_COMMERCE: string;
        NEXT_PUBLIC_ENABLE_REVIEWS: string;
        NEXT_PUBLIC_MAX_FILE_SIZE: string;
        NEXT_PUBLIC_ALLOWED_FILE_TYPES: string;
    }
}