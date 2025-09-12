# Next.js - Social Media

## Overview
This repository contains a **Next.js-based social media application** built using the App Router, PostgreSQL, Prisma, Clerk authentication, and TypeScript. It serves as a learning project for understanding **modern full-stack development** using Next.js 14.

## Project Structure

```
nextjs-course/
│-- app/               # Application logic with Next.js App Router
│   ├── layout.tsx     # Main layout component
│   ├── page.tsx       # Home page with dynamic content fetching
│   ├── profile/       # User profile pages
│   ├── api/           # API route handlers for database interactions
│   ├── auth/          # Authentication-related routes (Clerk)
│-- components/        # Reusable UI components
│-- lib/               # Utility functions (database, authentication, helpers)
│-- prisma/            # Database schema and migrations
│-- styles/            # Tailwind CSS configuration
│-- public/            # Static assets
│-- .env               # Environment variables for API keys
│-- package.json       # Dependencies and scripts
```

## Technologies Used
- **Next.js 14** (App Router, Server Actions, Server Components)
- **PostgreSQL** (Relational database for storing user & post data)
- **Prisma ORM** (Type-safe database management)
- **Clerk Authentication** (User authentication and session management)
- **UploadThing** (File uploads for user images)
- **Tailwind CSS & ShadCN** (Modern styling and UI components)

## Main Features
- **Authentication**: User sign-up/sign-in via Clerk
- **Profile Management**: Users can update their profile details
- **Post System**: Users can create, edit, and delete posts
- **Likes & Comments**: Interaction features for social engagement
- **Optimistic UI Updates**: Real-time updates using server actions
- **API Handlers**: Efficient data fetching and caching strategies

## Getting Started
### 1. Clone the Repository
```bash
git clone https://github.com/sug2004/social_media.git
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file and add the necessary API keys:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
DATABASE_URL=
UPLOADTHING_TOKEN=
```

### 4. Run Database Migrations
```bash
npx prisma migrate dev
```

### 5. Start the Development Server
```bash
npm run dev
```

## Contribution
Feel free to fork this repository and submit pull requests for improvements.

## License
This project is licensed under the MIT License.

