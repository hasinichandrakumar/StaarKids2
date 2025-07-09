# StaarKids Platform

## Overview

StaarKids is a comprehensive web-based educational platform designed to help Texas students in grades 3-5 prepare for STAAR (State of Texas Assessments of Academic Readiness) tests. The platform combines authentic STAAR test questions from 2013-2025 with AI-powered question generation, personalized learning paths, and gamification elements to create an engaging educational experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18+ with TypeScript**: Modern, type-safe frontend development
- **Vite Build System**: Fast development server and optimized production builds
- **Wouter Routing**: Lightweight client-side routing
- **TanStack Query v5**: Server state management and caching
- **Shadcn/UI Components**: Design system built on Radix UI primitives with Tailwind CSS
- **Responsive Design**: Mobile-first approach supporting devices from 320px to 4K displays

### Backend Architecture
- **Node.js 18+ with Express**: RESTful API server with TypeScript
- **PostgreSQL Database**: Enterprise-grade data storage with connection pooling
- **Drizzle ORM**: Type-safe database operations and schema management
- **Dual Authentication**: Supports both Google OAuth 2.0 and Replit authentication
- **Session Management**: Secure session handling with PostgreSQL-backed storage

### AI Integration
- **OpenAI GPT-4o with Vision**: Advanced question generation learning from authentic STAAR test documents
- **Authentic Pattern Learning**: AI analyzes real STAAR test images (2013-2019) to extract question patterns, visual elements, and language structures
- **Document-Based Generation**: Questions generated using learned patterns from actual Texas state assessments
- **Universal Visual System**: Fully integrated SVG generation for ALL math questions with 15+ diagram types
- **Template-Based Generation**: Fast, deterministic question creation for offline use (0.1ms per question)
- **Visual Enhancement Integration**: All question generators automatically enhanced with appropriate visual elements
- **Adaptive Learning**: AI-powered personalized learning paths based on authentic STAAR data

## Key Components

### Authentication System
- **Google OAuth 2.0**: Primary authentication method for students, parents, and teachers
- **Replit Authentication**: Alternative authentication for development environment
- **Role-Based Access**: Different permission levels for students, parents, teachers, and administrators
- **COPPA/FERPA Compliance**: Meets educational privacy requirements

### Question Management
- **Authentic STAAR Archive**: Complete collection of questions from 2013-2025 including PDF documents and extracted images
- **AI Document Analyzer**: Uses OpenAI Vision to analyze authentic STAAR test images and extract patterns
- **Pattern-Based Generation**: Creates unlimited practice questions using learned patterns from real STAAR tests
- **Template System**: Fast, offline question generation using predefined patterns
- **TEKS Standards Alignment**: All questions mapped to Texas Essential Knowledge and Skills
- **Universal Visual Support**: Fully integrated SVG diagrams for ALL math questions with authentic STAAR styling and automatic visual enhancement

### Assessment Engine
- **Practice Mode**: Unlimited question practice with immediate feedback
- **Mock Examinations**: Full-length STAAR-style tests (6 per grade/subject)
- **Progress Tracking**: Detailed analytics by skill domain and TEKS standard
- **Adaptive Difficulty**: Questions adjust based on student performance

### Gamification System
- **Star Power Points**: Earned through practice, tests, and achievements
- **Avatar Customization**: 5 character options (Bunny, Fox, Turtle, Starfish, Giraffe) with color variants
- **Achievement Badges**: Unlocked through milestones and consistent practice
- **Progress Visualization**: Visual feedback on learning journey

## Data Flow

1. **User Authentication**: Google OAuth flow creates/updates user profiles
2. **Question Selection**: AI or template system generates questions based on grade/subject/TEKS
3. **Practice Session**: Students answer questions with immediate feedback and explanations
4. **Progress Recording**: Performance data stored with TEKS alignment for analytics
5. **Adaptive Adjustment**: System adjusts difficulty and question selection based on performance
6. **Progress Reports**: Detailed analytics available to students, parents, and teachers

## External Dependencies

### Core Services
- **OpenAI API**: GPT-4 for question generation and explanation creation
- **Google OAuth**: Authentication and user profile management
- **Neon Database**: PostgreSQL hosting for production environment
- **Replit Environment**: Development and hosting platform

### Frontend Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library for consistent iconography
- **React Hook Form + Zod**: Type-safe form validation
- **Framer Motion**: Animation and micro-interactions

### Backend Dependencies
- **Express.js**: Web application framework
- **Passport.js**: Authentication middleware
- **Connect-PG-Simple**: PostgreSQL session storage
- **Drizzle Kit**: Database migration management

## Deployment Strategy

### Development Environment
- **Replit Hosting**: Integrated development and hosting platform
- **Hot Reload**: Instant code updates during development
- **Environment Variables**: Secure configuration management
- **Database Provisioning**: Automatic PostgreSQL database setup

### Production Considerations
- **Scalable Architecture**: Supports thousands of concurrent users
- **Database Optimization**: Connection pooling and query optimization
- **CDN Integration**: Fast content delivery for static assets
- **Monitoring**: Real User Monitoring (RUM) for performance tracking
- **Backup Strategy**: Daily automated backups with point-in-time recovery

### Security Features
- **HTTPS/TLS Encryption**: All communication encrypted
- **Session Security**: Automatic logout and secure token management
- **Data Privacy**: Minimal data collection with COPPA/FERPA compliance
- **SQL Injection Prevention**: Parameterized queries through Drizzle ORM
- **CORS Configuration**: Proper cross-origin request handling

The platform is designed to be educational-first, prioritizing student engagement and learning outcomes while maintaining enterprise-grade security and reliability standards required for educational technology.