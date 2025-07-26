import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// import { initBotDetection, performRuntimeChecks } from './lib/botDetection'

// Initialize bot detection immediately (DISABLED FOR DEMO)
// initBotDetection();
// performRuntimeChecks();

createRoot(document.getElementById("root")!).render(<App />);
