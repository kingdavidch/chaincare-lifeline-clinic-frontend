# ChainCare LifeLine Clinic Frontend

A modern, responsive clinic management dashboard built with React and Material-UI.

## 🚀 Quick Start

For detailed installation and setup instructions, please see **[INSTALLATION.md](./INSTALLATION.md)**.

### Quick Installation

```bash
# 1. Clone the repository
git clone https://github.com/kingdavidch/chaincare-lifeline-clinic-frontend.git
cd chaincare-lifeline-clinic-frontend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
# Edit .env and add your API URL and Google Maps API key

# 4. Start development server
npm run dev
```

## 📋 Features

- **Dashboard Analytics** - Real-time clinic statistics and insights
- **Patient Management** - Comprehensive customer/patient records
- **Medications** - Medication inventory and prescription management
- **Claims Processing** - Insurance claims handling
- **Test Results** - Laboratory test results management
- **Reports** - Generate and view clinic reports
- **Orders Management** - Track and manage orders
- **Settings** - Clinic configuration and preferences
- **Discount Management** - Apply and manage discounts
- **Withdrawals** - Financial withdrawal processing
- **FAQ** - Frequently asked questions management

## 🛠️ Technology Stack

- **React 18.3** - UI library
- **Vite 5.3** - Fast build tool and dev server
- **Material-UI (MUI) 6.4** - Component library
- **React Query** - Data fetching and caching
- **React Router 6** - Client-side routing
- **Axios** - HTTP client
- **ApexCharts** - Data visualization
- **React Hook Form** - Form management
- **Socket.io** - Real-time communication

## 📁 Project Structure

```
src/
├── api/              # API configuration and endpoints
├── auth/             # Authentication logic
├── components/       # Reusable UI components
├── hooks/            # Custom React hooks
├── layouts/          # Page layouts
├── pages/            # Page components
├── routes/           # Routing configuration
├── sections/         # Feature-specific sections
├── theme/            # MUI theme customization
└── utils/            # Utility functions
```

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run prettier` - Format code

## 🔧 Configuration

The application uses environment variables for configuration. See `.env.example` for required variables:

- `VITE_BASE_URL` - Backend API base URL
- `VITE_GOOGLE_MAPS_API_KEY` - Google Maps API key

## 📖 Documentation

- [Installation Guide](./INSTALLATION.md) - Detailed setup instructions
- [Contributing Guidelines](./CONTRIBUTING.md) - How to contribute (if applicable)

## 🤝 Support

For issues and questions, please open an issue on GitHub.

## 📄 License

This project is private and proprietary.

---

**Built with ❤️ by the ChainCare Team**
