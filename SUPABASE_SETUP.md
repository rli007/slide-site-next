# 🚀 Supabase Integration Setup Guide

This guide will walk you through setting up Supabase for your Slide application.

## 📋 Prerequisites

- A Supabase account (free at [supabase.com](https://supabase.com))
- Node.js and npm installed
- Your Slide application running locally

## 🗄️ Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `slide-platform` (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for project setup to complete (2-3 minutes)

## 🔑 Step 2: Get API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ`)

## ⚙️ Step 3: Configure Environment Variables

1. Create a `.env.local` file in your project root:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

2. Replace the placeholder values with your actual Supabase credentials

## 🗃️ Step 4: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql`
3. Paste into the SQL editor and click "Run"
4. This will create:
   - `users` table for user profiles
   - `routes` table for driver routes
   - `deliveries` table for shipping requests
   - Row Level Security (RLS) policies
   - Indexes for performance

## 🔐 Step 5: Configure Authentication

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Under **Site URL**, add: `http://localhost:3000`
3. Under **Redirect URLs**, add:
   - `http://localhost:3000/auth`
   - `http://localhost:3000/role-select`
   - `http://localhost:3000/slider-dashboard`
   - `http://localhost:3000/shipper-dashboard`

## 🧪 Step 6: Test the Integration

1. Restart your Next.js development server:
```bash
npm run dev
```

2. Test the signup flow:
   - Go to `/auth`
   - Create a new account
   - Check Supabase dashboard → **Authentication** → **Users** to see the new user
   - Check **Table Editor** → **users** to see the user profile

## 🔍 Step 7: Verify Database Tables

In Supabase dashboard → **Table Editor**, you should see:

### Users Table
- `id` (UUID, Primary Key)
- `email` (Text, Unique)
- `role` (Text: 'slider' | 'shipper' | null)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Routes Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to users.id)
- `start_location` (Text)
- `end_location` (Text)
- `schedule` (Text)
- `active` (Boolean)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Deliveries Table
- `id` (UUID, Primary Key)
- `shipper_id` (UUID, Foreign Key to users.id)
- `pickup_location` (Text)
- `dropoff_location` (Text)
- `package_size` (Text)
- `status` (Text: 'pending' | 'assigned' | 'in-transit' | 'delivered')
- `route_id` (UUID, Foreign Key to routes.id, nullable)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

## 🚨 Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Check your `.env.local` file has correct values
   - Restart your development server after changing environment variables

2. **"Table doesn't exist" error**
   - Make sure you ran the SQL schema file
   - Check the SQL editor for any error messages

3. **Authentication redirect issues**
   - Verify your redirect URLs in Supabase settings
   - Check browser console for CORS errors

4. **Row Level Security errors**
   - Ensure RLS policies are properly set up
   - Check that users are authenticated before accessing data

### Debug Steps

1. Check browser console for errors
2. Verify Supabase connection in Network tab
3. Check Supabase dashboard → **Logs** for server-side errors
4. Ensure all environment variables are loaded

## 🔒 Security Features

Your Supabase setup includes:

- **Row Level Security (RLS)**: Users can only access their own data
- **Authentication**: Secure user signup/login via Supabase Auth
- **Data Validation**: Database constraints and checks
- **Automatic Timestamps**: Created/updated timestamps for all records

## 📱 Next Steps

After successful setup:

1. **Test all user flows** (signup, role selection, dashboards)
2. **Add real-time features** using Supabase subscriptions
3. **Implement route matching algorithm** using the database
4. **Add payment integration** with Stripe
5. **Deploy to production** with proper environment variables

## 🆘 Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)
- [Next.js Documentation](https://nextjs.org/docs)

---

**Note**: Keep your database password and API keys secure. Never commit `.env.local` to version control!
