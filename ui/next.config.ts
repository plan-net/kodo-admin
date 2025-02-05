import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // todo: this should be removed after types fixed
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
