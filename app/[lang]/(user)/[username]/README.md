# Broker Marketing Page

This directory contains the public marketing page for brokers.

## Overview

Each broker gets a unique public URL based on their username:
- Format: `talanow.ir/[broker-username]`
- Example: `talanow.ir/9120000001`

## Features

1. **Public Access**: No authentication required to view the page
2. **Broker Information**: Displays broker's name, email, and profile
3. **Contract Types**: Shows all active contract types assigned to the broker
4. **Call to Action**: Button to start a contract (redirects to login)

## How It Works

### Route Structure
```
app/[lang]/(user)/[username]/
├── page.tsx                          # Main page component (Server Component)
└── components/
    └── broker-public-page.tsx        # Client component for displaying broker info
```

### Data Flow

1. **Server Side** (`page.tsx`):
   - Fetches broker data from the `talanow_brokers` table in Supabase.
   - Finds broker by username.
   - Returns 404 if the broker is not found.
   - Passes broker data to the client component.

2. **Client Side** (`broker-public-page.tsx`):
   - Displays broker information and contract details in a marketing-friendly layout.

### Supabase Table

The `talanow_brokers` table is used to store broker information:
```sql
CREATE TABLE IF NOT EXISTS talanow_brokers (
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

### Admin Page Updates

On the `/admin` page, under the "لیست بروکرها" section:
1. Display the broker's status as a switch that the admin can toggle.
2. Show the broker's page URL if it exists.
3. If the broker does not have a page, display a "ساخت صفحه" button to create one.

### API Requirements

The primary broker list is fetched from the API:
```
GET /v1/users/group_users?group_name=broker
```

Response example:
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

### Future Enhancements

- Add broker statistics (number of active contracts, members, etc.)
- Add testimonials section
- Add broker's custom description/bio
- Add social media links
- Add analytics tracking for page views
