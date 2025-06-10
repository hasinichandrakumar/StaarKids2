import express, { type Request, Response, NextFunction } from "express";
import { createServer, type IncomingMessage, type ServerResponse } from "http";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { startOAuthCallbackServer } from "./oauthCallbackServer";
import { URL } from "url";

const app = express();

// Static HTML page that handles OAuth callback 
app.get("/oauth-callback.html", (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>OAuth Callback - StaarKids</title>
      <meta charset="utf-8">
    </head>
    <body>
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
        <h2>Processing login...</h2>
        <p>Please wait while we complete your sign-in.</p>
      </div>
      <script>
        console.log('OAuth callback page loaded');
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        
        console.log('Code present:', !!code);
        console.log('Error:', error);
        
        if (error) {
          console.error('OAuth error:', error);
          window.location.href = '/?error=oauth_error';
        } else if (code) {
          console.log('Processing OAuth code...');
          // Send code to our backend for processing
          fetch('/api/oauth/process', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: code })
          })
          .then(response => response.json())
          .then(data => {
            console.log('OAuth processing result:', data);
            if (data.success) {
              window.location.href = '/?auth=success&email=' + encodeURIComponent(data.email);
            } else {
              window.location.href = '/?error=' + encodeURIComponent(data.error || 'processing_failed');
            }
          })
          .catch(error => {
            console.error('OAuth processing error:', error);
            window.location.href = '/?error=processing_failed';
          });
        } else {
          console.error('No code or error in callback');
          window.location.href = '/?error=no_code';
        }
      </script>
    </body>
    </html>
  `);
});

// CORS middleware
app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:5000",
    "https://staarkids.org",
    "https://replit.dev"
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: any = undefined;

  const originalSend = res.send;
  res.send = function (bodyContent, ...args) {
    try {
      capturedJsonResponse = JSON.parse(bodyContent);
    } catch {
      // Not JSON, ignore
    }
    return originalSend.call(this, bodyContent, ...args);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      log(
        `${req.method} ${path} ${res.statusCode} in ${duration}ms`,
        "express"
      );
      if (capturedJsonResponse) {
        log(`  Response: ${JSON.stringify(capturedJsonResponse)}`, "express");
      }
    }
  });

  next();
});

async function handleOAuthCallback(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url!, `https://${req.headers.host}`);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');
  
  console.log("=== RAW HTTP OAUTH CALLBACK INTERCEPTED ===");
  console.log("URL:", req.url);
  console.log("Code present:", !!code);
  console.log("Error:", error);
  
  if (error) {
    console.error("OAuth error:", error);
    res.writeHead(302, { Location: "/?error=oauth_error" });
    res.end();
    return;
  }
  
  if (!code) {
    console.error("No authorization code received");
    res.writeHead(302, { Location: "/?error=no_code" });
    res.end();
    return;
  }

  try {
    const clientId = "360300053613-74ena5t9acsmeq4fd5sn453nfcaovljq.apps.googleusercontent.com";
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET_STAARKIDS!.trim();
    const redirectUri = "https://staarkids.org/api/oauth/google/callback";

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
      res.writeHead(302, { Location: "/?error=token_exchange_failed" });
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
      res.writeHead(302, { Location: "/?error=user_info_failed" });
      res.end();
      return;
    }

    // Redirect with success and user email to verify OAuth is working
    console.log("OAuth flow completed successfully!");
    res.writeHead(302, { Location: `/?auth=success&email=${encodeURIComponent(googleUser.email)}` });
    res.end();
    
  } catch (error) {
    console.error("OAuth callback error:", error);
    res.writeHead(302, { Location: "/?error=callback_error" });
    res.end();
  }
}

async function main() {
  // Start dedicated OAuth callback server on port 3001
  startOAuthCallbackServer();
  
  const expressServer = await registerRoutes(app);

  // Create raw HTTP server that intercepts OAuth callbacks before Express
  const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    // Intercept OAuth callback at raw HTTP level
    if (req.url?.startsWith('/api/oauth/google/callback')) {
      await handleOAuthCallback(req, res);
      return;
    }
    
    // Pass all other requests to Express
    app(req, res);
  });

  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  const PORT = 5000;
  server.listen(PORT, "0.0.0.0", () => {
    log(`serving on port ${PORT}`);
  });
}

main();