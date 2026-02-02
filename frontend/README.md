# Todo App Frontend

A modern Next.js 16+ frontend with Better Auth for the multi-user Todo application.

## Features

- User authentication (signup/signin) with Better Auth
- JWT token-based authentication
- Complete task management (CRUD operations)
- Responsive design (mobile-first)
- Real-time task updates
- Protected routes with middleware
- Clean separation of concerns (UI, API, Auth)

## Tech Stack

- **Framework**: Next.js 16+ with App Router
- **Authentication**: Better Auth with JWT plugin
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Database**: SQLite (for auth)

## Project Structure

```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/        # Login page
│   │   └── signup/       # Signup page
│   ├── api/
│   │   └── auth/         # Better Auth API routes
│   ├── layout.tsx        # Root layout with AuthProvider
│   └── page.tsx          # Task dashboard (home)
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── LogoutButton.tsx
│   └── providers/
│       └── AuthProvider.tsx
├── lib/
│   ├── auth.ts           # Better Auth server config
│   └── auth-client.ts    # Better Auth client instance
├── services/
│   └── api.ts            # Backend API communication layer
├── middleware.ts         # Route protection middleware
└── .env.local            # Environment variables
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
DATABASE_URL=file:./auth.db
BETTER_AUTH_SECRET=your-secret-key-minimum-32-characters-long
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | SQLite database for auth | `file:./auth.db` |
| `BETTER_AUTH_SECRET` | Secret key for JWT signing (min 32 chars) | - |
| `NEXT_PUBLIC_APP_URL` | Frontend URL | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` |

## Authentication Flow

1. User signs up or logs in via Better Auth
2. Better Auth creates a session and issues a JWT token
3. Frontend includes JWT in `Authorization: Bearer <token>` header for API calls
4. Backend validates JWT and returns user-specific data
5. Middleware protects routes requiring authentication

## API Integration

The frontend communicates with the backend via the service layer in `services/api.ts`:

- `taskApi.list()` - Get all tasks
- `taskApi.create(data)` - Create a new task
- `taskApi.update(id, data)` - Update a task
- `taskApi.delete(id)` - Delete a task
- `taskApi.toggleComplete(id)` - Toggle completion status

All API calls automatically include JWT authentication.

## Security Features

- JWT tokens stored in httpOnly cookies
- Route protection via middleware
- Input validation on forms
- XSS prevention via React's built-in escaping
- No secrets in frontend code
- Secure token handling

## Responsive Design

The UI is mobile-first and works on:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktops (1024px+)

## Accessibility

- Semantic HTML elements
- Keyboard navigation support
- ARIA labels on interactive elements
- Proper focus management
- Color contrast meeting WCAG AA standards

## Development Notes

- Uses App Router (Next.js 13+)
- Client components marked with "use client"
- Server components for auth configuration
- Middleware for route protection
- Tailwind CSS for styling

## Build for Production

```bash
npm run build
npm start
```

## License

MIT
