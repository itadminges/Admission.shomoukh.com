# Shomoukh Enrollment System - Setup Instructions

## ✅ Prerequisites

Before you start, make sure you have:
- Node.js 18+ installed ([Download](https://nodejs.org))
- npm or pnpm installed
- A code editor (VS Code recommended)
- Git (for version control)

## 🚀 Installation Steps

### Step 1: Get the Project

**Option A: Clone from GitHub**
```bash
git clone https://github.com/yourusername/shomoukh-enrollment.git
cd shomoukh-enrollment
```

**Option B: Download & Extract**
1. Download the project ZIP file
2. Extract it to your desired location
3. Open terminal/command prompt in the folder

### Step 2: Install Dependencies

Using pnpm (recommended):
```bash
pnpm install
```

Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

**⏱️ This may take 2-5 minutes depending on your internet speed**

### Step 3: Start Development Server

```bash
pnpm dev
```

Output will show:
```
  ▲ Next.js 16.x.x
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.5s
```

### Step 4: Open in Browser

1. Open your browser
2. Go to `http://localhost:3000`
3. You should see the Shomoukh enrollment form

## 📋 What to Do Next

### Test the Form
1. Fill out Student Data (Step 1)
   - Upload a student photo
   - Fill in all required fields
   - Click "Save & Next"

2. Complete remaining steps (2-5)
   - Family information
   - Emergency contact
   - Education background
   - Terms & agreements

3. Review and submit (Step 6)
   - Check all information
   - Click "Submit Application"
   - See success confirmation

### Try Admin Dashboard
1. Navigate to `http://localhost:3000/admin`
2. You'll see mock application data
3. Try searching and filtering
4. Export to CSV

## 🛠️ Common Commands

### Development
```bash
# Start dev server
pnpm dev

# Open editor
code .

# Check for TypeScript errors
pnpm tsc --noEmit
```

### Building for Production
```bash
# Build the application
pnpm build

# Start production server
pnpm start

# Analyze bundle size
pnpm build --analyze
```

### Other Useful Commands
```bash
# Format code (if configured)
pnpm format

# Run tests (if configured)
pnpm test

# Clean up
rm -rf node_modules .next
pnpm install
```

## 📁 Project Structure After Installation

```
shomoukh-enrollment/
├── app/                          # Next.js app directory
│   ├── page.tsx                  # Main enrollment form
│   ├── admin/page.tsx            # Admin dashboard
│   ├── enrollment/context.tsx    # Form state
│   ├── layout.tsx
│   └── globals.css
├── components/                   # React components
│   ├── enrollment-*.tsx          # Form step components
│   └── ui/                       # shadcn/ui components
├── lib/                          # Utilities
├── public/                       # Static files
├── node_modules/                 # Dependencies (auto-created)
├── package.json
├── tsconfig.json
├── next.config.mjs
└── Documentation files (.md)
```

## 🔧 Configuration Files

### package.json
- Dependencies list
- Scripts for dev/build
- Project metadata

### tsconfig.json
- TypeScript configuration
- Path aliases (@/components, @/app)

### next.config.mjs
- Next.js configuration
- Build optimizations

### app/globals.css
- Design tokens (colors, fonts)
- Global styles
- Tailwind configuration

## 🎨 Customize Your Instance

### Change School Colors

Edit `app/globals.css`:
```css
:root {
  --gold: #C9A84C;        /* Change this */
  --gold-light: #E8C96A;
  --gold-dark: #A07830;
  --charcoal: #1E1E2E;    /* Or this */
  --silver: #F5F4F0;      /* Or this */
}
```

### Change School Name

Edit `app/page.tsx`:
```tsx
<h1 className="font-serif text-3xl sm:text-4xl font-semibold text-white">
  Your School Name  {/* Change here */}
</h1>
```

### Update Contact Information

Edit `app/page.tsx` (footer section):
```tsx
<h4 className="text-white text-sm font-semibold mb-3">Contact</h4>
<p className="text-sm">Your School Address</p>
<p className="text-sm">your-email@school.com</p>
```

## 🚨 Troubleshooting

### Issue: Port 3000 already in use

```bash
# Use a different port
pnpm dev -- -p 3001
# Then visit http://localhost:3001
```

### Issue: Module not found errors

```bash
# Clear cache and reinstall
rm -rf node_modules .next
pnpm install
pnpm dev
```

### Issue: Styles not loading

```bash
# Rebuild Tailwind CSS
pnpm build
```

### Issue: "Cannot find module" for components

```bash
# Check that path aliases in tsconfig.json are correct
# Restart dev server
pnpm dev
```

### Issue: Photo upload not working

```bash
# Check browser console for errors (F12)
# Ensure File API is supported in your browser
# Try a different image format (JPG, PNG)
```

## 📚 Available Documentation

After setup, read these to understand the system:

1. **QUICKSTART.md** (5 min read)
   - Get up and running
   - Quick customization tips

2. **FEATURES.md** (10 min read)
   - Detailed feature breakdown
   - Design system guide

3. **ENROLLMENT_GUIDE.md** (15 min read)
   - Complete feature documentation
   - Technical stack details

4. **SYSTEM_OVERVIEW.md** (10 min read)
   - Visual diagrams
   - Architecture overview
   - Data flows

5. **INTEGRATION_GUIDE.md** (20 min read)
   - Backend integration examples
   - Database schema
   - API endpoint patterns

6. **README_IMPLEMENTATION.md** (15 min read)
   - Implementation summary
   - File structure
   - Development guide

## 🔒 Security Notes

### Current Setup (Development)
- Client-side validation only
- No authentication
- No database (uses session state)
- No file upload restrictions

### Before Going Live
- Set up HTTPS/SSL
- Add backend API
- Implement database
- Add authentication
- Validate file uploads
- Add rate limiting
- Sanitize inputs

See `INTEGRATION_GUIDE.md` for production setup details.

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Option 2: GitHub Pages
```bash
# Build for static export
npm run export

# Push to gh-pages branch
npm run deploy
```

### Option 3: Docker
```bash
# Create Dockerfile
# docker build -t shomoukh-enrollment .
# docker run -p 3000:3000 shomoukh-enrollment
```

See deployment documentation for more options.

## 📞 Getting Help

### If something doesn't work:

1. **Check the error message**
   - Open browser console (F12)
   - Look for error details

2. **Check QUICKSTART.md**
   - Common issues section
   - Quick solutions

3. **Review component files**
   - Check source code comments
   - Understand the logic

4. **Check Next.js docs**
   - https://nextjs.org/docs

## ✨ Next Steps

After successful setup:

1. ✅ Explore the enrollment form
2. ✅ Try the admin dashboard
3. ✅ Customize colors and branding
4. ✅ Read the documentation
5. ✅ Plan backend integration (if needed)
6. ✅ Deploy to production (see docs)

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)

## 🎉 You're Ready!

Congratulations! You now have a fully functional Shomoukh Student Enrollment System running locally.

**Current Status:**
- ✅ Development server running
- ✅ Enrollment form ready
- ✅ Admin dashboard accessible
- ✅ Form validation working
- ✅ Mobile responsive
- ✅ All features functional

### Quick Test Checklist

Before moving forward, test these:
- [ ] Fill out the entire enrollment form
- [ ] Submit an application
- [ ] See success page
- [ ] Navigate to admin dashboard
- [ ] Search for applications
- [ ] Filter by status
- [ ] Test on mobile device

---

**Congratulations! You're all set. Start enrolling! 🎓**

For detailed information, see the other documentation files:
- Quick help? → `QUICKSTART.md`
- Want features? → `FEATURES.md`
- Need integration? → `INTEGRATION_GUIDE.md`
- Technical details? → `README_IMPLEMENTATION.md`
