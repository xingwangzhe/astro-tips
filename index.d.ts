import type { AstroIntegration } from 'astro';

interface TipsConfig {
    [key: string]: {
        icon: string;
        style?: {
            light?: {
                background?: string;
            };
            dark?: {
                background?: string;
            };
            border?: string;
        };
    };
}

declare module 'astro' {
    interface AstroUserConfig {
        tips?: TipsConfig;
    }
}

export interface Props {
    type: string;
    content: string;
    icon?: string;
}

export default function (): AstroIntegration;
