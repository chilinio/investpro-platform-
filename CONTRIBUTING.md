# Contributing to InvestPro

Thank you for your interest in contributing to InvestPro! This document provides guidelines and instructions for contributing to the project.

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:
- Be respectful and inclusive
- Use welcoming and inclusive language
- Be collaborative and constructive
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 14.0.0
- Git

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/investpro.git`
3. Install dependencies: `npm install`
4. Set up environment variables (see README.md)
5. Start development servers: `npm run dev`

## 📝 Development Guidelines

### Code Style
- **TypeScript**: Use strict mode and proper typing
- **ESLint**: Follow the configured rules
- **Prettier**: Code will be auto-formatted
- **Naming**: Use descriptive names for variables and functions

### Commit Messages
Use conventional commits format:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(auth): add two-factor authentication
fix(api): resolve investment calculation bug
docs(readme): update setup instructions
```

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

## 🔄 Pull Request Process

### Before Submitting
1. **Test your changes**: Ensure all tests pass
2. **Update documentation**: Update README or docs if needed
3. **Check code style**: Run linting and formatting
4. **Write descriptive commits**: Follow conventional commit format

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added for new functionality
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
```

### Review Process
1. **Automated checks**: All CI checks must pass
2. **Code review**: At least one maintainer review required
3. **Testing**: Ensure functionality works as expected
4. **Documentation**: Verify docs are updated if needed

## 🐛 Bug Reports

### Before Reporting
1. **Search existing issues**: Check if the bug is already reported
2. **Reproduce the bug**: Ensure it's reproducible
3. **Check latest version**: Verify bug exists in latest version

### Bug Report Template
```markdown
**Describe the Bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - OS: [e.g. Windows 10, macOS 12.0]
 - Browser: [e.g. Chrome 96, Firefox 95]
 - Node.js: [e.g. 18.0.0]
 - Version: [e.g. 1.0.0]

**Additional Context**
Any other context about the problem.
```

## 💡 Feature Requests

### Before Requesting
1. **Search existing requests**: Check if feature is already requested
2. **Consider scope**: Ensure feature aligns with project goals
3. **Think about implementation**: Consider how it might work

### Feature Request Template
```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Additional context**
Any other context or screenshots about the feature request.
```

## 🏗️ Development Areas

### Frontend (React/TypeScript)
- **Components**: Reusable UI components
- **Pages**: Route-specific page components
- **Hooks**: Custom React hooks
- **Utils**: Helper functions and utilities
- **Styling**: Tailwind CSS classes

### Backend (Node.js/Express)
- **Routes**: API endpoint handlers
- **Middleware**: Express middleware functions
- **Database**: Drizzle ORM schemas and queries
- **Services**: Business logic services
- **Utils**: Helper functions and utilities

### Database (PostgreSQL)
- **Schema**: Database table definitions
- **Migrations**: Database schema changes
- **Seeds**: Initial data setup
- **Queries**: Complex database operations

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Writing Tests
- **Unit tests**: Test individual functions and components
- **Integration tests**: Test API endpoints and database operations
- **E2E tests**: Test complete user workflows

### Test Structure
```javascript
describe('Component/Function Name', () => {
  beforeEach(() => {
    // Setup code
  });

  it('should do something specific', () => {
    // Test implementation
    expect(result).toBe(expected);
  });

  afterEach(() => {
    // Cleanup code
  });
});
```

## 📚 Documentation

### Types of Documentation
- **README**: Setup and overview
- **API Docs**: Endpoint documentation
- **Code Comments**: Inline code explanations
- **Changelogs**: Version changes
- **Guides**: How-to guides and tutorials

### Documentation Guidelines
- **Clear and concise**: Easy to understand
- **Up-to-date**: Reflect current functionality
- **Examples**: Provide code examples
- **Screenshots**: Visual aids for UI features

## 🚀 Deployment

### Staging Environment
- **URL**: [Staging URL if available]
- **Purpose**: Testing changes before production
- **Access**: Available to maintainers

### Production Environment
- **URL**: [Production URL if available]
- **Deployment**: Automated via CI/CD
- **Monitoring**: Application and error monitoring

## 🆘 Getting Help

### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and community chat
- **Discord**: [Discord server if available]
- **Email**: [Maintainer email for urgent issues]

### Resources
- **Documentation**: README.md and API-DOCUMENTATION.md
- **Examples**: Check existing code for patterns
- **Stack Overflow**: Tag questions with 'investpro'

## 🎯 Project Roadmap

### Current Focus
- Core platform stability
- Security enhancements
- User experience improvements

### Upcoming Features
- Email notifications
- Two-factor authentication
- Mobile application
- Payment gateway integration

### Long-term Goals
- Multi-language support
- Advanced analytics
- API for third-party integrations
- White-label solutions

## 🏆 Recognition

### Contributors
All contributors will be recognized in:
- **README.md**: Contributors section
- **CHANGELOG.md**: Version release notes
- **GitHub**: Contributor graphs and statistics

### Types of Contributions
- **Code**: Features, bug fixes, improvements
- **Documentation**: README, guides, API docs
- **Design**: UI/UX improvements, graphics
- **Testing**: Test cases, bug reports
- **Community**: Helping other users, discussions

## 📄 License

By contributing to InvestPro, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to InvestPro! 🚀
