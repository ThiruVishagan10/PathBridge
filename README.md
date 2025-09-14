# PathBridge - Alumni-Student Social Platform

## Overview
PathBridge is a **Next.js-based social media platform** connecting students with alumni for mentorship, job opportunities, and professional networking. Built with modern technologies including Next.js 14, PostgreSQL, Prisma, and TypeScript, featuring a sleek dark glassmorphism theme.

## Key Features

### 🎓 **Dual User Roles**
- **Students**: Create profiles, connect with alumni, apply for jobs, generate portfolios
- **Alumni**: Mentor students, post job opportunities, manage student connections

### 🌟 **Core Functionality**
- **Authentication**: Secure JWT-based authentication system
- **Profile Management**: Comprehensive user profiles with skills, interests, and achievements
- **Messaging System**: Real-time messaging between students and alumni
- **Job Board**: Alumni can post opportunities, students can apply with submissions
- **Mentorship**: Alumni can manage their student mentees with meeting scheduling
- **Portfolio Generation**: Students can create professional portfolios using templates
- **Social Features**: Follow system, notifications, and activity feeds

### 🎨 **Modern UI/UX**
- **Dark Glassmorphism Theme**: Elegant black/transparent backgrounds with backdrop blur effects
- **Responsive Design**: Optimized for desktop and mobile devices
- **Interactive Components**: Smooth animations and transitions
- **Accessibility**: WCAG compliant design patterns

## Technology Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Custom JWT implementation
- **File Upload**: UploadThing integration
- **Styling**: Tailwind CSS with ShadCN UI components
- **External Integration**: Python backend for portfolio generation

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (main)/            # Main application pages
│   │   ├── jobs/          # Job board functionality
│   │   ├── messages/      # Messaging interface
│   │   ├── my-mentor/     # Student mentor management
│   │   ├── my-students/   # Alumni student management
│   │   ├── notifications/ # Notification center
│   │   ├── profile/       # User profiles
│   │   └── refer/         # Referral system
│   └── api/               # API endpoints
├── actions/               # Server actions for data operations
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and configurations
└── prisma/               # Database schema and migrations
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Python backend (for portfolio generation)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd soap
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file:
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DATABASE_URL=postgresql://username:password@localhost:5432/pathbridge
UPLOADTHING_TOKEN=your-uploadthing-token
```

4. **Set up the database**
```bash
npx prisma migrate dev
npx prisma generate
```

5. **Start the development server**
```bash
npm run dev
```

6. **Build for production**
```bash
npm run build
npm start
```

## Features in Detail

### For Students
- **Profile Creation**: Add skills, interests, education details
- **Alumni Discovery**: Browse and connect with alumni from their institution
- **Job Applications**: Apply for positions with custom submissions
- **Portfolio Generation**: Create professional portfolios using AI-powered templates
- **Mentorship**: Connect with alumni mentors for guidance

### For Alumni
- **Student Management**: View and manage students from their institution
- **Job Posting**: Create job opportunities with detailed requirements
- **Mentorship Tools**: Schedule meetings and track student progress
- **Referral System**: Refer students for opportunities

### Admin Features
- **User Management**: Comprehensive user administration
- **Content Moderation**: Monitor and manage platform content
- **Analytics**: Track platform usage and engagement

## API Integration

The platform integrates with a Python backend for portfolio generation:
- **Template Selection**: `/api/template` - Forward template choices
- **Portfolio Generation**: External Python service for AI-powered portfolio creation

## Contributing

We welcome contributions! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository.