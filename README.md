# Job CRM

Employees create jobs and click **Send CRM**; the Sales Team sees them instantly and can Pass, Approve or Delete.
Stack: Next.js 14 (App Router) · Supabase (Auth, Postgres, Realtime) · Tailwind · Vercel.

## Routes
| Route | Who | What |
|---|---|---|
| `/employee/login`, `/employee/forgot` | public | Employee sign in / reset |
| `/employee/dashboard` | employee | New job (Save / Send CRM), Job ID lookup, recent jobs |
| `/employee/job/[number]` | employee | Details, Delete JOB, Resend CRM |
| `/sales/login`, `/sales/forgot` | public | Sales sign in / reset |
| `/sales/leads` | sales | Live leads, Pass / Approved / Delete |
| `/sales/history` | sales | History table, search, CSV export |
| `/auth/callback`, `/auth/reset-password` | email link | Password reset |

## Setup (about 15 minutes, all free tiers)
1. **Supabase**: create a project at supabase.com.
2. **Database**: SQL Editor → paste `supabase/schema.sql` → Run.
3. **Auth settings** (Authentication):
   - Providers → Email: keep enabled; turn **off** "Allow new users to sign up" (accounts are admin-created, so nobody can pick a role).
   - URL Configuration → Site URL: your Vercel URL (or `http://localhost:3000` for dev).
   - Redirect URLs: add `http://localhost:3000/auth/callback` and `https://YOUR-APP.vercel.app/auth/callback`.
4. **Create accounts**: Authentication → Users → Add user (tick "Auto confirm"). Then give each exactly one role in SQL Editor:
   ```sql
   insert into public.profiles (id, role, full_name)
   select id, 'employee', 'Asha Employee' from auth.users where email = 'asha@company.com';

   insert into public.profiles (id, role, full_name)
   select id, 'sales', 'Sam Sales' from auth.users where email = 'sam@company.com';
   ```
   `profiles.id` is the primary key, so one account can never hold both roles.
5. **Run locally**:
   ```bash
   cp .env.example .env.local   # paste Project URL + anon key (Settings → API)
   npm install
   npm run dev
   ```
6. **Deploy**: push to GitHub → import in Vercel → add the same two env vars → Deploy. Then add the Vercel URL to Supabase Site URL / Redirect URLs.

## How the rules are enforced
- **Separate logins**: each login form checks the account's role and signs out on a mismatch. Middleware also redirects a signed-in user away from the other portal.
- **Strict roles**: one `profiles` row per account; no app code can write to it.
- **Send CRM → instantly in sales list**: the job's status becomes `sent`; the leads page subscribes to Supabase Realtime and refreshes.
- **Security lives in the database** (Row Level Security): employees only see their own jobs; sales only see `sent` jobs; employees can't change counts; each sales user has one vote per job (they can change it).
- **Password reset**: email link → `/auth/callback` → `/auth/reset-password` → back to the right login.
"# CRM-Testing" 
"# CRM-Testing" 
