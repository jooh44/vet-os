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
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
