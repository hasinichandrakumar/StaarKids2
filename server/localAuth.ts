import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import type { Express } from "express";

// Configure local authentication strategy
export function setupLocalAuth() {
  // Local authentication strategy for username/password
  passport.use('local', new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password'
    },
    async (username: string, password: string, done) => {
      try {
        // Find user by username
        const user = await storage.getUserByUsername(username);
        
        if (!user) {
          return done(null, false, { message: 'Invalid username or password' });
        }

        // Check if user has local authentication enabled
        if (user.authMethod !== 'local' && user.authMethod !== 'both') {
          return done(null, false, { message: 'Please use Google sign-in for this account' });
        }

        // Verify password
        if (!user.passwordHash) {
          return done(null, false, { message: 'Account not set up for password login' });
        }

        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
          return done(null, false, { message: 'Invalid username or password' });
        }

        // Update last active timestamp
        await storage.updateUserLastActive(user.id);

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));
}

// Local authentication routes
export function registerLocalAuthRoutes(app: Express) {
  // Register new user with username/password
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { username, password, email, firstName, lastName, role = 'student', grade = 4 } = req.body;

      // Validation
      if (!username || !password || !email) {
        return res.status(400).json({ 
          success: false, 
          message: 'Username, password, and email are required' 
        });
      }

      if (password.length < 6) {
        return res.status(400).json({ 
          success: false, 
          message: 'Password must be at least 6 characters long' 
        });
      }

      // Check if username or email already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'Username already exists' 
        });
      }

      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email already registered' 
        });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 12);

      // Create user
      const newUser = await storage.createLocalUser({
        username,
        passwordHash,
        email,
        firstName: firstName || '',
        lastName: lastName || '',
        role,
        authMethod: 'local',
        currentGrade: role === 'student' ? grade : null
      });

      // If user is a student, create monitoring code
      if (role === 'student') {
        await storage.createStudentMonitoringCode(newUser.id);
      }

      res.json({
        success: true,
        message: 'Account created successfully',
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role
        }
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to create account' 
      });
    }
  });

  // Login with username/password
  app.post('/api/auth/login', (req, res, next) => {
    passport.authenticate('local', (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Authentication error' 
        });
      }
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: info?.message || 'Invalid credentials' 
        });
      }

      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ 
            success: false, 
            message: 'Login failed' 
          });
        }

        res.json({
          success: true,
          message: 'Login successful',
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            currentGrade: user.currentGrade,
            starPower: user.starPower
          }
        });
      });
    })(req, res, next);
  });

  // Check authentication status
  app.get('/api/auth/status', (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.user as any;
      res.json({
        isAuthenticated: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          currentGrade: user.currentGrade,
          starPower: user.starPower,
          authMethod: user.authMethod
        }
      });
    } else {
      res.json({ isAuthenticated: false });
    }
  });

  // Logout
  app.post('/api/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Logout failed' 
        });
      }
      res.json({ 
        success: true, 
        message: 'Logged out successfully' 
      });
    });
  });
}