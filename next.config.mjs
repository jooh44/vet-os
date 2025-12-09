/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    // bmad-core uses strict mode by default
    reactStrictMode: true,
    experimental: {
        serverActions: {
            bodySizeLimit: '50mb',
        },
    },
};

export default nextConfig;
