import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  preview: {
    allowedHosts: ["ubasfintrust.com"],
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Third-party vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react';
            if (id.includes('@radix-ui')) return 'radix';
            if (id.includes('recharts')) return 'charts';
            if (id.includes('@tanstack/react-query')) return 'query';
            if (id.includes('stripe')) return 'payments';
            if (id.includes('clsx') || id.includes('class-variance-authority') || id.includes('tailwind-merge') || id.includes('embla-carousel-react') || id.includes('sonner')) return 'ui';
            return 'vendor';
          }
          // Feature-based splitting for large app areas
          if (id.includes('/src/components/admin/')) return 'admin';
          if (id.includes('/src/components/investment/')) return 'investment';
          if (id.includes('/src/components/dashboard/')) return 'dashboard';
          if (id.includes('/src/components/analytics/')) return 'analytics';
          if (id.includes('/src/components/banking/')) return 'banking';
          if (id.includes('/src/components/notifications/')) return 'notifications';
          return undefined;
        }
      }
    }
  },
  plugins: [
    react(),
    // Resend API integration for event-based email notifications
    // Usage example:
    // import { Resend } from 'resend';
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // resend.emails.send({
    //   from: 'noreply@ubasfintrust.com',
    //   to: 'recipient@example.com',
    //   subject: 'Welcome to UBAS Financial Trust!',
    //   html: '<p>Your account has been created successfully.</p>'
    // });
    // You can also use 'alerts@ubasfintrust.com' for alert notifications.
    // Add RESEND_API_KEY to your .env.production file for security.
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Cloudflare Pages specific configuration
  // Use absolute root path in production to avoid asset 404s
  base: mode === 'production' ? '/' : './',
  publicDir: 'public',
}));
