# Chat App MERN

A full-stack real-time chat application built with the MERN stack. It provides authentication, one-to-one messaging, media uploads, and live online presence updates.

## Tech Stack

- **Frontend:** React 19 with Vite, Tailwind CSS, DaisyUI, Zustand for state management, React Router, React Hot Toast, Socket.IO client.
- **Backend:** Node.js, Express 5, Socket.IO server, MongoDB with Mongoose, JWT authentication, bcrypt, Cloudinary SDK.
- **Tooling:** ESLint, Prettier, Nodemon (development), Vite build tooling.

## How the Project Works

1. Users create accounts and authenticate via email/password. Passwords are hashed with bcrypt.
2. Authenticated users receive a signed JWT stored in an HTTP-only cookie so that subsequent requests remain authenticated.
3. The backend exposes REST endpoints for auth and messaging. Data is persisted in MongoDB.
4. Socket.IO keeps track of connected users and emits real-time events (`getOnlineUsers`, `newMessage`) so chat conversations update instantly across clients.
5. When users send images, they are uploaded to Cloudinary and the resulting URL is saved with the message record.

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9
- A MongoDB instance (local or hosted)
- A Cloudinary account for storing uploaded images

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/petchgnz/chat-app-mern.git
   cd chat-app-mern
   ```
2. **Install dependencies**
   ```bash
   npm install --prefix backend
   npm install --prefix frontend
   ```

### Environment Variables

Create a `backend/.env` file with the following values (do **not** commit this file to source control):

| Variable | Description |
| --- | --- |
| `PORT` | Port for the Express/Socket.IO server (the frontend expects `3001` in development). |
| `MONGODB_URI` | Connection string for MongoDB. |
| `JWT_SECRET` | Secret used to sign JWT cookies. |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name. |
| `CLOUDINARY_API_KEY` | Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret. |
| `NODE_ENV` | Set to `development` or `production` (optional, affects cookie security and static file serving). |

If you need the actual values used in development, let me know and I can provide the `.env` contents separately.

### Running the Project Locally

1. **Start the backend server** (listens on the port defined in `.env`, e.g., 3001):
   ```bash
   npm run dev --prefix backend
   ```
2. **Start the frontend development server** in a separate terminal (Vite defaults to port 5173):
   ```bash
   npm run dev --prefix frontend
   ```
3. Open your browser to `http://localhost:5173`. The frontend will proxy API requests and socket connections to `http://localhost:3001` during development.

### Building for Production

To create a production build of the frontend (served by Express when `NODE_ENV=production`):
```bash
npm run build --prefix frontend
npm start --prefix backend
```
The backend serves the built assets from `frontend/dist` and continues handling API and Socket.IO traffic.

## Project Structure

```
chat-app-mern/
├── backend/        # Express API, socket server, MongoDB models
├── frontend/       # React UI (Vite) and client-side state
└── package.json    # Root scripts to build/start both apps
```

## Additional Notes

- Cookies are HTTP-only and protected according to the `NODE_ENV` value, so set it to `development` when working locally.
- Tailwind and DaisyUI power the UI theme, while Zustand manages authentication and live presence state on the client.
- Socket.IO automatically emits online user updates; make sure the frontend and backend ports match the values in the README to receive them.
