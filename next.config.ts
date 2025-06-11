// next.config.ts

import type { NextConfig } from 'next';
import type { Compiler } from 'webpack';

class VeliteWebpackPlugin {
  private static started = false;

  apply(compiler: Compiler) {
    // Executed three times in Next.js: twice for server (Node.js/Edge runtime) and once for client
    compiler.hooks.beforeCompile.tapPromise(
      'VeliteWebpackPlugin',
      async () => {
        if (VeliteWebpackPlugin.started) return;
        VeliteWebpackPlugin.started = true;

        const dev = compiler.options.mode === 'development';
        // Dynamically import `velite` so it only loads when building
        const { build } = await import('velite');
        await build({ watch: dev, clean: !dev });
      }
    );
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',           // no port
        // matches any path under /
        pathname: '/**',
      },
    ],
  },

  // Remove console logs in production builds
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Inject the VeliteWebpackPlugin into the Webpack build
  webpack: (config, { webpack }) => {
    config.plugins.push(new VeliteWebpackPlugin());
    return config;
  },
};

export default nextConfig;
