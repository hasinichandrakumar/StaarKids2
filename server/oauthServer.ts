import express from "express";
import { createServer } from "http";

// Create a dedicated OAuth callback server that bypasses Vite
const oauthApp = express();
const oauthPort = 5001;

// Simple logging middleware
oauthApp.use((req, res, next) => {
  console.log(`[OAuth Server] ${req.method} ${req.url}`);
  next();
});

// OAuth callback handler
oauthApp.get("/oauth-callback", async (req, res) => {
  console.log("=== DEDICATED OAUTH SERVER CALLBACK ===");
  console.log("Query params:", req.query);
  
  const { code, error } = req.query;
  
  if (error) {
    console.error("OAuth error:", error);
    return res.redirect("https://staarkids.org/?error=oauth_error");
  }
  
  if (!code) {
    console.error("No authorization code received");
    return res.redirect("https://staarkids.org/?error=no_code");
  }

  try {
    const clientId = "360300053613-74ena5t9acsmeq4fd5sn453nfcaovljq.apps.googleusercontent.com";
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET_STAARKIDS!.trim();
    const redirectUri = "https://staarkids.org:5001/oauth-callback";

    console.log("Starting token exchange...");
    
    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: code as string,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    });

    const tokens = await tokenResponse.json();
    console.log("Token response status:", tokenResponse.status);
    
    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", tokens);
      return res.redirect("https://staarkids.org/?error=token_exchange_failed");
    }

    // Get user info
    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );

    const googleUser = await userResponse.json();
    console.log("Google user info received for:", googleUser.email);
    
    if (!userResponse.ok) {
      console.error("Failed to get user info:", googleUser);
      return res.redirect("https://staarkids.org/?error=user_info_failed");
    }

    // Store user session data (simplified for now)
    console.log("OAuth flow completed successfully!");
    
    // Redirect back to main app with auth success
    res.redirect("https://staarkids.org/?auth=success&user=" + encodeURIComponent(googleUser.email));
    
  } catch (error) {
    console.error("OAuth callback error:", error);
    res.redirect("https://staarkids.org/?error=callback_error");
  }
});

// Health check endpoint
oauthApp.get("/health", (req, res) => {
  res.json({ status: "ok", service: "oauth-callback" });
});

// Start the OAuth callback server
export function startOAuthServer() {
  const server = createServer(oauthApp);
  
  server.listen(oauthPort, () => {
    console.log(`OAuth callback server running on port ${oauthPort}`);
    console.log(`OAuth callback URL: https://staarkids.org:${oauthPort}/oauth-callback`);
  });
  
  return server;
}