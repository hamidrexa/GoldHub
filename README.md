# GoldHub 🏆

**GoldHub** is a modern, full-featured B2B marketplace platform built with Next.js 14, designed to connect gold and jewelry suppliers with retailers. The platform provides a comprehensive ecosystem for managing products, orders, pricing, and user authentication with multi-role support.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=flat-square)](#license)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [User Roles](#-user-roles)
- [Internationalization](#-internationalization)
- [API Integration](#-api-integration)
- [Design System](#-design-system)
- [Scripts](#-scripts)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

GoldHub is a comprehensive B2B marketplace platform specifically designed for the gold and jewelry industry. It serves as a bridge between suppliers and retailers, providing a seamless digital experience for product discovery, ordering, and management.

### Platform Architecture

- **Frontend**: Next.js 14 with App Router for optimal performance and SEO
- **Authentication**: Multi-provider authentication with role-based access control
- **Internationalization**: Multi-language support with RTL/LTR switching
- **UI/UX**: Modern, responsive design with dark mode support
- **Data Visualization**: Advanced charts and analytics for business insights
- **E-commerce**: Complete shopping cart and order management system

---

## 🔑 Key Features

### Multi-Role User System
- **Admin**: Full platform management with oversight capabilities
- **Supplier**: Product management, inventory tracking, and order fulfillment
- **Buyer**: Product browsing, cart management, and order tracking

### E-Commerce Capabilities
- Advanced product filtering and search
- Real-time shopping cart management
- Complete order lifecycle management
- Multi-image product galleries
- Responsive product presentation

### Business Intelligence
- Sales analytics and performance metrics
- Order timeline visualization
- Real-time inventory tracking
- Dynamic pricing configuration

### User Experience
- Mobile-first responsive design
- Dark/light theme support
- Multi-language interface (English & Persian)
- Intuitive navigation and user flows

---

## ✨ Core Features

### 🔐 Authentication & Security
- Multi-provider authentication (Phone, Password, Google OAuth)
- Role-based access control (Admin, Supplier, Buyer)
- KYC verification system for user validation
- Secure session management with Bearer tokens

### 👥 Role-Based Dashboards
- **Admin**: User management, order oversight, analytics, audit logs
- **Supplier**: Product catalog, inventory, order fulfillment, pricing
- **Buyer**: Product browsing, shopping cart, order tracking, favorites

### 🛍️ E-Commerce Platform
- Advanced product filtering and search capabilities
- Real-time shopping cart management
- Complete order lifecycle management
- Multi-image product galleries
- Responsive grid and list views

### 🌍 Internationalization
- Multi-language support (English & Persian)
- RTL/LTR automatic layout switching
- Complete translation coverage (1800+ keys)
- Dynamic language selection

### 🎨 Modern Design System
- Built with Shadcn/UI and Radix UI components
- Mobile-first responsive design
- Dark/light theme support
- Custom navy blue and gold color palette
- Smooth animations with Framer Motion

### 📊 Business Intelligence
- Recharts integration for data visualization
- Real-time analytics dashboard
- Order timeline tracking
- Sales performance metrics

---

## 🛠️ Technology Stack

### **Core Framework**
- **[Next.js 14.2](https://nextjs.org/)** - React framework with App Router
- **[React 18.2](https://reactjs.org/)** - UI library
- **[TypeScript 5.3](https://www.typescriptlang.org/)** - Type safety

### **Styling & UI**
- **[TailwindCSS 3.4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Shadcn/UI](https://ui.shadcn.com/)** - Re-usable component library
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible components
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Lucide React](https://lucide.dev/)** - Icon library

### **State Management & Data Fetching**
- **[SWR](https://swr.vercel.app/)** - React Hooks for data fetching
- **[React Hook Form](https://react-hook-form.com/)** - Form state management
- **[Zod](https://zod.dev/)** - Schema validation

### **Authentication & Security**
- **[@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google)** - Google OAuth integration
- **[js-cookie](https://github.com/js-cookie/js-cookie)** - Cookie management

### **Internationalization**
- **[@formatjs/intl-localematcher](https://formatjs.io/)** - Locale matching
- **[negotiator](https://github.com/jshttp/negotiator)** - Content negotiation
- **Custom dictionary system** - JSON-based translations

### **Data Visualization**
- **[Recharts](https://recharts.org/)** - Composable charting library
- **[@tanstack/react-table](https://tanstack.com/table/v8)** - Headless table library

### **Development Tools**
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[@sentry/nextjs](https://sentry.io/)** - Error tracking
- **[GrowthBook](https://www.growthbook.io/)** - Feature flags & A/B testing

### **Additional Libraries**
- **[dayjs](https://day.js.org/)** - Date manipulation
- **[jalaliday](https://github.com/alibaba-aero/jalaliday)** - Persian calendar support
- **[react-toastify](https://fkhadra.github.io/react-toastify/)** - Toast notifications
- **[swiper](https://swiperjs.com/)** - Touch slider
- **[embla-carousel-react](https://www.embla-carousel.com/)** - Carousel component
- **[react-photo-view](https://github.com/MinJieLiu/react-photo-view)** - Image viewer
- **[sharp](https://sharp.pixelplumbing.com/)** - Image optimization

---

## 📁 Project Structure

```
GoldHub/
├── app/                          # Next.js App Router
│   ├── [lang]/                   # Internationalized routes
│   │   ├── (auth)/              # Authentication routes
│   │   │   └── login/           # Login with phone/password/Google OAuth
│   │   └── (user)/              # Protected user routes
│   │       ├── admin/           # Admin dashboard
│   │       ├── supplier/        # Supplier dashboard  
│   │       ├── buyer/           # Buyer dashboard
│   │       ├── profile/         # User profile
│   │       ├── about/           # About page
│   │       ├── privacy/         # Privacy policy
│   │       └── contact/         # Contact page
│   ├── api/                     # API routes
│   ├── globals.css             # Global styles
│   └── layout.tsx              # Root layout
├── components/                  # Reusable components
│   ├── ui/                     # Shadcn UI components (51+ components)
│   ├── layout/                 # Layout components (header, sidebar, footer)
│   └── ...                     # Business logic components
├── dictionaries/               # i18n translations
│   ├── en.json                # English (1800+ keys)
│   ├── fa.json                # Persian (RTL support)
│   └── ...
├── lib/                        # Utilities & helpers
├── services/                   # API service layer
├── contexts/                   # React contexts (global state)
├── constants/                  # App constants
├── public/                     # Static assets
├── tailwind.config.js         # Tailwind configuration
├── next.config.js             # Next.js configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies
└── README.md                  # This file
```

### Key Architecture Patterns
- **App Router**: Next.js 14 app directory structure
- **Internationalization**: Dynamic routing with `[lang]` prefix
- **Role-based Layouts**: Separate dashboard areas for each user type
- **Component Library**: Centralized UI components with Shadcn/UI
- **Service Layer**: API abstraction for data fetching
- **Context Management**: Global state for user authentication and preferences

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20.9.0 or higher
- **npm** or **yarn**: Package manager
- **Git**: Version control

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/GoldHub.git
   cd GoldHub
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   
   Create a `.env.local` file in the root directory:
   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=your_api_url
   
   # Website Configuration  
   NEXT_PUBLIC_WEBSITE_URL=http://localhost:3000
   NEXT_PUBLIC_ENVIRONMENT=development
   
   # Feature Flags
   USE_MOCK_DATA=true  # Enable mock data for development
   
   # Optional: Google OAuth
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   
   # Optional: Sentry Error Tracking
   SENTRY_DSN=your_sentry_dsn
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Access the Application**
   
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Development Features

- **Mock Data Mode**: Toggle between real API and mock data
- **Hot Reloading**: Instant updates during development
- **TypeScript**: Full type safety and IntelliSense
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting

---

## 👤 User Roles & Permissions

### **Administrator**
- Complete platform oversight and management
- User registration and KYC verification approval
- Order monitoring across all suppliers and buyers
- System configuration and audit log access
- Analytics and reporting dashboard

### **Supplier**
- Product catalog creation and management
- Real-time inventory tracking and control
- Order processing and fulfillment workflow
- Dynamic pricing configuration based on market conditions
- Sales performance analytics and reporting

### **Buyer (Retailer)**
- Product discovery and advanced search capabilities
- Shopping cart management and checkout process
- Order placement and real-time tracking
- Product favorites and wishlist management
- Order history and detailed order information

---

## 🌐 Internationalization

GoldHub supports comprehensive internationalization with automatic locale detection and dynamic content adaptation.

### Supported Languages
- **English (en)**: Primary language with full feature coverage
- **Persian (fa)**: Complete RTL support with Jalali calendar integration
- **Turkish (tr)**: Additional language support
- **Arabic (ar)**: Extended Middle Eastern market coverage

### Translation System
```typescript
// dictionaries/en.json - 1800+ translation keys
{
  "appName": "GoldHub",
  "navigation": {
    "dashboard": "Dashboard",
    "products": "Products",
    "orders": "Orders",
    "profile": "Profile"
  },
  "auth": {
    "login": "Login",
    "register": "Register",
    "logout": "Logout"
  }
}
```

### Implementation
```typescript
import { getDictionary } from '@/get-dictionary';

export default async function Page({ params: { lang } }) {
  const dict = await getDictionary(lang);
  return <h1>{dict.appName}</h1>;
}
```

### URL Structure
- English: `/en/dashboard`
- Persian: `/fa/dashboard` 
- Turkish: `/tr/dashboard`
- Arabic: `/ar/dashboard`

### Features
- **Automatic Direction Detection**: RTL/LTR switching based on language
- **Localized Content**: Complete UI translation coverage
- **Date Localization**: Localized date formats and calendars
- **Currency Support**: Region-specific currency formatting
- **SEO Optimization**: Language-specific meta tags and URLs

---

## 🔌 API Integration

### API Configuration
Base URL configured via environment variable:
```env
NEXT_PUBLIC_API_URL=https://api.goldhub.com
```

### Authentication System
All API requests use Bearer token authentication:
```typescript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### API Endpoints

#### **Product Management**
- `GET /v1/gold_artifacts/products_list` - List products with advanced filtering
- `POST /v1/gold_artifacts/product_create` - Create new product
- `PATCH /v1/gold_artifacts/product_update/{id}` - Update existing product
- `POST /v1/gold_artifacts/product_add_image/{id}` - Upload product images
- `DELETE /v1/gold_artifacts/product_delete_image/{id}` - Remove product images

#### **E-Commerce Operations**
- `GET /v1/gold_artifacts/cart_detail` - Retrieve shopping cart contents
- `POST /v1/gold_artifacts/add_to_cart` - Add items to cart
- `POST /v1/gold_artifacts/remove_from_cart` - Remove items from cart
- `POST /v1/gold_artifacts/submit_order` - Create new order
- `POST /v1/gold_artifacts/pay_order/{id}` - Process payment for order
- `GET /v1/gold_artifacts/orders_history` - User order history
- `GET /v1/gold_artifacts/sells_history` - Supplier sales history
- `POST /v1/gold_artifacts/update_order_status` - Update order status

#### **Administrative Functions**
- `GET /v1/gold_artifacts/users_list` - List all platform users
- `POST /v1/gold_artifacts/set_KYC_status` - Update user verification status
- `GET /v1/gold_artifacts/audit_logs` - Retrieve system activity logs

### Development Features
- **Mock Data Mode**: Toggle between real API and mock data for development
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Request Interceptors**: Automatic token refresh and retry logic
- **Response Caching**: SWR integration for efficient data fetching
- **Type Safety**: Full TypeScript support for API responses

---

## 🎨 Design System & UI

### Brand Identity
- **Primary Color**: Navy Blue (`#061324`) - Professional and trustworthy
- **Accent Color**: Gold (`#F0A202`) - Premium and luxurious
- **Secondary Colors**: Grays and whites for clean, modern aesthetics

### Color Palette

#### **Primary Colors**
- **Navy Blue**: `#061324` (Main brand color)
- **Gold**: `#F0A202` (Accent and highlights)
- **White**: `#FFFFFF` (Background and cards)

#### **Background Colors**
- **Light Background**: `#F5F5F0` (Page background)
- **Card Background**: `#FFFFFF` (Content cards)
- **Sidebar**: `#061324` (Navigation area)

#### **Status & Semantic Colors**
- **Success**: Green (`#10B981`) - Delivered, Completed
- **Warning**: Yellow (`#F59E0B`) - Pending, Processing
- **Error**: Red (`#EF4444`) - Failed, Cancelled
- **Info**: Blue (`#3B82F6`) - Shipped, In Transit

### Typography System
- **Font Family**: Nunito (English) + Yekan (Persian) with system fallbacks
- **Headings**: Bold weight, navy blue
- **Body Text**: Regular weight, dark gray (`#374151`)
- **Small Text**: Regular weight, medium gray (`#6B7280`)

### Component Library
Built with modern, accessible components:
- **Shadcn/UI**: 51+ pre-styled components
- **Radix UI**: Unstyled, accessible primitives
- **Custom Variants**: Brand-tailored color schemes
- **Dark Mode**: Complete dark/light theme support

### Responsive Design
```javascript
// Tailwind breakpoints
screens: {
  'sm': '640px',    // Mobile phones
  'md': '768px',    // Tablets
  'lg': '1024px',   // Small laptops
  'xl': '1280px',   // Desktops
  '2xl': '1400px',  // Large screens
}
```

### Design Principles
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation
- **Consistency**: Unified design language across all components
- **Performance**: Optimized for fast loading and smooth interactions
- **Responsiveness**: Mobile-first approach with progressive enhancement

---

## 📜 Available Scripts

### Development Commands
```json
{
  "dev": "next dev",           // Start development server with hot reload
  "build": "next build",       // Build for production optimization
  "start": "next start",       // Start production server
  "lint": "next lint",         // Run ESLint for code quality
  "lint:fix": "next lint --fix" // Auto-fix linting issues
}
```

### Development Workflow
```bash
# Development cycle
npm run dev                    # Start development server
npm run lint                   # Check code quality
npm run build                  # Create production build
npm run start                  # Start production server

# Code quality
npm run lint                   # Run ESLint
npm run lint:fix               # Auto-fix issues
```

### Build Optimization
- **Automatic Code Splitting**: Next.js optimizes bundle size
- **Image Optimization**: Sharp integration for fast loading
- **Font Optimization**: Custom font loading with performance
- **Static Generation**: Pre-render pages for better SEO
- **Server-side Rendering**: Dynamic content with fast performance

---

## � Environment Configuration

### Required Variables
Create a `.env.local` file in the project root:

```env
# Core Configuration
NEXT_PUBLIC_API_URL=https://api.goldhub.com
NEXT_PUBLIC_WEBSITE_URL=https://goldhub.com
NEXT_PUBLIC_ENVIRONMENT=production

# Development Settings
USE_MOCK_DATA=false           # Disable for production
```

### Optional Variables

#### **Error Tracking & Monitoring**
```env
# Sentry Configuration
SENTRY_DSN=your_sentry_dsn
SENTRY_ORG=sahmeto
SENTRY_PROJECT=goldhub-frontend
```

#### **Authentication**
```env
# Google OAuth Integration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

#### **Feature Flags & Analytics**
```env
# GrowthBook Configuration
NEXT_PUBLIC_GROWTHBOOK_API_KEY=your_growthbook_api_key
GROWTHBOOK_CLIENT_SIDE_ID=your_client_side_id
```

#### **Development Tools**
```env
# Development-specific settings
NODE_ENV=development
NEXT_PUBLIC_DEBUG=false
```

### Security Notes
- Never commit `.env.local` to version control
- Use environment-specific files (`.env.development`, `.env.production`)
- Store sensitive values in secure secret management systems
- Use proper CORS configuration for API endpoints

---

## � Deployment Options

### Production Deployment

#### **Vercel (Recommended)**
1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Production**
   ```bash
   vercel --prod
   ```

3. **Environment Setup**
   - Configure environment variables in Vercel dashboard
   - Set up custom domain and SSL certificates
   - Configure build and deployment settings

#### **Docker Containerization**
1. **Build Docker Image**
   ```bash
   docker build -t goldhub:latest .
   ```

2. **Run Container**
   ```bash
   docker run -p 3000:3000 --env-file .env.local goldhub:latest
   ```

3. **Docker Compose**
   ```yaml
   version: '3.8'
   services:
     goldhub:
       build: .
       ports:
         - "3000:3000"
       environment:
         - NEXT_PUBLIC_API_URL=${API_URL}
         - NEXT_PUBLIC_WEBSITE_URL=${WEBSITE_URL}
   ```

#### **Traditional Server Deployment**
1. **Build Application**
   ```bash
   npm run build
   ```

2. **Start Production Server**
   ```bash
   npm start
   ```

3. **Configure Reverse Proxy (Nginx)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### CI/CD Integration
- **GitHub Actions**: Automated testing and deployment
- **GitLab CI/CD**: Container-based deployment pipeline
- **Jenkins**: Traditional CI/CD server integration

### Performance Optimization
- **CDN Integration**: Static asset caching and delivery
- **Image Optimization**: Automatic image resizing and compression
- **Caching Strategy**: Browser and server-side caching
- **Monitoring**: Real-time performance monitoring and alerts

---

## 🤝 Contributing Guidelines

We welcome contributions from the community! Please follow these guidelines:

### Development Process

1. **Fork the Repository**
   ```bash
   git clone https://github.com/yourusername/GoldHub.git
   cd GoldHub
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Set Up Development Environment**
   ```bash
   npm install
   cp .env.example .env.local
   # Configure your environment variables
   npm run dev
   ```

4. **Make Changes**
   - Follow TypeScript best practices
   - Write clean, maintainable code
   - Add appropriate comments for complex logic
   - Ensure all tests pass

5. **Test Your Changes**
   ```bash
   npm run lint        # Check code quality
   npm run build       # Verify production build
   ```

6. **Commit and Push**
   ```bash
   git add .
   git commit -m 'feat: Add amazing feature'
   git push origin feature/amazing-feature
   ```

7. **Open Pull Request**
   - Provide clear description of changes
   - Link to related issues
   - Include screenshots if UI changes
   - Ensure all CI checks pass

### Code Standards

#### **TypeScript Guidelines**
- Use strict TypeScript configuration
- Define proper interfaces and types
- Avoid `any` type - use specific types
- Use generics for reusable components

#### **Code Style**
- Follow ESLint configuration
- Use Prettier for consistent formatting
- Use meaningful variable and function names
- Write descriptive commit messages

#### **Component Guidelines**
- Use functional components with hooks
- Implement proper error boundaries
- Add accessibility attributes
- Write JSDoc comments for complex functions

#### **Testing**
- Write unit tests for utilities
- Test critical business logic
- Use Jest and React Testing Library
- Aim for high test coverage

### Pull Request Process
1. PR title should follow conventional commits format
2. Include detailed description of changes
3. Link to related GitHub issues
4. Ensure all automated checks pass
5. Respond to code review comments promptly
6. Keep PR focused on single feature/fix

---

## 📄 License

This project is proprietary software. All rights reserved exclusively for GoldHub Company.

### License Terms
- **Commercial Use**: Requires explicit written permission from GoldHub
- **Modification**: Not permitted without authorization
- **Distribution**: Prohibited without proper licensing
- **Warranty**: Provided "as-is" without guarantees
- **Liability**: Users assume all risks associated with usage

### Contact for Licensing
For commercial licensing inquiries, please contact:
- **Email**: licensing@goldhub.com
- **Business Development**: business@goldhub.com

### Intellectual Property
All trademarks, service marks, and trade names are the property of GoldHub Company.

---

## 📞 Support

For support and questions:
- **Email**: support@goldhub.com
- **Website**: [https://goldhub.com](https://goldhub.com)

---

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing framework
- **Vercel** - For hosting and deployment
- **Shadcn** - For the beautiful UI components
- **Radix UI** - For accessible primitives
- **All Contributors** - For making this project possible

---

<div align="center">
  <strong>Built with ❤️ by the GoldHub Team</strong>
  <br />
  <sub>Version 0.10.0</sub>
</div>
