import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import type { Express } from "express";
import { storage } from "./storage";

export function setupGoogleAuth(app: Express) {
  // Clean Google OAuth configuration
  const googleStrategy = new GoogleStrategy(
    {
      clientID: "360300053613-74ena5t9acsmeq4fd5sn453nfcaovljq.apps.googleusercontent.com",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET_STAARKIDS!.replace(/\s+/g, ''),
      callbackURL: "/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        await storage.upsertUser({
          id: profile.id,
          email: profile.emails?.[0]?.value || "",
          firstName: profile.name?.givenName || "",
          lastName: profile.name?.familyName || "",
          profileImageUrl: profile.photos?.[0]?.value || "",
        });
        
        const user = {
          id: profile.id,
          email: profile.emails?.[0]?.value,
          firstName: profile.name?.givenName,
          lastName: profile.name?.familyName,
        };
        
        return done(null, user);
      } catch (error) {
        return done(error as Error, false);
      }
    }
  );

  passport.use('google', googleStrategy);

  // Google OAuth routes
  app.get("/api/auth/google", 
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get("/api/auth/google/callback", (req, res, next) => {
    passport.authenticate("google", { 
      failureRedirect: "/" 
    }, (err, user, info) => {
      if (err) {
        console.error("OAuth error:", err);
        return res.redirect("/?error=oauth_error");
      }
      if (!user) {
        console.log("No user returned from OAuth");
        return res.redirect("/?error=auth_failed");
      }
      
      req.logIn(user, (err) => {
        if (err) {
          console.error("Login error:", err);
          return res.redirect("/?error=login_failed");
        }
        console.log("User successfully logged in:", user);
        res.redirect("/");
      });
    })(req, res, next);
  });
}