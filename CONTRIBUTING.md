# Contributing to IELTS English Learning Platform

Thank you for your interest in contributing! This document outlines guidelines for contributing to this project.

## Getting Started

### Development Setup

1. Fork the repository
2. Clone your fork:

```bash
git clone https://github.com/your-username/suri-learning.git
cd "suri learning"
```

3. Add the original repository as upstream:

```bash
git remote add upstream https://github.com/original-owner/suri-learning.git
```

4. Install dependencies:

```bash
npm install
```

5. Copy environment file and configure:

```bash
cp .env.example .env.local
```

## Git Workflow

### Branch Naming

Use descriptive branch names:

```
feature/add-new-quiz-type
fix/srs-calculation-bug
enhancement/improve-ai-chat
docs/update-readme
```

### Commit Messages

Follow this format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**

```bash
git commit -m "feat(quiz): add keyword transformation quiz type"
git commit -m "fix(srs): correct interval calculation for quality 0"
git commit -m "docs: update API documentation"
```

### Pull Request Workflow

1. **Create a feature branch** from `main`:

```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes** and commit them:

```bash
git add .
git commit -m "feat(scope): descriptive commit message"
```

3. **Keep your branch updated**:

```bash
git fetch upstream
git rebase upstream/main
```

4. **Push to your fork**:

```bash
git push origin feature/your-feature-name
```

5. **Open a Pull Request** with a clear description

## Code Style

### TypeScript

- Use TypeScript for all new code
- Define proper types; avoid `any`
- Use interface for object shapes
- Export types when used across files

**Good:**
```typescript
interface Word {
  id: string;
  word: string;
  band: number;
}

export function getWordById(id: string): Word | undefined {
  // ...
}
```

**Avoid:**
```typescript
function getWord(id: any): any {
  // ...
}
```

### React Components

- Use functional components with hooks
- Define prop types with interfaces
- Use named exports for components
- Keep components focused (single responsibility)

**Component structure:**
```typescript
interface ComponentProps {
  title: string;
  onAction: () => void;
}

export const Component: React.FC<ComponentProps> = ({ title, onAction }) => {
  // Hooks first
  // Then derived state
  // Then handlers
  // Finally, render

  return (
    <div>
      <h1>{title}</h1>
      <button onClick={onAction}>Action</button>
    </div>
  );
};
```

### File Organization

- One component per file
- Co-locate tests with components
- Use index files for exports
- Group related utilities in `utils/` folder

## Testing

### Manual Testing Checklist

When adding features, manually test:

- [ ] Component renders without errors
- [ ] User interactions work correctly
- [ ] State updates properly
- [ ] API calls complete successfully
- [ ] Error handling works
- [ ] Mobile responsive layout
- [ ] No console errors

### Testing API Routes

```bash
# Test chat endpoint
curl -X POST http://localhost:3000/api/gemini/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "topic": "Daily Life"}'
```

### Testing with Firebase Emulator

For local Firebase testing:

```bash
firebase emulators:start
```

## Code Review Guidelines

### Before Requesting Review

- [ ] Code follows style guidelines
- [ ] No console.log statements left
- [ ] TypeScript types are correct
- [ ] Error cases are handled
- [ ] UI works on mobile viewport

### What Reviewers Check

1. **Functionality** - Does it work as intended?
2. **Code Quality** - Is it readable and maintainable?
3. **Performance** - Any obvious performance issues?
4. **Security** - Are sensitive data handled properly?
5. **UX** - Does it feel good to use?

## Reporting Issues

When reporting bugs:

1. **Use a clear title**: "Quiz crashes when completing all questions"
2. **Describe the issue**: What happens vs expected
3. **Steps to reproduce**: 1, 2, 3...
4. **Environment**: Browser, OS, Node version
5. **Screenshots**: If UI issue

## Questions?

Open an issue for questions about contributing.

## License

By contributing, you agree that your contributions will be licensed under the project's license.
