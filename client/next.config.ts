import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:3000/api/:path*',
            },
            {
                source: '/images/:path*',
                destination: 'http://localhost:3000/images/:path*',
            },
        ];
    },
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3000',
            },
            {
                protocol: 'https',
                hostname: 'cards.scryfall.io',
            },
            {
                protocol: 'https',
                hostname: 'images.ygoprodeck.com',
            },
        ],
    },
};

export default nextConfig;
