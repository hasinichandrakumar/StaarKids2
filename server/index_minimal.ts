import express, { type Request, Response, NextFunction } from "express";
import { createServer, type IncomingMessage, type ServerResponse } from "http";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

import { URL } from "url";

const app = express();

// Express middleware for handling OAuth processing before Vite
app.use('/api', express.json());

// Special auth processing endpoint that bypasses Vite
app.get('/auth-process', async (req, res) => {
  console.log("=== DIRECT OAUTH PROCESSING ===");
  const { code } = req.query;
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (!code || typeof code !== 'string') {
    console.error("No authorization code provided");
    return res.redirect('/?error=no_code');
  }

  try {
    const clientId = "360300053613-74ena5t9acsmeq4fd5sn453nfcaovljq.apps.googleusercontent.com";
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET_STAARKIDS!.trim();
    const redirectUri = "https://staarkids.org/?callback=google";

    console.log("Starting token exchange with Google...");
    
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
      return res.json({ success: false, error: "token_exchange_failed" });
    }

    console.log("Getting user info from Google...");
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
      return res.json({ success: false, error: "user_info_failed" });
    }

    // Store user in database
    const { storage } = require('./storage');
    
    let user = await storage.getUserByEmail(googleUser.email);
    if (!user) {
      console.log("Creating new user:", googleUser.email);
      user = await storage.createUser({
        email: googleUser.email,
        firstName: googleUser.given_name || '',
        lastName: googleUser.family_name || '',
        role: 'student',
        currentGrade: 3,
        starPower: 0,
        avatarType: 'bunny',
        avatarColor: '#3B82F6',
        googleId: googleUser.id
      });
    } else {
      console.log("Existing user found:", user.email);
    }

    console.log("OAuth processing completed successfully");
    return res.json({ 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });

  } catch (error) {
    console.error("OAuth processing error:", error);
    return res.json({ success: false, error: "processing_failed" });
  }
});

async function main() {
  const server = createServer(app);

  console.log("🚀 Setting up basic StaarKids server without AI systems...");
  
  // Initialize database storage only
  console.log("📁 Initializing database storage...");
  
  // Register API routes without AI initialization
  registerRoutes(app);
  console.log("🔧 API routes registered successfully");
  
  // Setup Vite for development
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const PORT = parseInt(process.env.PORT || "5000", 10);
  server.listen(PORT, "0.0.0.0", () => {
    log(`serving on port ${PORT}`);
    console.log("✅ StaarKids server is running (minimal mode)");
  });
}

main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});