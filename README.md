# AI Chatbot

A modern, feature-rich AI chatbot application built with Next.js, TypeScript, Tailwind CSS, and powered by Claude AI with Supabase authentication.

## Features

✨ **Intelligent Chat Interface** - Real-time conversations with Claude AI  
🔐 **Secure Authentication** - Email/password authentication with Supabase  
💾 **Message History** - Persistent chat history stored in Supabase  
🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS & Framer Motion  
📱 **Fully Responsive** - Seamless experience across all devices  
🔒 **Protected Routes** - Middleware-based route protection  
⚡ **Fast Performance** - Built with Next.js 15 and optimized for speed

## Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS v4
- **UI Animations**: Framer Motion
- **Backend**: Supabase (PostgreSQL + Auth)
- **AI**: Claude API (Anthropic)
- **Icons**: React Icons
- **Type Safety**: TypeScript 5
- **Linting**: ESLint
- **Deployment**: Vercel-ready

## Project Structure

```
/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/                # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   │   ├── reset-password/
│   │   │   │   └── update-password/
│   │   │   └── chat/          # Chat API endpoint
│   │   ├── auth/              # Auth pages
│   │   │   ├── confirm/
│   │   │   └── update-password/
│   │   ├── chat/              # Chat interface
│   │   ├── login/             # Login page
│   │   ├── logout/            # Logout functionality
│   │   ├── private/           # Protected routes
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── lib/                    # Library functions
│   ├── utils/
│   │   └── supabase/          # Supabase utilities
│   │       ├── client.ts      # Client-side Supabase
│   │       ├── server.ts      # Server-side Supabase
│   │       └── middleware.ts  # Auth middleware
│   └── middleware.ts          # Next.js middleware
├── public/                     # Static assets
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── tailwind.config.ts        # Tailwind configuration
├── next.config.ts            # Next.js configuration
└── README.md                 # This file
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Supabase account
- Anthropic Claude API key

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd chatbot-01

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase and Claude API credentials
```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Claude API
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app will automatically redirect unauthenticated users to the login page.

## Usage

### Authentication

1. **Sign Up**: Create a new account with email and password
2. **Login**: Log in with your credentials
3. **Password Reset**: Use the password recovery feature if needed
4. **Protected Routes**: Access chat interface only when authenticated

### Chat Interface

- Type your message and press Enter to send
- View real-time conversation with Claude AI
- See message timestamps for each interaction
- Access message history from Supabase
- Logout to end your session

## API Routes

### Chat Endpoint
- **POST** `/api/chat` - Send a message and get AI response
  - Requires authentication
  - Stores messages in Supabase
  - Calls Claude API for responses

### Authentication Endpoints
- **POST** `/api/auth/reset-password` - Request password reset
- **POST** `/api/auth/update-password` - Update password with token
- **POST** `/auth/confirm` - Confirm email address
- **POST** `/auth/update-password` - Update password for logged-in users

## Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint
```

## Development Workflow

### Adding New Features

1. Create components in `src/app/` or `src/components/` (when needed)
2. Use TypeScript for type safety
3. Style with Tailwind CSS utility classes
4. Update API routes in `src/app/api/` if backend logic is needed
5. Ensure proper error handling and user feedback

### Database Schema

Key tables in Supabase:
- `auth.users` - User authentication (managed by Supabase)
- `messages` - Chat message history
  - `id` (uuid)
  - `user_id` (uuid, foreign key)
  - `text` (text)
  - `is_bot` (boolean)
  - `created_at` (timestamp)

### Authentication Flow

1. User signs up/logs in via login page
2. Supabase handles email/password validation
3. Session stored in secure cookie
4. Middleware validates session on protected routes
5. Unauthenticated users redirected to login

## Build Process

```bash
npm run build
```

The build process:
1. Compiles TypeScript to JavaScript
2. Optimizes Next.js pages and components
3. Minifies CSS and JavaScript
4. Generates static assets
5. Creates `.next` directory with production build

## Deployment

### Vercel (Recommended)

The project is configured for zero-config deployment on Vercel:

1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy! Vercel will automatically:
   - Install dependencies
   - Run build scripts
   - Deploy to production

### Manual Deployment

```bash
npm run build
npm run start
```

The application will run on `http://localhost:3000`

## Configuration Files

- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript compiler options
- `tailwind.config.ts` - Tailwind CSS customization
- `postcss.config.mjs` - PostCSS configuration
- `eslint.config.mjs` - ESLint rules

## Security Considerations

✅ **Authentication**: Supabase handles secure authentication  
✅ **Protected Routes**: Middleware validates session on all routes  
✅ **API Security**: Server-side API calls with authentication  
✅ **Environment Variables**: Sensitive keys stored in `.env.local`  
✅ **Type Safety**: TypeScript prevents common security issues  

## Troubleshooting

### Login Issues
- Verify Supabase credentials in `.env.local`
- Check email confirmation if required
- Clear browser cookies and try again

### Chat Not Working
- Ensure Claude API key is set in `.env.local`
- Check Supabase database connection
- Verify user is authenticated
- Check browser console for error messages

### Build Errors
- Clear `.next` directory: `rm -r .next`
- Reinstall dependencies: `rm -r node_modules && npm install`
- Check TypeScript errors: `npx tsc --noEmit`

## Performance Optimization

- ✨ Image optimization with Next.js Image component
- ⚡ Code splitting and lazy loading
- 🎯 Server-side rendering where beneficial
- 🔄 Incremental Static Regeneration (ISR)
- 📦 Optimized bundle size with tree-shaking

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Open source project. Feel free to use as a template for your own chatbot!

## Support

For issues, questions, or suggestions:
1. Check existing documentation
2. Review GitHub issues
3. Contact the development team

---

Built with ❤️ using Next.js, Supabase, and Claude AI
