# Qpratik - English Learning Platform

**Production-ready English learning platform with real-time practice, AI tutor, and social features.**

## 🚀 Features

### Core Features
- ✅ **Authentication**: JWT + Refresh Token + Google OAuth + Email Verification
- ✅ **User Management**: Profile, Levels (A1-C2), XP System, Badges, Streaks
- ✅ **Learning Content**: Grammar, Vocabulary, Daily Expressions (by level)
- ✅ **Testing System**: Multiple choice, Fill blank, Listening questions + PDF Certificates
- ✅ **Practice Module**:
  - Random text chat matching by level
  - WebRTC video chat (FaceTime-like interface)
  - Real-time WebSocket communication
- ✅ **Friend System**: Add friends, Private chat, Practice invitations
- ✅ **AI Tutor**: Chat correction, Speaking evaluation (OpenAI integration)
- ✅ **Payment**: Stripe integration for subscriptions and credits
- ✅ **Notifications**: In-app + Push notification support
- ✅ **Admin Panel**: User management, Content management, Reports, Statistics
- ✅ **i18n**: Turkish and English language support
- ✅ **Themes**: Light and Dark mode
- ✅ **Security**: Rate limiting, Input validation, XSS/CSRF protection

### Technical Stack

**Backend:**
- NestJS + TypeScript
- PostgreSQL + Prisma ORM
- Redis (caching, online status, matching queue)
- Socket.IO (real-time chat)
- JWT authentication
- Stripe (payments)
- OpenAI (AI tutor)
- Nodemailer (emails)

**Frontend:**
- React + TypeScript
- Tailwind CSS
- React Router
- Zustand (state management)
- React i18next (localization)
- Socket.IO client (real-time)
- Axios (API calls)

**Infrastructure:**
- Docker + Docker Compose
- Nginx (reverse proxy + SSL ready)
- Production-ready configuration

## 📦 Installation

### Prerequisites
- Node.js >= 18
- Docker & Docker Compose
- PostgreSQL (or use Docker)
- Redis (or use Docker)

### Quick Start with Docker

1. **Clone and setup:**
```bash
cd Qpratik
cp .env.example .env
cp backend/.env.example backend/.env
```

2. **Configure environment variables:**
Edit `backend/.env` with your:
- Database credentials
- JWT secrets
- Google OAuth credentials
- SMTP settings
- OpenAI API key
- Stripe keys

3. **Start with Docker:**
```bash
docker-compose up -d
```

This will start:
- PostgreSQL (port 5432)
- Redis (port 6379)
- Backend (port 3001)
- Frontend (port 3000)
- Nginx (port 80)

4. **Run migrations and seed:**
```bash
cd backend
npm run prisma:migrate
npm run prisma:seed
```

5. **Access the application:**
- Frontend: http://localhost
- Backend API: http://localhost/api
- Admin login: `admin@qpratik.com` / `Admin123!`

### Local Development

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 🗄️ Database Schema

The application uses Prisma ORM with PostgreSQL. Key entities:

- **User**: Authentication, profile, levels, XP, subscriptions
- **Content**: Learning materials (Grammar, Vocabulary, Expressions)
- **Test & Question**: Tests and questions with various types
- **TestResult**: User test submissions and scores
- **Badge & UserBadge**: Achievement system
- **Friendship & FriendRequest**: Social connections
- **PrivateChat & Message**: Direct messaging
- **PracticeSession**: Practice matching and sessions
- **AITutorSession**: AI tutor conversations
- **Notification**: User notifications
- **Payment**: Payment history
- **Report**: User reports and moderation
- **AdminAction**: Admin activity logs

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/google` - Google OAuth
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/verify-email?token=` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update profile
- `GET /api/users/search?q=` - Search users
- `GET /api/users/leaderboard` - Get leaderboard
- `POST /api/users/block/:userId` - Block user
- `DELETE /api/users/block/:userId` - Unblock user

### Content
- `GET /api/content?level=&type=` - Get learning content
- `GET /api/content/:id` - Get specific content
- `GET /api/content/progress` - Get user progress
- `POST /api/content/:id/complete` - Mark content as complete

### Tests
- `GET /api/tests?level=` - Get available tests
- `GET /api/tests/:id` - Get test with questions
- `POST /api/tests/:id/submit` - Submit test answers
- `GET /api/tests/results` - Get user test results

### Friends
- `GET /api/friends` - Get friends list
- `GET /api/friends/requests` - Get pending requests
- `POST /api/friends/request/:userId` - Send friend request
- `POST /api/friends/accept/:requestId` - Accept request
- `DELETE /api/friends/reject/:requestId` - Reject request
- `DELETE /api/friends/:friendId` - Remove friend

### Chat
- `GET /api/chat` - Get all chats
- `POST /api/chat/create/:userId` - Create/get chat with user
- `GET /api/chat/:chatId/messages` - Get messages
- `POST /api/chat/:chatId/read` - Mark messages as read

### Practice
- `POST /api/practice/queue/join` - Join matching queue
- `DELETE /api/practice/queue/leave` - Leave queue
- `POST /api/practice/session/:sessionId/end` - End practice session

### AI Tutor
- `POST /api/ai-tutor/chat` - Chat with AI tutor
- `POST /api/ai-tutor/evaluate-speaking` - Evaluate speaking
- `GET /api/ai-tutor/sessions` - Get AI tutor history

### Payment
- `POST /api/payment/subscribe` - Create subscription
- `POST /api/payment/credits` - Purchase credits
- `POST /api/payment/webhook` - Stripe webhook (internal)

### Notifications
- `GET /api/notifications` - Get notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/read-all` - Mark all as read

### Admin (Requires ADMIN role)
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/users` - Get all users (paginated)
- `POST /api/admin/users/:userId/ban` - Ban user
- `POST /api/admin/users/:userId/unban` - Unban user
- `GET /api/admin/reports` - Get reports
- `PUT /api/admin/reports/:reportId` - Update report status
- `POST /api/admin/content` - Create content
- `PUT /api/admin/content/:id` - Update content
- `DELETE /api/admin/content/:id` - Delete content

## 🔌 WebSocket Events

### Practice Gateway (`/practice` namespace)
- `find-match` - Find practice partner
- `match-found` - Match found event
- `chat-message` - Send/receive chat messages
- `webrtc-offer` - WebRTC offer signal
- `webrtc-answer` - WebRTC answer signal
- `webrtc-candidate` - ICE candidate exchange

## 🚀 Deployment

### Production Deployment

1. **Build images:**
```bash
docker-compose build
```

2. **Start production:**
```bash
docker-compose up -d
```

3. **SSL Configuration:**
- Add SSL certificates to `nginx/ssl/`
- Update `nginx/nginx.conf` for HTTPS

### Environment Variables

Key environment variables needed:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/qpratik

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email
SMTP_PASSWORD=your-password

# OpenAI
OPENAI_API_KEY=your-openai-key

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_PUBLISHABLE_KEY=your-stripe-public
STRIPE_WEBHOOK_SECRET=your-webhook-secret

# URLs
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com
```

## 📱 Mobile App (Median.co)

To convert to mobile app using Median.co:

1. Deploy the web app to a public URL
2. Create Median.co account
3. Configure app settings:
   - URL: Your deployed frontend URL
   - Permissions: Camera, Microphone (on-demand)
   - Push notifications: Enabled
4. Build and publish to App Store/Play Store

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# E2E tests
npm run test:e2e
```

## 📝 License

This project is private and proprietary.

## 🤝 Support

For issues or questions, contact the development team.

---

## 🏗️ Project Structure

```
Qpratik/
├── backend/
│   ├── src/
│   │   ├── auth/          # Authentication module
│   │   ├── users/         # User management
│   │   ├── content/       # Learning content
│   │   ├── test/          # Testing system
│   │   ├── friends/       # Friend system
│   │   ├── chat/          # Private messaging
│   │   ├── practice/      # Practice matching
│   │   ├── notifications/ # Notifications
│   │   ├── payment/       # Stripe integration
│   │   ├── ai-tutor/      # AI tutor
│   │   ├── admin/         # Admin panel
│   │   ├── email/         # Email service
│   │   ├── upload/        # File uploads
│   │   ├── prisma/        # Database service
│   │   └── redis/         # Redis service
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   └── seed.ts        # Seed data
│   └── uploads/           # User uploads
├── frontend/
│   └── src/
│       ├── components/    # React components
│       ├── pages/         # Page components
│       ├── hooks/         # Custom hooks
│       ├── services/      # API services
│       ├── store/         # State management
│       ├── types/         # TypeScript types
│       └── i18n/          # Translations
├── nginx/
│   └── nginx.conf         # Nginx configuration
└── docker-compose.yml     # Docker orchestration
```

## ✨ Key Highlights

- **Production-Ready**: Complete, tested, and deployable
- **Scalable**: Microservices-ready architecture
- **Secure**: Industry-standard security practices
- **Real-time**: WebSocket and WebRTC integration
- **International**: Full i18n support (TR/EN)
- **Modern Stack**: Latest versions of all technologies
- **Mobile-Ready**: Responsive design + Median.co compatible
- **Monetization**: Built-in subscription and payment system
- **AI-Powered**: OpenAI integration for tutoring
- **Social**: Friend system, chat, practice together

---

**Built with ❤️ for English learners worldwide**
