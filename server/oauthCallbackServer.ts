import { createServer, type IncomingMessage, type ServerResponse } from "http";
import { URL } from "url";
import { storage } from "./storage";

// Dedicated OAuth callback server to bypass Vite interference
export function startOAuthCallbackServer() {
  const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    const url = new URL(req.url!, `http://localhost:3001`);
    
    console.log("=== DEDICATED OAUTH CALLBACK SERVER ===");
    console.log("URL:", req.url);
    
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      });
      res.end();
      return;
    }
    
    if (req.method === 'GET' && url.pathname === '/oauth/google/callback') {
      await handleGoogleCallback(req, res, url);
      return;
    }
    
    // Health check
    if (url.pathname === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'oauth-callback' }));
      return;
    }
    
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  });
  
  const PORT = 3001;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`OAuth callback server running on port ${PORT}`);
  });
  
  return server;
}

async function handleGoogleCallback(req: IncomingMessage, res: ServerResponse, url: URL) {
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');
  const state = url.searchParams.get('state');
  
  console.log("OAuth callback received:");
  console.log("- Code present:", !!code);
  console.log("- Error:", error);
  console.log("- State:", state);
  
  if (error) {
    console.error("OAuth error:", error);
    res.writeHead(302, { Location: "https://staarkids.org/?error=oauth_error" });
    res.end();
    return;
  }
  
  if (!code) {
    console.error("No authorization code received");
    res.writeHead(302, { Location: "https://staarkids.org/?error=no_code" });
    res.end();
    return;
  }

  try {
    const clientId = "360300053613-74ena5t9acsmeq4fd5sn453nfcaovljq.apps.googleusercontent.com";
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET_STAARKIDS!.trim();
    const redirectUri = "https://staarkids.org:3001/oauth/google/callback";

    console.log("Starting token exchange with Google...");
    
    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    });

    const tokens = await tokenResponse.json();
    console.log("Token response status:", tokenResponse.status);
    
    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", tokens);
      res.writeHead(302, { Location: "https://staarkids.org/?error=token_exchange_failed" });
      res.end();
      return;
    }

    console.log("Getting user info from Google...");
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
      res.writeHead(302, { Location: "https://staarkids.org/?error=user_info_failed" });
      res.end();
      return;
    }

    // Store user in database
    console.log("Creating/updating user in database...");
    const user = await storage.upsertUser({
      id: googleUser.id,
      email: googleUser.email,
      firstName: googleUser.given_name || googleUser.name?.split(' ')[0] || '',
      lastName: googleUser.family_name || googleUser.name?.split(' ').slice(1).join(' ') || '',
      profileImageUrl: googleUser.picture,
    });
    
    console.log("User stored successfully:", user.email);

    // For now, redirect with success and user info to verify OAuth is working
    console.log("OAuth flow completed successfully!");
    const redirectUrl = new URL("https://staarkids.org/");
    redirectUrl.searchParams.set("auth", "success");
    redirectUrl.searchParams.set("email", googleUser.email);
    redirectUrl.searchParams.set("name", googleUser.name || '');
    
    res.writeHead(302, { Location: redirectUrl.toString() });
    res.end();
    
  } catch (error) {
    console.error("OAuth callback error:", error);
    res.writeHead(302, { Location: "https://staarkids.org/?error=callback_error" });
    res.end();
  }
}