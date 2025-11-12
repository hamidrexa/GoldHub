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
    - Select from available guarantee types with "افزودن تضمین" (Add Guarantee) button
    - Customize profit share percentage for each selected guarantee type
    - Settlement types (آبشده, کیف داریک, ریالی, مصنوع و سکه)
    - Automatic profit share calculation based on selected guarantees
  - Two-level form workflow:
    - **Level 1**: Basic information (name, description, investment range, duration)
    - **Level 2**: Guarantee types selection and profit share configuration
  - Assign contract types to specific brokers
  - Activate/deactivate contract types

- **Guarantee Type Management** (`مدیریت تضامین`)
  - Create and manage guarantee types (e.g., ملک, چک)
  - Set default profit share percentages for each guarantee type
  - Add descriptions and additional details for each guarantee type
  - Track owner of each guarantee type (admin who created it)
  - View usage statistics of each guarantee type
  - Edit existing guarantee types
  - Delete unused guarantee types

- **System Overview**
  - Dashboard with key metrics
  - Broker performance statistics
  - Contract analytics
  - Guarantee type utilization reports

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

Each broker gets a unique public marketing page designed for maximum conversion:

- **URL Format**: `NEXT_PUBLIC_WEBSITE_URL/[broker-username]` // example: talanow.ir/9120000001
- **Features**:
  - **Professional broker profile display** with gradient designs and modern UI
  - **Broker contact information** and credentials
  - **Active contract types display** - Only shows contract types with `status='active'`
  - **Individual CTAs per contract type** - Each contract has its own "Start Contract" button
  - **Automatic broker referral tracking** - Saves broker ID in cookie (30 days) for attribution
  - **Smart member registration flow**:
    - Non-authenticated users → Redirected to login/signup
    - After authentication → Automatically linked to broker as member
    - Existing members of other brokers → Cannot join new broker (restriction enforced)
  - **In-page contract creation**:
    - Modal dialog for contract details
    - Real-time validation (min/max investment, duration)
    - Profit calculator preview
    - Contract saved to `talanow_contracts` table with status='pending'
  - **Trust indicators** - Security, guaranteed profit, professional support badges
  - **No authentication required for viewing**
  - **Mobile-responsive design** with hover effects and animations

### 📊 Contract System

- Multiple contract types with flexible parameters
- Support for various guarantee types with customizable profit shares
- Multiple settlement options
- Configurable profit sharing per guarantee type
- Duration-based contracts (1-12 months)
- Status tracking (active, pending, completed)

#### Admin Workflow for Contract Type Management

1. **Setup Guarantee Types** (`مدیریت تضامین`):
   - Admin creates guarantee types (e.g., "ملک", "چک") with default profit share percentages
   - Each guarantee type is owned by the admin who created it
   - Guarantee types are marked as 'active' and can be edited/deleted

2. **Create Contract Types**:
   - Admin creates contract type with basic info (name, description, investment range, duration)
   - In step 2, admin adds guarantee types by clicking "افزودن تضمین" (Add Guarantee)
   - Each selected guarantee type can have its profit share customized for this specific contract
   - Total profit share is automatically calculated

3. **Assign to Brokers**:
   - Admin assigns created contract types to specific brokers
   - Only one broker can be assigned per contract type at a time
   - Assignment can be changed or removed as needed

### 🔗 Broker Referral & Member Linking System

The platform implements a sophisticated broker attribution and member management system:

#### Broker Cookie Tracking
- When a user visits a broker's public page, their `broker_id` is saved in a cookie (`tala_broker_ref`)
- Cookie expires after 30 days
- Persists across sessions and page navigations
- Used for attribution when user signs up later

#### Member-Broker Relationship
- **One-to-One Relationship**: Each member can only belong to ONE broker
- **Automatic Linking**: When a user clicks "Start Contract" on a broker's page:
  1. If not authenticated → Redirect to login with return URL
  2. After login → Check if user is already a member of another broker
  3. If not a member → Automatically link user to broker in `talanow_broker_member_link`
  4. If already a member of another broker → Show error, prevent linking
- **Database Table**: `talanow_broker_member_link`
  - `member_id`: User ID (TEXT)
  - `broker_id`: Broker ID (TEXT)
  - Enforces one broker per member

#### Contract Creation Flow
1. User clicks CTA on contract type card
2. System checks authentication status
3. System checks/creates broker membership
4. Opens contract creation dialog
5. User fills contract details (amount, duration, settlement, guarantee)
6. Real-time validation against contract type constraints
7. Contract saved to `talanow_contracts` with `status='pending'`
8. Broker receives notification to approve contract

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
the supabase is rls disabled. and no require RLS policies.

#### 1. about contact:

##### `talanow_guarantee_types`
```sql
CREATE TABLE talanow_guarantee_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    profit_share NUMERIC DEFAULT 0,
    description TEXT,
    owner TEXT NOT NULL, -- user id of admin who created the guarantee type
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

##### `talanow_contract_types`
```sql
CREATE TABLE talanow_contract_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    min_investment NUMERIC,
    max_investment NUMERIC,
    guarantee_type_ids UUID[] NOT NULL DEFAULT '{}',
    min_duration_months INTEGER NOT NULL,
    max_duration_months INTEGER NOT NULL,
    settlement_type TEXT[] NOT NULL DEFAULT '{}',
    profit_share NUMERIC,
    status TEXT NOT NULL DEFAULT 'inactive',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

##### `talanow_contracts`
```sql
CREATE TABLE talanow_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    broker_id TEXT NOT NULL,
    contract_type_id UUID NOT NULL REFERENCES talanow_contract_types(id) ON DELETE RESTRICT,
    amount_rls BIGINT NOT NULL,
    guarantee_type_ids UUID[] NOT NULL DEFAULT '{}',
    duration_months INTEGER NOT NULL,
    settlement_type TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2. about broker:

##### `talanow_brokers`
```sql
CREATE TABLE IF NOT EXISTS talanow_brokers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id TEXT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    nickname TEXT,
    email TEXT,
    phone_number TEXT,
    status TEXT NOT NULL DEFAULT 'inactive',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

##### `talanow_broker_contract_types_link`
```sql
CREATE TABLE talanow_broker_contract_types_link (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id TEXT NOT NULL,
    contract_type_id UUID NOT NULL REFERENCES talanow_contract_types(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

##### `talanow_broker_member_link`
```sql
CREATE TABLE IF NOT EXISTS talanow_broker_member_link (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id TEXT NOT NULL,
  broker_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Key Service Functions

The `services/supabase.ts` file provides the following functions:

#### Broker Functions
- `getBrokers()` - Fetch all brokers
- `getBrokerMembers(brokerId)` - Get members for a broker
- `getBrokerSummary(brokerId)` - Get broker statistics
- `getContractTypesForBroker(brokerId)` - Get assigned contract types
- `getBrokerContractsSummary(brokerId)` - Get contract analytics
- `getBrokerByUsername(username)` - Find broker by username
- `getBrokerMembershipForUser(memberId)` - Get broker membership for a user
- `linkMemberToBroker(memberId, brokerId)` - Link a member to a broker

#### Contract Type Functions
- `createContractType(data)` - Create new contract type
- `updateContractType(id, data)` - Update contract type
- `deactivateContractType(id)` - Deactivate contract type
- `createContract(data)` - Create new contract
- `getContractsForUser(userId)` - Get user contracts

#### Guarantee Type Functions
- `getGuaranteeTypes()` - Fetch all active guarantee types
- `getGuaranteeTypesForAdmin(userId)` - Fetch guarantee types created by specific admin
- `createGuaranteeType(data)` - Create new guarantee type with owner field
- `updateGuaranteeType(id, updates)` - Update guarantee type
- `deleteGuaranteeType(id)` - Delete guarantee type

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
    "phone_number": "9120000001",
        "groups": [
            {
                "id": 1,
                "name": "broker"
            }
        ],
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
- `NEXT_PUBLIC_WEBSITE_URL`
- `NEXT_PUBLIC_API_URL` // for connect to back-end api not supabase

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
