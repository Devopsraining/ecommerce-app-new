// This file configures the webpack dev server middleware
// It replaces the deprecated onAfterSetupMiddleware and onBeforeSetupMiddleware options

module.exports = function(app) {
  // Add any custom middleware here if needed
  // Example: CORS, API proxy, custom logging, etc.
  
  // Log that dev server is configured
  console.log('[setupProxy] Dev server middleware configured');
};
