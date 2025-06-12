// next.config.mjs
import nextPwa from 'next-pwa';
import runtimeCaching from 'next-pwa/cache.js'; // ensure .js extension

/** @typedef {import('next').NextConfig} NextConfig */
/** @typedef {import('webpack').Compiler} Compiler */

// VeliteWebpackPlugin definition
class VeliteWebpackPlugin {
  static started = false;
  apply(compiler) {
    compiler.hooks.beforeCompile.tapPromise('VeliteWebpackPlugin', async () => {
      if (VeliteWebpackPlugin.started) return;
      VeliteWebpackPlugin.started = true;
      const devMode = compiler.options.mode === 'development';
      try {
        const { build } = await import('velite');
        await build({ watch: devMode, clean: !devMode });
      } catch (err) {
        console.error('Velite build failed:', err);
      }
    });
  }
}

/** @type {NextConfig} */
const baseConfig = {
  // Next.js image configuration (top-level)
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
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Remove console.* in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Custom Webpack adjustments
  webpack: (config, { dev, isServer }) => {
    config.plugins.push(new VeliteWebpackPlugin());
    return config;
  },
};

// Configure next-pwa: this returns a wrapper function
const withPWA = nextPwa({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  // Optionally include runtimeCaching. If issues arise, you can omit or adjust it.
  runtimeCaching,
});

// Wrap baseConfig with PWA plugin
const nextConfig = withPWA(baseConfig);

// Debug: log top-level keys to verify no numeric keys appear
console.log('DEBUG nextConfig keys:', Object.keys(nextConfig));

export default nextConfig;
