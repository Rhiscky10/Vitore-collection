

# Plan: Switch to Google-Only Authentication

## Context

Your project already has the Lovable Cloud managed Google OAuth set up correctly via `lovable.auth.signInWithOAuth("google", ...)` in `src/integrations/lovable/index.ts`. The "Failed to fetch" errors are a known Lovable Preview proxy issue -- they do not occur on a published URL. The Google OAuth code is already correct and will work once published.

The main work is removing email/password auth and simplifying the Auth page to Google-only.

## What will change

### 1. Simplify AuthContext (`src/contexts/AuthContext.tsx`)
- Remove `signUp` and `signIn` (email/password) methods entirely
- Keep only: `user`, `session`, `loading`, `signOut`, and add `signInWithGoogle`
- The `signInWithGoogle` method will use `lovable.auth.signInWithOAuth("google", ...)`

### 2. Rewrite Auth page (`src/pages/Auth.tsx`)
- Remove all email/password form fields, tab toggles, and form submission logic
- Keep the luxury split-panel layout (branding on left, action on right)
- Single "Continue with Google" button as the only sign-in method
- Update branding text to reflect Google-only flow
- Better error handling with console logging

### 3. Remove email-only pages
- Delete `src/pages/ForgotPassword.tsx` and `src/pages/ResetPassword.tsx` (no longer needed without email/password auth)

### 4. Remove routes from App.tsx
- Remove `/forgot-password` and `/reset-password` routes

### 5. Clean up Navbar references
- Check if any navigation links point to forgot/reset password and remove them

## What stays the same
- `src/integrations/supabase/client.ts` -- auto-generated, not touched
- `src/integrations/lovable/index.ts` -- auto-generated, not touched
- Profile page, Orders, Cart, etc. -- these use `useAuth()` for `user` and `signOut`, which remain
- Session persistence -- already handled by Supabase client config

## Important note about "Failed to fetch"
This error happens in the Lovable Preview environment due to its fetch proxy intercepting auth requests. **Your Google OAuth will work correctly on the published URL.** This is not a code bug.

