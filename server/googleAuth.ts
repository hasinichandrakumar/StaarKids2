import type { Express } from "express";
import { storage } from "./storage";

export function setupGoogleAuth(app: Express) {
  // Use the client ID that matches the Google Cloud Console configuration
  const clientId = "360300053613-74ena5t9acsmeq4fd5sn453nfcaovljq.apps.googleusercontent.com";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET_STAARKIDS!.trim();
  const redirectUri = "https://staarkids.org/api/oauth/google/callback";
  
  console.log("Setting up Google OAuth with environment variables");
  console.log("Client ID:", clientId);
  console.log("Redirect URI:", redirectUri);
  
  // Force override any existing Google OAuth routes by manipulating the router stack
  const forceOverrideRoute = (path: string, method: string = 'get') => {
    if (app._router && app._router.stack) {
      // Remove all existing handlers for this path
      const originalLength = app._router.stack.length;
      app._router.stack = app._router.stack.filter((layer: any) => {
        const isTargetRoute = layer.route && 
                             layer.route.path === path && 
                             layer.route.methods[method];
        const isGenericCallback = layer.route && 
                                 layer.route.path === '/api/callback' && 
                                 layer.route.methods[method];
        if (isTargetRoute || isGenericCallback) {
          console.log(`Forcefully removed conflicting ${method.toUpperCase()} route: ${layer.route.path}`);
          return false;
        }
        return true;
      });
      console.log(`Route cleanup: ${originalLength} -> ${app._router.stack.length} routes`);
    }
  };
  
  // Remove conflicting routes before adding our handlers
  forceOverrideRoute('/api/google/callback', 'get');
  
  // Google OAuth login route
  app.get("/auth/google/login", (req, res) => {
    console.log("=== GOOGLE OAUTH LOGIN ROUTE ===");
    
    const scope = encodeURIComponent("https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email");
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&access_type=offline&prompt=consent`;
    
    console.log("Auth URL:", authUrl);
    res.redirect(authUrl);
  });

  // Also provide the alternative route
  app.get("/api/auth/google", (req, res) => {
    console.log("=== GOOGLE OAUTH LOGIN ROUTE ===");
    
    const baseUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const authUrl = `${baseUrl}?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=profile%20email&access_type=offline&prompt=consent`;
    
    console.log("OAuth URL:", authUrl);
    res.redirect(authUrl);
  });

  // OAuth callback is handled in routes.ts - no callback handler here
}