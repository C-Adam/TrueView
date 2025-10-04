# TrueView Frontend

A modern React-based web application for AI-generated media detection and analysis. Built with React 18, TypeScript, Vite, and Shadcn/ui components.

## 🚀 Tech Stack

- **Framework:** React 18.3.1 with TypeScript
- **Build Tool:** Vite 5.4.20
- **UI Library:** Shadcn/ui with Radix UI primitives
- **Styling:** Tailwind CSS 3.4.17
- **Routing:** React Router DOM 6.30.1
- **State Management:** TanStack React Query 5.83.0
- **Forms:** React Hook Form 7.61.1 with Zod validation
- **Animations:** Framer Motion 12.23.22

## 📋 Prerequisites

Before you begin, ensure you have one of the following installed:

- **Node.js** (v18 or higher) with npm
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version` and `npm --version`

**OR**

- **Bun** (v1.0 or higher)
  - Install: `curl -fsSL https://bun.sh/install | bash`
  - Verify installation: `bun --version`

> **Note:** This project supports both npm and Bun. Choose the one you prefer.

## 🛠️ Installation

### Option 1: Using npm

1. **Navigate to the frontend directory:**
   ```bash
   cd /Users/aravde/HHTruView/TrueView/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Option 2: Using Bun

1. **Navigate to the frontend directory:**
   ```bash
   cd /Users/aravde/HHTruView/TrueView/frontend
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

## ⚙️ Configuration

### Environment Variables (Optional)

If your backend API is running on a different host or port, create a `.env` file in the frontend directory:

```bash
# .env
VITE_API_URL=http://localhost:5000
```

> **Default Backend:** If not specified, the frontend will need to be configured to point to your backend API endpoint.

## 🏃 Running the Development Server

### Using npm:
```bash
npm run dev
```

### Using Bun:
```bash
bun run dev
```

The application will start on **http://localhost:8080**

You should see output similar to:
```
  VITE v5.4.20  ready in XXX ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: http://[your-ip]:8080/
```

## 📦 Building for Production

### Development Build:
```bash
npm run build:dev
# or
bun run build:dev
```

### Production Build:
```bash
npm run build
# or
bun run build
```

Build output will be in the `dist/` directory.

### Preview Production Build:
```bash
npm run preview
# or
bun run preview
```

## 🧪 Linting

Run ESLint to check code quality:

```bash
npm run lint
# or
bun run lint
```

## 📁 Project Structure

```
frontend/
├── public/              # Static assets
│   ├── background.mp4   # Background video
│   └── placeholder.svg  # Placeholder images
├── src/
│   ├── components/      # Reusable UI components
│   │   └── ui/         # Shadcn/ui components
│   ├── hooks/          # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/            # Utility functions
│   │   └── utils.ts
│   ├── pages/          # Page components
│   │   ├── Auth.tsx    # Authentication page
│   │   ├── Home.tsx    # Home page
│   │   ├── Index.tsx   # Landing page
│   │   ├── Upload.tsx  # Media upload page
│   │   └── NotFound.tsx # 404 page
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles
├── vite.config.ts      # Vite configuration
├── tailwind.config.ts  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies and scripts
```

## 🎨 Available Routes

- `/` - Upload page (default)
- `/auth` - Authentication page
- `/upload` - Media upload page
- `/home` - Home page
- `*` - 404 Not Found page

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 8080 |
| `npm run build` | Build for production |
| `npm run build:dev` | Build for development |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## 🎯 Key Features

- **Modern UI:** Built with Shadcn/ui components for a polished, accessible interface
- **Type Safety:** Full TypeScript support for better developer experience
- **Fast Refresh:** Vite's HMR for instant feedback during development
- **Responsive Design:** Mobile-first approach with Tailwind CSS
- **Form Validation:** React Hook Form with Zod schema validation
- **State Management:** TanStack React Query for server state
- **Animations:** Smooth transitions with Framer Motion

## 🔌 Backend Integration

This frontend is designed to work with the TrueView backend API. Ensure your backend is running before using the application.

**Backend Setup:**
1. Navigate to the backend directory: `cd ../backend`
2. Follow the backend README instructions to start the API server
3. The backend typically runs on `http://localhost:5000`

## 🐛 Troubleshooting

### Port Already in Use
If port 8080 is already in use, you can change it in `vite.config.ts`:
```typescript
server: {
  host: "::",
  port: 3000, // Change to your preferred port
}
```

### Dependencies Installation Issues
If you encounter issues during installation:
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Or with Bun
rm -rf node_modules bun.lockb
bun install
```

### TypeScript Errors
Ensure you're using TypeScript 5.8 or higher:
```bash
npm list typescript
# or
bun pm ls typescript
```

### Build Errors
If you encounter build errors, try:
```bash
# Clean build cache
rm -rf dist
npm run build
```

## 📚 Adding New Shadcn/ui Components

This project uses Shadcn/ui. To add new components:

```bash
npx shadcn@latest add [component-name]
```

Example:
```bash
npx shadcn@latest add button
npx shadcn@latest add card
```

## 🤝 Development Workflow

1. **Start the backend server** (in a separate terminal)
2. **Start the frontend dev server:** `npm run dev`
3. **Open your browser:** Navigate to `http://localhost:8080`
4. **Make changes:** Files will hot-reload automatically
5. **Test your changes:** Upload media files and verify functionality

## 📝 Notes

- The project uses path aliases: `@/` points to `./src/`
- Vite uses SWC for faster compilation
- The development server is configured to listen on all network interfaces (`::`)
- Both npm and Bun lock files are present; use whichever package manager you prefer

## 🆘 Need Help?

- Check the [Vite documentation](https://vitejs.dev/)
- Review [React documentation](https://react.dev/)
- Explore [Shadcn/ui components](https://ui.shadcn.com/)
- Check [Tailwind CSS docs](https://tailwindcss.com/)

---

**Happy coding! 🚀**