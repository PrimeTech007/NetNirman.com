# Net Nirman Platform

A high-performance, AI-powered web and software development agency platform built with Next.js, MongoDB, and Neo-brutalism design.

## Features

- **Modern UI**: Neo-brutalism design with GSAP and Framer Motion animations.
- **Admin Dashboard**: Comprehensive dashboard to manage inquiries, projects, clients, and website content.
- **CMS Capabilities**: Manage services, testimonials, pricing plans, and site settings directly from the admin panel.
- **Authentication**: Secure admin authentication using NextAuth.js.
- **Project Tracking**: Kanban board for project management.
- **Responsive**: Fully optimized for all device sizes.

## Tech Stack

- **Frontend**: Next.js (App Router), Tailwind CSS, Framer Motion, GSAP, Phosphor Icons.
- **Backend**: Next.js API Routes, MongoDB with Mongoose.
- **Auth**: NextAuth.js (Auth.js v5).
- **Media**: Cloudinary for image management.

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database (local or Atlas)
- Cloudinary account

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd neobru
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env.local` and fill in your values.
   ```bash
   cp .env.example .env.local
   ```

4. Seed the database (optional but recommended for first setup):
   ```bash
   npm run seed
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment on Vercel

### 1. Prepare Environment Variables

Add the following environment variables to your Vercel project settings:

- `MONGODB_URI`: Your MongoDB connection string.
- `AUTH_SECRET`: A secret string for NextAuth (generate with `openssl rand -base64 32`).
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name.
- `CLOUDINARY_API_KEY`: Your Cloudinary API key.
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret.

### 2. Configure Build Settings

The project should use the default Next.js build settings:
- Framework Preset: **Next.js**
- Build Command: `npm run build`
- Output Directory: `.next`

### 3. Database Seeding

Once deployed, you can seed your production database by running the seed script locally with the production `MONGODB_URI`:

```bash
MONGODB_URI=your_production_mongodb_uri npm run seed
```

## License

Private. All rights reserved.
