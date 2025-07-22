# Mortgage Calculator Frontend

A modern React frontend application for calculating mortgage payments with CMHC insurance considerations, built with Vite, TypeScript, and Tailwind CSS.

## Features

- 🏡 **Mortgage Payment Calculation** - Calculate monthly, bi-weekly, and accelerated bi-weekly payments
- 🛡️ **CMHC Insurance Integration** - Automatic CMHC insurance calculation based on down payment
- 📱 **Responsive Design** - Mobile-first design with Tailwind CSS
- 🧪 **Comprehensive Testing** - Unit tests with Vitest and Testing Library
- 📚 **Component Documentation** - Storybook for component development and documentation
- 🚀 **Code Splitting** - Lazy loading with React.lazy for optimal performance
- 🐳 **Docker Support** - Containerized development and production environments
- 🎯 **Feature-Based Architecture** - Scalable and maintainable code organization

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 4
- **Styling**: Tailwind CSS 3
- **Testing**: Vitest + Testing Library
- **Documentation**: Storybook 7
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router 6
- **Docker**: Multi-stage builds for dev/prod

## Project Structure

```
src/
├── features/                    # Feature-based architecture
│   └── mortgage-calculator/     # Mortgage calculator feature
│       ├── components/          # Feature-specific components
│       └── MortgageCalculator.tsx
├── shared/                      # Shared utilities and components
│   ├── components/             # Reusable UI components
│   ├── hooks/                  # Custom React hooks
│   ├── types/                  # TypeScript type definitions
│   └── utils/                  # Utility functions
├── test/                       # Test configuration and utilities
├── App.tsx                     # Root application component
├── main.tsx                    # Application entry point
└── index.css                   # Global styles with Tailwind
```

## Getting Started

### Prerequisites

- Node.js 18+ or Docker
- npm or yarn package manager

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mortgage-calculator/front-end
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Docker Development

1. **Start with Docker Compose**
   ```bash
   # From the project root
   docker-compose up frontend
   ```

2. **With hot reloading**
   ```bash
   docker-compose up --build frontend
   ```

## Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Testing
- `npm run test` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI interface
- `npm run test:coverage` - Generate test coverage report

### Storybook
- `npm run storybook` - Start Storybook development server
- `npm run build-storybook` - Build Storybook for production

### Docker
- `npm run docker:build` - Build Docker image
- `npm run docker:run` - Run Docker container

## Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api

# Development
NODE_ENV=development
```

### Tailwind CSS

The project uses a comprehensive Tailwind configuration with:
- Custom color palette (primary, secondary, success, warning, error)
- Extended spacing, typography, and animations
- Custom component classes
- Dark mode support (ready for implementation)

### TypeScript

Strict TypeScript configuration with:
- Path aliases for clean imports (`@/`, `@/components/`, etc.)
- Comprehensive type definitions for mortgage calculations
- Test type support with Vitest globals

## Mortgage Calculation Features

### Supported Inputs
- Property price ($)
- Down payment ($)
- Annual interest rate (%)
- Amortization period (5, 10, 15, 20, 25, 30 years)
- Payment schedule (monthly, bi-weekly, accelerated bi-weekly)

### CMHC Insurance
- Automatic requirement detection (< 20% down payment)
- Current CMHC premium rates:
  - 5-9.99% down: 4.00% premium
  - 10-14.99% down: 3.10% premium  
  - 15-19.99% down: 2.80% premium
- HST/GST considerations

### Validation
- Frontend validation with Zod schemas
- Real-time error feedback
- Canadian mortgage rules compliance
- Minimum down payment requirements

## Testing

### Test Structure
```
__tests__/
├── components/          # Component tests
├── utils/              # Utility function tests
├── features/           # Feature integration tests
└── __mocks__/         # Test mocks and fixtures
```

### Running Tests
```bash
# Watch mode
npm run test

# Coverage report
npm run test:coverage

# UI mode
npm run test:ui

# Docker
docker-compose --profile test up test-runner
```

## Storybook

Component documentation and development environment:

```bash
# Start Storybook
npm run storybook

# Docker
docker-compose --profile storybook up storybook
```

## Deployment

### Production Build
```bash
npm run build
```

### Docker Production
```bash
# Build production image
docker build -t mortgage-calculator-frontend .

# Run production container
docker run -p 80:80 mortgage-calculator-frontend
```

### Docker Compose Production
```bash
docker-compose --profile production up frontend-prod
```

## Performance Optimizations

- **Code Splitting**: Automatic route-based splitting with React.lazy
- **Bundle Analysis**: Configured chunk splitting for vendors, forms, and UI libraries
- **Image Optimization**: Modern image formats and lazy loading
- **Caching**: Aggressive caching for static assets
- **Tree Shaking**: Unused code elimination with Vite

## Accessibility

- WCAG 2.1 AA compliance
- Screen reader support
- Keyboard navigation
- Focus management
- Color contrast compliance
- Reduced motion support

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Ensure tests pass (`npm run test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Code Style

- ESLint configuration for code quality
- Prettier for code formatting
- TypeScript strict mode
- Tailwind CSS class ordering
- Conventional commits

## Troubleshooting

### Common Issues

1. **Port 3000 already in use**
   ```bash
   # Change port in vite.config.ts or use:
   npm run dev -- --port 3001
   ```

2. **Docker build fails**
   ```bash
   # Clean Docker cache
   docker system prune -a
   docker-compose build --no-cache frontend
   ```

3. **Tests failing**
   ```bash
   # Clear test cache
   npm run test -- --clearCache
   ```

4. **TypeScript errors**
   ```bash
   # Restart TypeScript server in your IDE
   # Or regenerate types:
   npm run build
   ```

## API Integration

The frontend is designed to work with a Node.js backend API with the following endpoints:

```
POST /api/calculate-mortgage
{
  "propertyPrice": number,
  "downPayment": number,
  "annualInterestRate": number,
  "amortizationPeriod": number,
  "paymentSchedule": string
}
```

Response format expected:
```json
{
  "success": boolean,
  "data": {
    "paymentAmount": number,
    "totalInterest": number,
    "cmhcInsurance": object,
    "paymentBreakdown": object,
    "amortizationSchedule": array
  },
  "errors": array
}
```

## License

This project is part of the WorldSource Technical Assessment.

## Support

For technical questions or issues:
1. Check the troubleshooting section above
2. Review the component documentation in Storybook
3. Check the test files for usage examples
4. Create an issue with reproduction steps