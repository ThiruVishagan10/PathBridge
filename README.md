# PathBridge Portfolio Generator

A modern, AI-powered portfolio generator built with Next.js that creates personalized portfolio websites from user input.

## Project Objective

PathBridge simplifies portfolio creation by allowing users to input their personal information, skills, projects, and experience through an intuitive form interface. The application generates professional portfolio websites in multiple formats (HTML and code) that users can download and deploy.

## Features

- **Dynamic Form Interface**: Glass morphism design with video background
- **Authentication System**: Secure user authentication with middleware protection
- **Real-time Validation**: Form validation with scroll-to-field functionality
- **Multi-format Export**: Download portfolios as HTML or code files
- **Responsive Design**: Mobile-friendly interface with smooth animations
- **Social Integration**: LinkedIn and GitHub profile linking
- **Dynamic Sections**: Add/remove projects, experiences, and certifications

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, Framer Motion
- **Authentication**: Cookie-based authentication middleware
- **Backend Integration**: REST API communication with localhost:8000
- **Styling**: Glass morphism effects with backdrop blur

## Getting Started

1. **Install dependencies**:
```bash
npm install
# or
yarn install
```

2. **Run the development server**:
```bash
npm run dev
# or
yarn dev
```

3. **Start the backend server** (required for portfolio generation):
```bash
# Ensure your backend is running on localhost:8000
```

4. Open [http://localhost:3000](http://localhost:3000) to access the application.

## Project Structure

```
pathbridge/
├── src/
│   ├── app/
│   │   ├── auth/           # Authentication pages
│   │   └── page.js         # Main portfolio form
│   ├── components/
│   │   ├── Auth/           # Authentication components
│   │   └── portfolio/      # Portfolio form components
│   └── middleware.js       # Authentication middleware
├── public/
│   └── videos/             # Background video assets
└── README.md
```

## API Integration

The application communicates with a backend server running on `localhost:8000`:

- **POST /**: Submit portfolio data for generation
- **GET /download-txt**: Download portfolio as text/code
- **GET /download-html**: Download portfolio as HTML file

## Form Data Structure

```json
{
  "name": "string",
  "about": "string",
  "degree": "string",
  "collegeName": "string",
  "yearOfPassing": "string",
  "skills": "string",
  "linkedinUrl": "string",
  "githubUrl": "string",
  "projects": [{"name": "string", "description": "string"}],
  "experiences": [{"companyName": "string", "role": "string", "duration": "string"}],
  "certifications": ["string"]
}
```

## Key Components

- **PortfolioForm**: Main form component with dynamic field management
- **AuthForm**: Authentication interface with social login options
- **Middleware**: Route protection for authenticated users

## Deployment

Deploy on [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme):

```bash
npm run build
```

Ensure your backend API is accessible from the deployed environment.