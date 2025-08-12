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
}));
