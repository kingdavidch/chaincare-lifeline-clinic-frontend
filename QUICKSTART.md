# Quick Start Guide

Get up and running with ChainCare LifeLine Clinic Frontend in under 5 minutes!

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] npm or yarn installed
- [ ] Git installed
- [ ] Backend API URL available
- [ ] Google Maps API key ready

## Installation Steps

### 1️⃣ Clone & Navigate

```bash
git clone https://github.com/kingdavidch/chaincare-lifeline-clinic-frontend.git
cd chaincare-lifeline-clinic-frontend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

*This takes 2-3 minutes*

### 3️⃣ Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your text editor
nano .env  # or use: code .env, vim .env, etc.
```

Add your configuration:
```env
VITE_BASE_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key
```

### 4️⃣ Start Development Server

```bash
npm run dev
```

### 5️⃣ Open in Browser

Navigate to: **http://localhost:5173**

---

## First Time Setup Checklist

After starting the app:

1. [ ] App loads without errors
2. [ ] Login page is visible
3. [ ] No console errors in browser DevTools
4. [ ] Backend API is reachable (check Network tab)
5. [ ] Google Maps loads on relevant pages

---

## Common Commands

| Action | Command |
|--------|---------|
| Start dev server | `npm run dev` |
| Build for production | `npm run build` |
| Preview production build | `npm start` |
| Run linter | `npm run lint` |
| Fix linting issues | `npm run lint:fix` |
| Format code | `npm run prettier` |
| Clean restart | `npm run re:start` |

---

## Troubleshooting

### Port 5173 Already in Use

```bash
# Kill the process and try again
lsof -ti:5173 | xargs kill -9
npm run dev
```

### Dependencies Won't Install

```bash
# Clean everything and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Environment Variables Not Loading

- Restart the dev server after editing `.env`
- Ensure variables start with `VITE_`
- Check for spaces around `=` (should be `KEY=value`, not `KEY = value`)

### Backend Connection Issues

- Verify `VITE_BASE_URL` in `.env` is correct
- Ensure backend server is running
- Check CORS is enabled on backend
- Look for errors in browser console Network tab

---

## Need More Help?

📖 See [INSTALLATION.md](./INSTALLATION.md) for detailed instructions

🐛 Check existing [GitHub Issues](https://github.com/kingdavidch/chaincare-lifeline-clinic-frontend/issues)

💬 Contact the development team

---

**You're all set! Start building! 🚀**
