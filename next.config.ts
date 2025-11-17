
import type {NextConfig} from 'next';
import { config } from 'dotenv';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // This is the correct place to load environment variables for the Next.js server.
    // It ensures that the GEMINI_API_KEY is available for Genkit flows.
    ignoreBuildErrors: false, // You can set this to true if needed, but loading env here is key.
    ...(() => {
      config(); // Load environment variables from .env file
      return {};
    })(),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https'
        ,
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
