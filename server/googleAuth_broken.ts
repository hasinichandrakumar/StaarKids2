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
  app.get("/api/oauth/google", (req, res) => {
    console.log("=== ALTERNATIVE GOOGLE OAUTH ROUTE ACCESSED ===");
    
    const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const authUrl = `${baseUrl}?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=profile%20email&access_type=offline&prompt=consent`;
    
    console.log("OAuth URL:", authUrl);
    res.redirect(authUrl);
  });

  // Remove conflicting callback handler - handled in routes.ts
//   // app.use("/api/google/callback", async (req, res, next) => {
//     console.log("=== GOOGLE OAUTH CALLBACK MIDDLEWARE REACHED ===");
//     console.log("Method:", req.method);
//     console.log("URL:", req.url);
//     console.log("Path:", req.path);
//     console.log("Query params:", req.query);
//     console.log("Session ID:", req.sessionID);
//     console.log("Session before auth:", req.session);
//     
//     if (req.method !== 'GET') {
//       return next();
//     }
//     
//     const { code, error } = req.query;
//     
//     if (error) {
//       console.error("OAuth error:", error);
//       return res.redirect("/?error=oauth_error");
//     }
//     
//     if (!code) {
//       console.error("No authorization code received");
//       return res.redirect("/?error=no_code");
//     }
// 
//     try {
//       // Exchange code for tokens
//       const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//         body: new URLSearchParams({
//           client_id: clientId,
//           client_secret: clientSecret,
//           code: code as string,
//           grant_type: "authorization_code",
//           redirect_uri: redirectUri,
//         }),
//       });
// 
//       const tokens = await tokenResponse.json();
//       
//       if (!tokenResponse.ok) {
//         console.error("Token exchange failed:", tokens);
//         return res.redirect("/?error=token_exchange_failed");
//       }
// 
//       // Get user profile
//       const profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
//         headers: {
//           Authorization: `Bearer ${tokens.access_token}`,
//         },
//       });
// 
//       const profile = await profileResponse.json();
//       
//       if (!profileResponse.ok) {
//         console.error("Profile fetch failed:", profile);
//         return res.redirect("/?error=profile_fetch_failed");
//       }
// 
//       // Store user in database
//       await storage.upsertUser({
//         id: profile.id,
//         email: profile.email || "",
//         firstName: profile.given_name || "",
//         lastName: profile.family_name || "",
//         profileImageUrl: profile.picture || "",
//       });
// 
//       // Create session (simplified - store user ID in session)
//       (req.session as any).userId = profile.id;
//       (req.session as any).user = {
//         id: profile.id,
//         email: profile.email,
//         firstName: profile.given_name,
//         lastName: profile.family_name,
//       };
// 
//       // Save session explicitly before redirecting
//       req.session.save((err) => {
//         if (err) {
//           console.error("Session save error:", err);
//           return res.redirect("/?error=session_save_failed");
//         }
//         console.log("User successfully authenticated and session saved:", profile.email);
//         console.log("Session ID:", req.sessionID);
//         console.log("Session data:", req.session);
        res.redirect("/");
      });
      
    } catch (error) {
      console.error("OAuth callback error:", error);
      res.redirect("/?error=callback_error");
    }
  });
}