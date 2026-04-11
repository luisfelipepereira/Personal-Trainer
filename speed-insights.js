// Vercel Speed Insights initialization
// This script loads and initializes Speed Insights for the website

(function() {
  // Create the Speed Insights queue if it doesn't exist
  window.si = window.si || function () { 
    (window.siq = window.siq || []).push(arguments); 
  };

  // Load the Speed Insights script from CDN
  const script = document.createElement('script');
  script.defer = true;
  script.src = 'https://va.vercel-scripts.com/v1/speed-insights/script.js';
  
  // Add error handling
  script.onerror = function() {
    console.warn('Failed to load Vercel Speed Insights');
  };

  // Inject the script into the page
  document.head.appendChild(script);
})();
