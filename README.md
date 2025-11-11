# Tala (طلانو)

A comprehensive Next.js-based investment platform for gold trading and broker management. Tala enables brokers to create investment contracts, manage members, and provide a secure investment experience.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [User Roles](#user-roles)
- [Database Schema](#database-schema)
- [API Integration](#api-integration)
- [Deployment](#deployment)

## 🎯 Overview

Tala is a multi-language investment platform that connects brokers with investors. The platform allows:
- **Brokers** to create and manage investment contracts
- **Admins** to oversee all brokers and contract types
- **Public users** to view broker profiles and available investment opportunities
- **Members** to participate in investment contracts through their assigned brokers

## ✨ Features

### 🏢 Admin Panel (`/admin`)

The admin panel provides comprehensive management capabilities:

- **Broker Management**
  - View and manage all registered brokers
  - Toggle broker status (active/inactive)
  - Create public marketing pages for brokers
  - Monitor broker activity and assignments

- **Contract Type Management**
  - Create and configure investment contract types
  - Define contract parameters:
    - Investment amount range (min/max)
    - Duration (months)
    - Guarantee types (ملک, چک, سفته)
    - Settlement types (آبشده, کیف داریک, ریالی, مصنوع و سکه)
    - Profit share percentage
  - Assign contract types to specific brokers
  - Activate/deactivate contract types

- **System Overview**
  - Dashboard with key metrics
  - Broker performance statistics
  - Contract analytics

### 👔 Broker Panel (`/broker`)

Brokers have access to:

- **Contract Type Management**
  - View assigned contract types
  - Edit contract parameters (limited scope):
    - Description
    - Min/max investment amounts
    - Min/max duration months
  - Cannot modify: name, guarantee types, settlement types, profit share

- **Member Management**
  - View all assigned members
  - Track member contracts
  - Monitor member activity

- **Dashboard**
  - Summary statistics
  - Active contracts overview
  - Member count and engagement

### 🌐 Public Broker Pages (`/[username]`)

Each broker gets a unique public marketing page:

- **URL Format**: `NEXT_PUBLIC_WEBSITE_URL/[broker-username]` // example: talanow.ir/9120000001
- **Features**:
  - Professional broker profile display
  - Broker contact information
  - List of active contract types
  - Call-to-action for starting contracts
  - No authentication required for viewing
  - Mobile-responsive design

### 📊 Contract System

- Multiple contract types with flexible parameters
- Support for various guarantee types
- Multiple settlement options
- Configurable profit sharing
- Duration-based contracts (1-12 months)
- Status tracking (active, pending, completed)

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14.2.4 (App Router)
- **Language**: TypeScript 5.3.3
- **Styling**: Tailwind CSS 3.4.1
- **UI Components**: 
  - Radix UI primitives
  - shadcn/ui components
  - Lucide React icons
- **State Management**: React Context API
- **Forms**: React Hook Form + Zod validation
- **Data Fetching**: SWR
- **Animations**: Framer Motion

### Backend & Services
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom auth system
- **API**: External REST API integration
- **Monitoring**: Sentry
- **Analytics**: GrowthBook

### Development Tools
- **Package Manager**: Yarn 1.22.22
- **Node Version**: 20.9.0
- **Linting**: ESLint + Prettier
- **Deployment**: Docker + GitLab CI

## 📁 Project Structure

```
tala/
├── app/
│   └── [lang]/              # Internationalization support
│       └── (user)/          # Authenticated user routes
│           ├── [username]/  # Public broker pages
│           │   ├── components/
│           │   │   └── broker-public-page.tsx
│           │   └── page.tsx
│           ├── admin/       # Admin panel
│           │   ├── components/
│           │   │   ├── admin-overview.tsx
│           │   │   ├── broker-list.tsx
│           │   │   ├── contract-types.tsx
│           │   │   └── guard.tsx
│           │   └── page.tsx
│           └── broker/      # Broker panel
│               ├── components/
│               │   ├── contract-types.tsx
│               │   ├── member-list.tsx
│               │   └── guard.tsx
│               └── page.tsx
├── components/              # Shared UI components
│   └── ui/                 # Reusable UI primitives
├── services/               # External service integrations
│   └── supabase.ts        # Supabase client & queries
├── contexts/              # React contexts
├── dictionaries/          # i18n translations
├── libs/                  # Utility libraries
└── public/               # Static assets

```

## 🚀 Getting Started

### Prerequisites

- Node.js 20.9.0
- Yarn 1.22.22
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tala
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env` file with:
   ```env
   NEXT_PUBLIC_API_URL=<your-api-url>
   NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   ```

4. **Run the development server**
   ```bash
   yarn dev
   ```

5. **Open the application**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
yarn build
yarn start
```

## 👥 User Roles

### 1. Admin
- Full system access
- Manage all brokers
- Create and assign contract types
- System-wide analytics

### 2. Broker
- Manage assigned members
- View and edit assigned contract types
- Access to broker dashboard
- Public profile page

### 3. Member
- View available contracts
- Create investment contracts
- Track personal investments
- Linked to specific broker

### 4. Public User
- View broker public pages
- Browse available contract types
- No authentication required

## 🗄 Database Schema

### Core Tables (Supabase)

#### `talanow_brokers`
```sql
CREATE TABLE talanow_brokers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id TEXT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    nickname TEXT NOT NULL,
    email TEXT,
    phone_number TEXT,
    status TEXT NOT NULL DEFAULT 'inactive',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `talanow_contract_types`
```sql
CREATE TABLE talanow_contract_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    min_investment NUMERIC,
    max_investment NUMERIC,
    guarantee_type TEXT[] NOT NULL, -- ['ملک', 'چک', 'سفته']
    min_duration_months INTEGER NOT NULL,
    max_duration_months INTEGER NOT NULL,
    settlement_type TEXT[] NOT NULL, -- ['آبشده', 'کیف داریک', 'ریالی', 'مصنوع و سکه']
    profit_share NUMERIC,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `talanow_broker_contract_types_link`
```sql
CREATE TABLE talanow_broker_contract_types_link (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id TEXT NOT NULL,
    contract_type_id UUID NOT NULL REFERENCES talanow_contract_types(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `talanow_broker_member_link`
```sql
CREATE TABLE talanow_broker_member_link (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id TEXT NOT NULL,
    member_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `talanow_contracts`
```sql
CREATE TABLE talanow_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    broker_id TEXT NOT NULL,
    contract_type_id UUID NOT NULL REFERENCES talanow_contract_types(id),
    amount_rls NUMERIC NOT NULL,
    guarantee_type TEXT, -- 'ملک' | 'چک' | 'سفته'
    duration_months INTEGER NOT NULL,
    settlement_type TEXT NOT NULL, -- 'آبشده' | 'کیف داریک' | 'ریالی' | 'مصنوع و سکه'
    status TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Key Service Functions

The `services/supabase.ts` file provides the following functions:

- `getBrokers()` - Fetch all brokers
- `getBrokerMembers(brokerId)` - Get members for a broker
- `getBrokerSummary(brokerId)` - Get broker statistics
- `getContractTypesForBroker(brokerId)` - Get assigned contract types
- `getBrokerContractsSummary(brokerId)` - Get contract analytics
- `createContractType(data)` - Create new contract type
- `updateContractType(id, data)` - Update contract type
- `deactivateContractType(id)` - Deactivate contract type
- `createContract(data)` - Create new contract
- `getContractsForUser(userId)` - Get user contracts
- `getBrokerByUsername(username)` - Find broker by username

## 🔌 API Integration

### External API Endpoint

**Primary Broker List**
```
GET /v1/users/group_users?group_name=broker
```

Response:
```json
[
  {
    "id": 3164,
    "username": "9120000001",
    "email": "broker@talanow.com",
    "first_name": "بروکر",
    "last_name": "1",
    "phone_number": "9120000001"
  }
]
```

### Authentication
- Uses cookie-based authentication
- Token stored in `token` cookie
- Authorization header: `Bearer <token>`

## 🚢 Deployment

### Docker

Build and run with Docker:

```bash
docker build -t tala .
docker run -p 3000:3000 tala
```

### GitLab CI/CD

The project includes a `.gitlab-ci.yml` configuration for automated deployment.

### Environment Variables

Required production environment variables:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SENTRY_DSN` (optional)

## 📝 Development Guidelines

### Code Style
- TypeScript strict mode enabled
- ESLint + Prettier for code formatting
- Tailwind CSS for styling
- Component-driven architecture

### Internationalization
- Persian (fa) as primary language
- Multi-language support via `[lang]` route segment
- Dictionary-based translations

### Security
- Server-side authentication checks
- Role-based access control (Guards)
- Secure API communication
- Environment variable protection

## 🔮 Future Enhancements

- Broker statistics on public pages (active contracts, members)
- Testimonials section for brokers
- Custom broker bio/description
- Social media integration
- Analytics tracking for page views
- Advanced filtering for contract types
- Real-time notifications
- Mobile app development

## 📄 License

Private and proprietary.

## 🤝 Contributing

This is a private project. Contact the development team for contribution guidelines.

---

**Built with ❤️ for the Gold investment platform**
