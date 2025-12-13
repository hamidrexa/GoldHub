# GoldHub 🏆

**GoldHub** is a modern, full-featured B2B marketplace platform built with Next.js 14, designed to connect gold and jewelry suppliers with retailers. The platform provides a comprehensive ecosystem for managing products, orders, pricing, and user authentication with multi-role support.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)

---

## 📋 Table of Contents

- [Features](#-features)
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

## ✨ Features

### 🔐 Authentication & Authorization
- **Multi-provider authentication**: Phone number, password, and Google OAuth
- **Role-based access control**: Admin, Supplier, and Buyer roles
- **KYC verification system**: Complete user verification workflow
- **Session management**: Secure cookie-based authentication with Bearer tokens

### 👥 Multi-Role Dashboard System

#### **Admin Dashboard**
- **User & KYC Management**: Review and approve/reject user KYC requests
- **Order Management**: Monitor all platform orders with advanced filtering
- **Audit Logs**: Track all user activities and system events
- **Analytics Dashboard**: Real-time statistics and insights
- **User Administration**: Manage user roles and permissions

#### **Supplier Dashboard**
- **Product Management**: Create, update, and delete gold/jewelry products
- **Inventory Tracking**: Real-time inventory management
- **Order Fulfillment**: Process and track supplier orders
- **Pricing Configuration**: Dynamic pricing based on gold karat and weight
- **Sales Analytics**: Revenue tracking and performance metrics

#### **Buyer Dashboard**
- **Product Catalog**: Browse and search gold/jewelry products
- **Shopping Cart**: Add products with quantity management
- **Order History**: Track order status and delivery
- **Favorites**: Save products for later
- **Order Details**: View detailed order information with timeline

### 🛍️ E-Commerce Features
- **Advanced Product Filtering**: Filter by category, karat, weight, price range, and supplier
- **Shopping Cart System**: Add/remove products with real-time cart updates
- **Order Management**: Complete order lifecycle from creation to delivery
- **Product Images**: Multi-image upload and gallery support
- **Responsive Product Cards**: Grid and list view options

### 🌍 Internationalization (i18n)
- **Multi-language support**: English and Persian (Farsi)
- **RTL/LTR layout support**: Automatic direction switching
- **Localized content**: Complete translation coverage
- **Language switcher**: Easy language selection in UI

### 🎨 Modern UI/UX
- **Shadcn/UI Components**: Beautiful, accessible component library
- **Radix UI Primitives**: Unstyled, accessible components
- **Responsive Design**: Mobile-first approach with tablet and desktop optimization
- **Dark Mode Support**: Theme switching capability
- **Custom Color Palette**: Navy blue and gold brand colors
- **Smooth Animations**: Framer Motion for fluid interactions
- **Loading States**: Skeleton loaders and progress indicators

### 📊 Data Visualization
- **Charts & Graphs**: Recharts integration for analytics
- **Real-time Updates**: Live data with SWR
- **Performance Metrics**: Visual representation of key metrics
- **Order Timeline**: Visual order status tracking

### 🔔 Notifications & Alerts
- **Toast Notifications**: React Toastify for user feedback
- **Browser Notifications**: Push notification support
- **Alert System**: Custom alert components for important messages

---

## 🛠️ Tech Stack

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
│   │   │   └── login/           # Login page with components
│   │   │       ├── components/  # Phone, Password, Complete Info
│   │   │       └── page.tsx
│   │   └── (user)/              # Protected user routes
│   │       ├── admin/           # Admin dashboard
│   │       │   ├── dashboard/   # Admin overview
│   │       │   ├── orders/      # All orders management
│   │       │   ├── users-kyc/   # KYC verification
│   │       │   └── audit-logs/  # Activity tracking
│   │       ├── supplier/        # Supplier dashboard
│   │       │   ├── dashboard/   # Supplier overview
│   │       │   ├── products/    # Product management
│   │       │   ├── orders/      # Supplier orders
│   │       │   └── pricing/     # Pricing configuration
│   │       ├── buyer/           # Buyer dashboard
│   │       │   ├── dashboard/   # Buyer overview
│   │       │   ├── catalog/     # Product browsing
│   │       │   ├── cart/        # Shopping cart
│   │       │   ├── orders/      # Order history
│   │       │   └── favorites/   # Saved products
│   │       ├── profile/         # User profile management
│   │       ├── about/           # About page
│   │       ├── privacy/         # Privacy policy
│   │       └── contact/         # Contact page
│   ├── api/                     # API documentation
│   │   └── api.md              # API endpoints reference
│   ├── globals.css             # Global styles
│   └── layout.tsx              # Root layout
├── components/                  # Reusable components
│   ├── ui/                     # Shadcn UI components (51 components)
│   ├── layout/                 # Layout components
│   ├── magicui/                # Magic UI components
│   ├── header.tsx              # Main header
│   ├── footer.tsx              # Main footer
│   └── ...                     # Other shared components
├── dictionaries/               # i18n translations
│   ├── en.json                # English translations
│   ├── fa.json                # Persian translations
│   └── ...
├── lib/                        # Utility libraries
│   ├── mock-data.ts           # Mock data for development
│   └── buyer-mock-data.ts     # Buyer-specific mock data
├── services/                   # API service layer
├── contexts/                   # React contexts
├── constants/                  # App constants
├── public/                     # Static assets
│   ├── img/                   # Images
│   └── fonts/                 # Custom fonts
├── tailwind.config.js         # Tailwind configuration
├── next.config.js             # Next.js configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies
└── README.md                  # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20.9.0 or higher
- **npm** or **yarn**: Package manager
- **Git**: Version control

### Installation

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

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=your_api_url
   NEXT_PUBLIC_WEBSITE_URL=http://localhost:3000
   NEXT_PUBLIC_ENVIRONMENT=development
   USE_MOCK_DATA=true
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm run start
```

---

## 👤 User Roles

### **Admin**
- Full platform access
- User management and KYC approval
- Order oversight across all suppliers and buyers
- Audit log access
- System configuration

### **Supplier**
- Product catalog management
- Inventory control
- Order fulfillment
- Pricing configuration
- Sales analytics

### **Buyer (Retailer)**
- Product browsing and search
- Shopping cart management
- Order placement and tracking
- Favorites management
- Profile management

---

## 🌐 Internationalization

GoldHub supports multiple languages with automatic locale detection:

### Supported Languages
- **English (en)**: Default language
- **Persian (fa)**: Full RTL support with Jalali calendar

### Language Structure
```typescript
// dictionaries/en.json
{
  "appName": "GoldHub",
  "login": "Login",
  "dashboard": "Dashboard",
  // ... 1800+ translation keys
}
```

### Usage in Components
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

---

## 🔌 API Integration

### API Base URL
Configure via environment variable:
```env
NEXT_PUBLIC_API_URL=https://api.goldhub.com
```

### Authentication
All API requests use Bearer token authentication:
```typescript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### Key Endpoints

#### **Products**
- `GET /v1/gold_artifacts/products_list` - List products with filters
- `POST /v1/gold_artifacts/product_create` - Create product
- `PATCH /v1/gold_artifacts/product_update/{id}` - Update product
- `POST /v1/gold_artifacts/product_add_image/{id}` - Add product image
- `DELETE /v1/gold_artifacts/product_delete_image/{id}` - Delete image

#### **Cart & Orders**
- `GET /v1/gold_artifacts/cart_detail` - Get cart details
- `POST /v1/gold_artifacts/add_to_cart` - Add to cart
- `POST /v1/gold_artifacts/remove_from_cart` - Remove from cart
- `POST /v1/gold_artifacts/submit_order` - Submit order
- `POST /v1/gold_artifacts/pay_order/{id}` - Pay for order
- `GET /v1/gold_artifacts/orders_history` - Order history
- `GET /v1/gold_artifacts/sells_history` - Sales history
- `POST /v1/gold_artifacts/update_order_status` - Update order status

#### **Admin**
- `GET /v1/gold_artifacts/users_list` - List all users
- `POST /v1/gold_artifacts/set_KYC_status` - Update KYC status

### Mock Data Mode
Toggle between real API and mock data:
```env
USE_MOCK_DATA=true  # Use mock data
USE_MOCK_DATA=false # Use real API
```

---

## 🎨 Design System

### Color Palette

#### **Primary Colors**
- **Navy Blue**: `#061324` (Primary brand color)
- **Gold**: `#F0A202` (Accent color)

#### **Background Colors**
- **Light Background**: `#F5F5F0`
- **Card Background**: `#FFFFFF`
- **Sidebar**: `#061324`

#### **Status Colors**
- **Confirmed**: Yellow (`#FEF3C7` bg, `#92400E` text)
- **Shipped**: Blue (`#DBEAFE` bg, `#1E40AF` text)
- **Delivered**: Green (`#D1FAE5` bg, `#065F46` text)
- **Pending**: Yellow (`#FEF3C7` bg, `#92400E` text)
- **Draft**: Gray (`#F3F4F6` bg, `#4B5563` text)

### Typography
- **Font Family**: System fonts with fallbacks
- **Headings**: Bold, navy blue
- **Body**: Regular weight, dark gray

### Components
All UI components are built with:
- **Shadcn/UI**: 51+ pre-built components
- **Radix UI**: Accessible primitives
- **Custom variants**: Tailored to brand colors

### Responsive Breakpoints
```javascript
screens: {
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1400px',
}
```

---

## 📜 Scripts

```json
{
  "dev": "next dev",           // Start development server
  "build": "next build",       // Build for production
  "start": "next start",       // Start production server
  "lint": "next lint"          // Run ESLint
}
```

### Development Workflow
```bash
# Start development
npm run dev

# Build and test production build
npm run build
npm run start

# Lint code
npm run lint
```

---

## 🔐 Environment Variables

### Required Variables
```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.goldhub.com

# Website URL
NEXT_PUBLIC_WEBSITE_URL=https://goldhub.com

# Environment
NEXT_PUBLIC_ENVIRONMENT=production

# Feature Flags
USE_MOCK_DATA=false
```

### Optional Variables
```env
# Sentry (Error Tracking)
SENTRY_DSN=your_sentry_dsn
SENTRY_ORG=sahmeto
SENTRY_PROJECT=front

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# GrowthBook (Feature Flags)
NEXT_PUBLIC_GROWTHBOOK_API_KEY=your_growthbook_key
```

---

## 🚢 Deployment

### Docker Deployment

1. **Build Docker image**
   ```bash
   docker build -t goldhub .
   ```

2. **Run container**
   ```bash
   docker run -p 3000:3000 goldhub
   ```

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

### GitLab CI/CD
The project includes `.gitlab-ci.yml` for automated deployments.

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Style
- Follow TypeScript best practices
- Use Prettier for formatting
- Follow ESLint rules
- Write meaningful commit messages

---

## 📄 License

This project is proprietary software. All rights reserved for GoldHub Company.

---

## 📞 Support

For support and questions:
- **Email**: support@goldhub.com
- **Website**: [https://goldhub.com](https://goldhub.com)
- **Address**: Tehran, Amirabrad, North Kargar, University of Tehran Technical Faculty Building, Nextra Coworking Space, No. 1450

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
