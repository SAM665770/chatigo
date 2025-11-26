📱 **Chatigo** - "Connecting people, one message at a time." 💬
=========================

📖 Description
---------------
I built Chatigo as a real-time chat app that actually feels good to use. You know how most messaging apps either look boring or feel clunky? I wanted to fix that. So I went with a dark theme (because who doesn't love dark mode) and added these cool animated gradient borders that make the whole thing pop.

The typing sounds were honestly just for fun at first, but they turned out to be surprisingly satisfying. You can toggle them off if they annoy you though. I also made sure you can see who's online without having to guess, and sharing images is as simple as drag-and-drop.

Tech-wise, I used React 19 with Zustand because Redux felt like overkill for this. TailwindCSS + daisyUI made the styling way easier than writing custom CSS for everything. The backend is pretty straightforward - Express with MongoDB, Socket.IO for the real-time stuff, and I threw in some security features because, well, security matters.

Oh, and I added optimistic updates so your messages show up instantly even if your internet is being slow. Little things like that make a big difference in how the app feels to use.

✨ Features
----------------
* **Real-time messaging**: Instant messaging with Socket.IO, optimistic UI updates, and message history
* **User authentication**: JWT-based auth with HTTP-only cookies and bcrypt password hashing
* **Online status**: Live online/offline indicators for all users
* **Image sharing**: Drag-and-drop image uploads with Cloudinary storage and preview
* **Sound effects**: Customizable keyboard sounds and notification audio
* **Tabbed interface**: Switch between active chats and all contacts
* **Profile management**: Update profile pictures with real-time preview
* **Welcome emails**: Automated welcome emails via Resend with custom templates
* **Security**: Arcjet protection with rate limiting, bot detection, and shield protection
* **Responsive design**: Mobile-first design with animated gradient borders
* **Persistent preferences**: Sound settings saved to localStorage

🧰 Tech Stack Table
-------------------
| Category | Technology | Purpose |
| --- | --- | --- |
| **Frontend** | React 19, Vite | Modern UI framework with fast dev server |
| **State Management** | Zustand | Lightweight state management |
| **Styling** | TailwindCSS, daisyUI | Utility-first CSS with component library |
| **Icons** | Lucide React | Beautiful SVG icons |
| **HTTP Client** | Axios | API requests with interceptors |
| **Routing** | React Router v7 | Client-side routing |
| **Notifications** | React Hot Toast | Toast notifications |
| **Backend** | Node.js, Express | Server runtime and web framework |
| **Real-time** | Socket.IO | WebSocket communication |
| **Database** | MongoDB, Mongoose | NoSQL database with ODM |
| **Storage** | Cloudinary | Image upload and optimization |
| **Email** | Resend | Transactional email service |
| **Security** | Arcjet, JWT, bcryptjs | Rate limiting, auth, password hashing |
| **Dev Tools** | ESLint, Prettier, Nodemon | Code quality and development |

📁 Project Structure
---------------------
```
Chatigo/
├── backend/
│   ├── src/
│   │   ├── controllers/          # Request handlers
│   │   │   ├── auth.controllers.js
│   │   │   └── messages.controllers.js
│   │   ├── lib/                  # Utility libraries
│   │   │   ├── arcjet.js         # Security configuration
│   │   │   ├── cloudinary.js     # Image upload setup
│   │   │   ├── db.js             # MongoDB connection
│   │   │   ├── env.js            # Environment variables
│   │   │   ├── resend.js         # Email service
│   │   │   ├── socket.js         # Socket.IO setup
│   │   │   └── utils.js          # JWT utilities
│   │   ├── middlewares/          # Express middlewares
│   │   │   ├── arcjet.middlewares.js
│   │   │   ├── auth.middlewares.js
│   │   │   └── socket.auth.middlewares.js
│   │   ├── models/               # Mongoose schemas
│   │   │   ├── Message.js
│   │   │   └── User.js
│   │   ├── routes/               # API routes
│   │   │   ├── auth.routes.js
│   │   │   └── messages.routes.js
│   │   ├── emails/               # Email templates
│   │   │   ├── emailHandlers.js
│   │   │   └── emailTemplate.js
│   │   └── server.js             # Express app setup
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/           # React components
    │   ├── hooks/               # Custom hooks
    │   ├── lib/                 # Axios configuration
    │   ├── pages/               # Page components
    │   ├── store/               # Zustand stores
    │   │   ├── useAuthStore.js  # Authentication state
    │   │   └── useChatStore.js  # Chat state
    │   └── main.jsx
    ├── public/                  # Static assets
    │   └── sounds/              # Audio files
    └── package.json
```

⚙️ How to Run
----------------

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Cloudinary account
- Resend account
- Arcjet account

### Backend Setup
1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create `.env` file** with the following variables:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Resend
   RESEND_API_KEY=your_resend_api_key
   EMAIL_FROM=noreply@yourdomain.com
   EMAIL_FROM_NAME="Chatigo Team"
   
   # Arcjet
   ARCJET_KEY=your_arcjet_key
   ARCJET_ENV=development
   ```

4. **Start the backend**:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the frontend**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:5173`

### Production Build
```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && npm start
```

🔧 Key Implementation Details
-----------------------------

### State Management (Zustand)
- **useAuthStore**: Manages authentication, socket connections, and online users
- **useChatStore**: Handles messages, contacts, active tabs, and sound preferences
- Persistent storage for user preferences (sound settings)

### Real-time Features
- Socket.IO authentication middleware validates JWT tokens
- Online/offline status tracking with automatic updates
- Optimistic UI updates for instant message feedback
- Real-time message delivery with sound notifications

### Security Features
- Arcjet protection: Rate limiting (100 req/min), bot detection, shield protection
- JWT tokens stored in HTTP-only cookies
- Password hashing with bcrypt (salt rounds: 10)
- Input validation and sanitization

### UI/UX Features
- Animated gradient borders with CSS custom properties
- Dark theme with cyan accent colors
- Responsive design with TailwindCSS
- Sound effects for typing and notifications
- Image preview before sending
- Escape key to close chat windows

### Performance Optimizations
- Vite for fast development and building
- Lazy loading of audio files
- Optimistic updates for better UX
- Efficient re-renders with Zustand

📸 Screenshots
--------------

### Login Page
![Login Page](./frontend\public\screenshots\login-page.png)

### Sign Up Page
![Sign Up Page](./frontend\public\screenshots\sign-up-page.png)

### Chat Interface
![Chat Interface](./frontend\public\screenshots\chat-page.png)

### Contacts Tab
![Contacts Tab](./frontend\public\screenshots\contacts-page.png)


📦 API Endpoints
-----------------

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `PUT /api/auth/update-profile` - Update profile picture
- `GET /api/auth/check` - Verify authentication

### Messages
- `GET /api/messages/contacts` - Get all users
- `GET /api/messages/chats` - Get chat partners
- `GET /api/messages/:id` - Get messages with specific user
- `POST /api/messages/send/:id` - Send message to user

👤 Author
----------
Samridh Palleda

📝 License
-----------
ISC License