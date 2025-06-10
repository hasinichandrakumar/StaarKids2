import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// CRITICAL: Register OAuth callback FIRST, before any middleware - using api prefix to bypass Vite
app.get("/api/oauth-callback", async (req, res) => {
  console.log("=== ABSOLUTE PRIORITY OAUTH CALLBACK REACHED ===");
  console.log("Query params:", req.query);
  
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
    const clientId = "360300053613-74ena5t9acsmeq4fd5sn453nfcaovljq.apps.googleusercontent.com";
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET_STAARKIDS!.trim();
    const redirectUri = "https://staarkids.org/api/oauth-callback";

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
    console.log("Tokens received:", !!tokens.access_token);
    
    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", tokens);
      return res.redirect("/?error=token_exchange_failed");
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
    console.log("Google user info received:", !!googleUser.id);
    
    if (!userResponse.ok) {
      console.error("Failed to get user info:", googleUser);
      return res.redirect("/?error=user_info_failed");
    }

    // For now, just redirect with success - we'll integrate with session later
    console.log("OAuth flow completed successfully for user:", googleUser.email);
    res.redirect("/?auth=success&user=" + encodeURIComponent(googleUser.email));
    
  } catch (error) {
    console.error("OAuth callback error:", error);
    res.redirect("/?error=callback_error");
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

  // Register OAuth callback BEFORE any other middleware to avoid Vite interference
  app.get("/oauth/google/callback", async (req, res) => {
    console.log("=== PRIORITY OAUTH CALLBACK REACHED ===");
    console.log("Query params:", req.query);
    
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
      const clientId = "360300053613-74ena5t9acsmeq4fd5sn453nfcaovljq.apps.googleusercontent.com";
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET_STAARKIDS!.trim();
      const redirectUri = "https://staarkids.org/oauth/google/callback";

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
        return res.redirect("/?error=token_exchange_failed");
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
      console.log("Google user info:", googleUser);
      
      if (!userResponse.ok) {
        console.error("Failed to get user info:", googleUser);
        return res.redirect("/?error=user_info_failed");
      }

      // Create or update user in database
      const { storage } = await import("./storage");
      const user = await storage.upsertUser({
        id: googleUser.id,
        email: googleUser.email,
        firstName: googleUser.given_name || "",
        lastName: googleUser.family_name || "",
        profileImageUrl: googleUser.picture || "",
      });

      // Set session
      (req.session as any).userId = user.id;
      console.log("Session updated with user ID:", user.id);
      
      res.redirect("/");
    } catch (error) {
      console.error("OAuth callback error:", error);
      res.redirect("/?error=callback_error");
    }
  });

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
