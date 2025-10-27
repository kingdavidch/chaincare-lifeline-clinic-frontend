# ChainCare LifeLine Clinic Frontend - Installation Guide

This guide provides step-by-step instructions to install and run the ChainCare LifeLine Clinic Frontend application on your local machine.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation Steps](#installation-steps)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Available Scripts](#available-scripts)
- [Troubleshooting](#troubleshooting)
- [Production Build](#production-build)

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

1. **Node.js** (v18.0.0 or higher recommended)
   - Download from [https://nodejs.org/](https://nodejs.org/)
   - To check if Node.js is installed, run:
     ```bash
     node --version
     ```

2. **npm** (comes with Node.js) or **Yarn**
   - npm comes bundled with Node.js
   - To check npm version:
     ```bash
     npm --version
     ```
   - To install Yarn (optional):
     ```bash
     npm install -g yarn
     ```

3. **Git** (for cloning the repository)
   - Download from [https://git-scm.com/](https://git-scm.com/)
   - To check if Git is installed:
     ```bash
     git --version
     ```

### Required API Keys

You will need the following API keys:

1. **Backend API URL** - The base URL of your ChainCare backend server
2. **Google Maps API Key** - For location and maps functionality
   - Get one from [Google Cloud Console](https://console.cloud.google.com/)
   - Enable the following APIs:
     - Maps JavaScript API
     - Places API

---

## Installation Steps

### Step 1: Clone the Repository

```bash
# Navigate to your desired directory
cd ~/Documents

# Clone the repository
git clone https://github.com/kingdavidch/chaincare-lifeline-clinic-frontend.git

# Navigate into the project directory
cd chaincare-lifeline-clinic-frontend
```

### Step 2: Install Dependencies

Choose either npm or yarn:

**Using npm:**
```bash
npm install
```

**Using yarn:**
```bash
yarn install
```

This process may take several minutes as it downloads all required packages (~200+ dependencies).

### Step 3: Create Environment Variables File

Create a `.env` file in the root directory of the project:

```bash
touch .env
```

Open the `.env` file and add the following environment variables:

```env
# Backend API Base URL
VITE_BASE_URL=http://localhost:5000

# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

**Important Notes:**
- Replace `http://localhost:5000` with your actual backend API URL
- Replace `your_google_maps_api_key_here` with your actual Google Maps API key
- All environment variables for Vite must be prefixed with `VITE_`
- Never commit the `.env` file to version control (it should be in `.gitignore`)

### Step 4: Verify Installation

Check that all dependencies were installed correctly:

```bash
# Check if node_modules folder exists
ls node_modules

# Verify package.json scripts are available
npm run
```

---

## Configuration

### Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_BASE_URL` | Backend API base URL | `http://localhost:5000` or `https://api.chaincare.com` |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps API key for location services | `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` |

### Backend API Configuration

The application expects the backend API to be available at `${VITE_BASE_URL}/api/v1/`. Ensure your backend server is running and accessible before starting the frontend.

**API Features Used:**
- Authentication endpoints (`/clinic/login`, `/clinic/refresh-token`)
- Customer management
- Medications management
- Claims processing
- Reports generation
- Settings management

---

## Running the Application

### Development Mode

Start the development server with hot-reload:

**Using npm:**
```bash
npm run dev
```

**Using yarn:**
```bash
yarn dev
```

The application will start and be accessible at:
- **Local:** `http://localhost:5173`
- The exact port will be displayed in the terminal

**Development Mode Features:**
- Hot Module Replacement (HMR)
- Fast refresh for React components
- ESLint checking
- Source maps for debugging

### Development Mode with Network Access

To access the app from other devices on your local network:

```bash
npm run dev:host
```

This will display network URLs like:
- **Local:** `http://localhost:5173`
- **Network:** `http://192.168.x.x:5173`

---

## Available Scripts

### Development Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start development server |
| `dev:host` | `npm run dev:host` | Start dev server with network access |

### Build Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `build` | `npm run build` | Create production build |
| `vite:build` | `npm run vite:build` | Build using Vite |

### Preview Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `start` | `npm start` | Preview production build locally |

### Code Quality Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `lint` | `npm run lint` | Check code for linting errors |
| `lint:fix` | `npm run lint:fix` | Auto-fix linting errors |
| `prettier` | `npm run prettier` | Format code with Prettier |

### Utility Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `rm:all` | `npm run rm:all` | Remove node_modules and build folders |
| `re:start` | `npm run re:start` | Clean install and start dev server |
| `re:build` | `npm run re:build` | Clean install and build |

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Port Already in Use

**Problem:** `Error: Port 5173 is already in use`

**Solution:**
- Kill the process using the port:
  ```bash
  # On macOS/Linux
  lsof -ti:5173 | xargs kill -9
  
  # On Windows
  netstat -ano | findstr :5173
  taskkill /PID <PID> /F
  ```
- Or use a different port:
  ```bash
  npm run dev -- --port 3000
  ```

#### 2. Dependencies Installation Fails

**Problem:** Errors during `npm install`

**Solutions:**
- Clear npm cache:
  ```bash
  npm cache clean --force
  ```
- Delete `node_modules` and `package-lock.json`:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```
- Try using a different Node.js version (use Node 18 or 20)

#### 3. Environment Variables Not Working

**Problem:** API calls fail or Google Maps doesn't load

**Solutions:**
- Ensure `.env` file is in the root directory
- Verify all variables are prefixed with `VITE_`
- Restart the development server after changing `.env`
- Check that `.env` doesn't have spaces around `=`:
  ```env
  # Correct
  VITE_BASE_URL=http://localhost:5000
  
  # Incorrect
  VITE_BASE_URL = http://localhost:5000
  ```

#### 4. CORS Errors

**Problem:** `Access to fetch has been blocked by CORS policy`

**Solutions:**
- Ensure backend server has CORS enabled for your frontend URL
- Check that `withCredentials: true` is properly configured
- Verify `VITE_BASE_URL` is correct in `.env`

#### 5. Build Errors

**Problem:** `npm run build` fails

**Solutions:**
- Run linter to check for code issues:
  ```bash
  npm run lint
  ```
- Check for TypeScript errors (if any)
- Ensure all imports are correct
- Try a clean rebuild:
  ```bash
  npm run re:build
  ```

#### 6. Slow Performance

**Solutions:**
- Clear browser cache
- Disable browser extensions
- Check if backend API is responding slowly
- Ensure adequate system resources (RAM, CPU)

---

## Production Build

### Creating a Production Build

```bash
npm run build
```

This will:
1. Run ESLint checks
2. Build optimized production files
3. Output to the `dist/` directory

### Preview Production Build Locally

```bash
npm start
```

This starts a local server to preview the production build.

### Build Output

The production build creates:
- Minified JavaScript bundles
- Optimized CSS files
- Compressed assets
- Source maps (for debugging)

All files are placed in the `dist/` directory.

### Deployment

The application can be deployed to various platforms:

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

#### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

#### Manual Deployment
1. Run `npm run build`
2. Upload the `dist/` folder to your web server
3. Configure server to redirect all routes to `index.html` (for SPA routing)

---

## Project Structure Overview

```
chaincare-lifeline-clinic-frontend/
├── public/              # Static assets
├── src/
│   ├── api/            # API configuration and calls
│   ├── auth/           # Authentication logic
│   ├── components/     # Reusable components
│   ├── hooks/          # Custom React hooks
│   ├── layouts/        # Layout components
│   ├── pages/          # Page components
│   ├── routes/         # Routing configuration
│   ├── sections/       # Page sections
│   ├── theme/          # Material-UI theme
│   └── utils/          # Utility functions
├── .env                # Environment variables (create this)
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
└── INSTALLATION.md     # This file
```

---

## Technology Stack

- **Framework:** React 18.3.1
- **Build Tool:** Vite 5.3.1
- **UI Library:** Material-UI (MUI) 6.4.5
- **State Management:** React Query (TanStack Query) 5.66.0
- **Routing:** React Router DOM 6.24.1
- **HTTP Client:** Axios 1.7.9
- **Charts:** ApexCharts 3.52.0
- **Forms:** React Hook Form 7.53.0
- **Styling:** Emotion, Styled Components
- **Date Handling:** date-fns, dayjs

---

## Support

For issues, questions, or contributions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review existing GitHub issues
3. Create a new issue with detailed information
4. Contact the development team

---

## Next Steps

After successful installation:

1. ✅ Start the development server
2. ✅ Navigate to `http://localhost:5173`
3. ✅ Test the login functionality
4. ✅ Verify backend API connectivity
5. ✅ Explore the dashboard features

**Happy Coding! 🚀**
