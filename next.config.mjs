/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://199.247.17.44:3001/:path*',
            },
        ];
    },
};

export default nextConfig;
