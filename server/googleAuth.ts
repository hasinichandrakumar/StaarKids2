import type { Express } from "express";
import { storage } from "./storage";

export function setupGoogleAuth(app: Express) {
  const clientId = "360300053613-74ena5t9acsmeq4fd5sn453nfcaovljq.apps.googleusercontent.com";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET_STAARKIDS!.replace(/\s+/g, '');
  const redirectUri = "https://staarkids.org/api/auth/google/callback";
  
  console.log("Setting up Google OAuth with clean implementation");
  
  // Override any existing Google OAuth routes
  app.get("/api/auth/google", (req, res) => {
    console.log("=== CLEAN GOOGLE OAUTH ROUTE ACCESSED ===");
    console.log("Client ID:", clientId);
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'profile email',
      access_type: 'offline',
      prompt: 'consent'
    });
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    console.log("Clean OAuth URL:", authUrl);
    
    res.redirect(authUrl);
  });

  app.get("/api/auth/google/callback", async (req, res) => {
    const { code, error } = req.query;
    
    if (error) {
      console.error("OAuth error:", error);
      return res.redirect("/?error=oauth_error");
    }
    
    if (!code) {
      console.error("No authorization code received");
      return res.redirect("/?error=no_code");
    }

    try {
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
      
      if (!tokenResponse.ok) {
        console.error("Token exchange failed:", tokens);
        return res.redirect("/?error=token_exchange_failed");
      }

      // Get user profile
      const profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });

      const profile = await profileResponse.json();
      
      if (!profileResponse.ok) {
        console.error("Profile fetch failed:", profile);
        return res.redirect("/?error=profile_fetch_failed");
      }

      // Store user in database
      await storage.upsertUser({
        id: profile.id,
        email: profile.email || "",
        firstName: profile.given_name || "",
        lastName: profile.family_name || "",
        profileImageUrl: profile.picture || "",
      });

      // Create session (simplified - store user ID in session)
      (req.session as any).userId = profile.id;
      (req.session as any).user = {
        id: profile.id,
        email: profile.email,
        firstName: profile.given_name,
        lastName: profile.family_name,
      };

      console.log("User successfully authenticated:", profile.email);
      res.redirect("/");
      
    } catch (error) {
      console.error("OAuth callback error:", error);
      res.redirect("/?error=callback_error");
    }
  });
}