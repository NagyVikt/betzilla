// next.config.mjs

// Use JSDoc to provide type information to editors/IDE.
// Next.js will not evaluate these at runtime, but TS-aware editors will pick up types.
/** 
 * @typedef {import('next').NextConfig} NextConfig
 * @typedef {import('webpack').Compiler} Compiler
 */

class VeliteWebpackPlugin {
  static started = false;

  /**
   * @param {Compiler} compiler
   */
  apply(compiler) {
    // Executed three times in Next.js: twice for server (Node.js/Edge runtime) and once for client
    compiler.hooks.beforeCompile.tapPromise(
      'VeliteWebpackPlugin',
      async () => {
        if (VeliteWebpackPlugin.started) return;
        VeliteWebpackPlugin.started = true;

        const dev = compiler.options.mode === 'development';
        // Dynamically import `velite` so it only loads when building
        // (ensure 'velite' is installed in your project)
        try {
          const { build } = await import('velite');
          await build({ watch: dev, clean: !dev });
        } catch (err) {
          console.error('Velite build failed:', err);
          // Optionally rethrow or swallow depending on your needs
        }
      }
    );
  }
}

/** @type {NextConfig} */
const nextConfig = {
  // If you need to customize React strict mode or experimental features, you can add them here:
  // reactStrictMode: true,
  // experimental: { ... },

  images: {
    // Example remote patterns; adjust as needed
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
        port: '', // no port
        pathname: '/**',
      },
    ],
  },

  // Remove console.* calls in production builds
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  webpack: (config, { webpack, dev, isServer }) => {
    // Inject the VeliteWebpackPlugin into the Webpack build
    config.plugins.push(new VeliteWebpackPlugin());

    // Optionally suppress certain warnings (e.g., dynamic import warnings in some dependencies)
    // Uncomment and adjust patterns if you want to silence specific warnings:
    /*
    config.ignoreWarnings = [
      {
        // Example: ignore webpack critical dependency warnings from opentelemetry
        message: /Critical dependency:/,
      },
      // Add other patterns or modules as needed
    ];
    */

    return config;
  },

  // You can also add other Next.js options here, e.g.:
  // env: {
  //   CUSTOM_ENV_VAR: process.env.CUSTOM_ENV_VAR,
  // },
  // redirects() { ... }, rewrites() { ... }, headers() { ... }, etc.
};

export default nextConfig;
