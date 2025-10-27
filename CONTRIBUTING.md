# Contributing to ChainCare LifeLine Clinic Frontend

Thank you for your interest in contributing! This guide will help you get started.

## Table of Contents
- [Development Setup](#development-setup)
- [Code Style Guidelines](#code-style-guidelines)
- [Project Conventions](#project-conventions)
- [Git Workflow](#git-workflow)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)

---

## Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/chaincare-lifeline-clinic-frontend.git
   cd chaincare-lifeline-clinic-frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

---

## Code Style Guidelines

### ESLint and Prettier

This project uses ESLint and Prettier for code quality and formatting.

**Before committing:**
```bash
# Check for linting errors
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code with Prettier
npm run prettier
```

### JavaScript/React Conventions

- Use **functional components** with hooks
- Use **arrow functions** for component definitions
- Use **PascalCase** for component names
- Use **camelCase** for variables and functions
- Use **UPPER_SNAKE_CASE** for constants

**Example:**
```jsx
import { useState } from 'react';

const MyComponent = ({ title }) => {
  const [count, setCount] = useState(0);
  
  const handleClick = () => {
    setCount(count + 1);
  };
  
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={handleClick}>Count: {count}</button>
    </div>
  );
};

export default MyComponent;
```

### File Naming Conventions

- **Components:** PascalCase (e.g., `UserProfile.jsx`)
- **Utilities:** camelCase (e.g., `formatDate.js`)
- **Hooks:** camelCase with "use" prefix (e.g., `useAuth.js`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.js`)
- **Styles:** kebab-case (e.g., `user-profile.module.css`)

### Directory Structure

```
src/
├── components/       # Reusable UI components
│   └── MyComponent/
│       ├── index.js          # Export file
│       └── MyComponent.jsx   # Component implementation
├── pages/           # Page components
├── sections/        # Feature-specific sections
├── hooks/           # Custom hooks
├── utils/           # Utility functions
├── api/             # API calls
├── theme/           # MUI theme configuration
└── routes/          # Routing configuration
```

### Import Order

1. External dependencies
2. Internal absolute imports
3. Relative imports
4. Styles

```jsx
// 1. External dependencies
import React, { useState } from 'react';
import { Box, Button } from '@mui/material';

// 2. Internal absolute imports
import { useAuth } from 'src/hooks/useAuth';
import api from 'src/api/api';

// 3. Relative imports
import './MyComponent.css';
import ChildComponent from './ChildComponent';

// 4. Component definition
const MyComponent = () => {
  // ...
};
```

---

## Project Conventions

### State Management

- Use **React Query** for server state
- Use **useState/useReducer** for local state
- Use **Context API** for global state (Auth)

### API Calls

- All API calls should go through `src/api/api.js`
- Use React Query hooks for data fetching
- Handle errors gracefully with try-catch

```jsx
import { useQuery } from '@tanstack/react-query';
import api from 'src/api/api';

const useCustomers = () => {
  return useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const response = await api.get('/customers');
      return response.data;
    },
  });
};
```

### Form Handling

- Use **React Hook Form** for all forms
- Validate inputs before submission
- Show user-friendly error messages

### Material-UI Usage

- Use MUI components from `@mui/material`
- Follow the project's theme configuration
- Use `sx` prop for styling when possible
- Avoid inline styles

```jsx
import { Box, Typography } from '@mui/material';

const MyComponent = () => (
  <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
    <Typography variant="h4">Title</Typography>
  </Box>
);
```

---

## Git Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `refactor/description` - Code refactoring
- `docs/description` - Documentation updates

**Examples:**
- `feature/add-patient-search`
- `fix/login-validation-error`
- `refactor/medication-table`

### Commit Messages

Use clear, descriptive commit messages:

```
<type>: <short description>

<optional detailed description>
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

**Examples:**
```
feat: add patient search functionality

fix: resolve login form validation issue

docs: update installation guide

refactor: simplify medication table component
```

### Workflow Steps

1. **Create a branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make changes and commit**
   ```bash
   git add .
   git commit -m "feat: add my feature"
   ```

3. **Keep your branch updated**
   ```bash
   git fetch origin
   git rebase origin/master
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/my-feature
   ```

5. **Create a Pull Request**

---

## Testing

### Manual Testing

Before submitting a PR:

1. Test your changes in the browser
2. Check different screen sizes (responsive)
3. Test in multiple browsers (Chrome, Firefox, Safari)
4. Verify no console errors
5. Check network requests in DevTools

### Code Quality Checks

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run prettier
```

---

## Pull Request Process

### Before Submitting

- [ ] Code follows the style guidelines
- [ ] No linting errors (`npm run lint`)
- [ ] Code is properly formatted (`npm run prettier`)
- [ ] Changes are tested locally
- [ ] No console errors or warnings
- [ ] Commits have clear messages
- [ ] Branch is up to date with master

### PR Template

When creating a PR, include:

**Title:** Clear, concise description

**Description:**
```markdown
## What does this PR do?
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How to Test
1. Step-by-step testing instructions
2. Expected behavior

## Screenshots (if applicable)
[Add screenshots here]

## Related Issues
Fixes #123
```

### Review Process

1. Submit PR with complete description
2. Address reviewer feedback
3. Update PR as needed
4. Wait for approval
5. PR will be merged by maintainers

---

## Need Help?

- 📖 Read the [Installation Guide](./INSTALLATION.md)
- 🚀 Check the [Quick Start](./QUICKSTART.md)
- 🐛 Search existing issues
- 💬 Ask questions in issues or discussions

---

**Thank you for contributing! 🎉**
