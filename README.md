# Content Management System

A Next.js-based Content Management System with authentication, file management, and role-based access control.

## Features

- User authentication with different roles (admin, regular user)
- Admin dashboard for uploading/managing files
- Regular users can browse and download files
- File categorization and search
- Usage analytics

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas
- **Authentication**: JWT + NextAuth.js
- **File Storage**: AWS S3
- **Styling**: Tailwind CSS

## Prerequisites

- Node.js 18.x or later
- MongoDB Atlas account
- AWS account with S3 access
- npm or yarn package manager

## Getting Started

1. Clone the repository:

```bash
git clone <your-repo-url>
cd <project-directory>
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add the following variables:

```env
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_bucket_name
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
├── lib/                # Utility functions and configurations
├── models/             # MongoDB models
├── types/              # TypeScript type definitions
└── utils/              # Helper functions
```

## API Routes

- `/api/auth/*` - Authentication endpoints
- `/api/files/*` - File management endpoints
- `/api/users/*` - User management endpoints

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
