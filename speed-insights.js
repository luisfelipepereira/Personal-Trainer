// Vercel Speed Insights initialization using official package
// Import and inject Speed Insights for performance tracking
import { injectSpeedInsights } from './node_modules/@vercel/speed-insights/dist/index.mjs';

// Initialize Speed Insights
// This will automatically track web vitals and performance metrics
injectSpeedInsights();
