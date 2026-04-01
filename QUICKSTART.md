# Quick Start Guide - Shomoukh Enrollment System

## 🚀 Get Started in 3 Steps

### 1. Installation

```bash
# Clone or download the project
# Then install dependencies:
pnpm install
# or
npm install
```

### 2. Run Development Server

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Start Using

The enrollment form will load automatically. Start filling out the form from **Step 1: Student Data**.

---

## 📍 Where to Go

- **Enrollment Form**: `http://localhost:3000/`
- **Admin Dashboard**: `http://localhost:3000/admin` (demo with mock data)

---

## 🎯 Key Features at a Glance

### Form Steps (6 Total)
1. ✅ **Student Data** - Basic info, languages, enrollment details
2. ✅ **Family Data** - Parent/guardian and address
3. ✅ **Emergency Contact** - Emergency contact info
4. ✅ **Education** - Previous schooling (optional)
5. ✅ **Terms** - Agreements and waivers
6. ✅ **Submit** - Review and submit

### Smart Features
- 📸 **Photo Upload** - Student photo with preview
- ✔️ **Validation** - Real-time error checking
- 💾 **Auto-Save** - Data persists in session
- 📱 **Mobile Responsive** - Works on all devices
- 🎨 **Premium Design** - Gold, charcoal, and white theme
- ♿ **Accessible** - Screen reader friendly

---

## 🎨 Design Highlights

### Colors Used
- **Gold** (#C9A84C) - Primary accent, buttons, highlights
- **Charcoal** (#1E1E2E) - Main text and headers
- **Silver** (#F5F4F0) - Secondary backgrounds
- **White** (#FAFAF8) - Main background

### Typography
- **Headers** - Playfair Display (elegant serif)
- **Body** - Plus Jakarta Sans (clean, modern)

---

## 📝 Form Data Example

When you complete the form, here's what gets collected:

```
Student Name: Ahmed Al-Manouri
Date of Birth: 2015-03-15
Nationality: Omani
Gender: Male
First Language: Arabic
English Level: Advanced (C1)
Grade: Kindergarten 1
Year: 2024

Parent 1: Mohammed Al-Manouri
Email: mohammed@example.com
Phone: +968 XXXX XXXX
Relationship: Father

Emergency Contact: Khaled Al-Noor
Phone: +968 XXXX XXXX
Relationship: Uncle

Previous School: International School
Country: Oman

Agreements: All accepted ✓
```

---

## 🛠️ Customization Quick Tips

### Change Colors
Edit `app/globals.css`:
```css
--gold: #C9A84C;        /* Change to your brand color */
--charcoal: #1E1E2E;    /* Change primary text color */
--silver: #F5F4F0;      /* Change secondary color */
```

### Add Form Fields
Edit `app/enrollment/context.tsx` to add fields to the Student interface, then update the corresponding step component (e.g., `components/enrollment-step-1.tsx`).

### Change Step Names
Edit `components/enrollment-stepper.tsx`:
```typescript
const STEPS: Step[] = [
  { id: 1, title: 'Your Title', description: 'Your description' },
  // ...
]
```

### Update Validation Rules
Edit `app/enrollment/context.tsx`:
```typescript
const validateStep1 = (): boolean => {
  // Your validation logic here
}
```

---

## 📁 Project Structure Overview

```
📦 Shomoukh Enrollment
├── 📂 app/
│   ├── page.tsx                 ← Main enrollment form
│   ├── admin/page.tsx          ← Admin dashboard
│   ├── enrollment/
│   │   └── context.tsx         ← Form state management
│   ├── layout.tsx
│   └── globals.css             ← Colors & fonts
├── 📂 components/
│   ├── enrollment-*.tsx        ← Form steps (1-6)
│   ├── enrollment-stepper.tsx  ← Progress indicator
│   └── ui/                     ← shadcn/ui components
├── 📂 lib/
│   └── utils.ts               ← Helper functions
├── package.json
└── QUICKSTART.md              ← This file
```

---

## 🚀 Build for Production

```bash
# Build the app
pnpm build

# Start production server
pnpm start
```

---

## 🆘 Common Issues & Solutions

### Issue: "Module not found" error
**Solution**: Make sure all dependencies are installed:
```bash
pnpm install
```

### Issue: Form not validating
**Solution**: Check that required fields have `validateStep` logic in the context file.

### Issue: Styles not applying
**Solution**: Clear Next.js cache:
```bash
rm -rf .next
pnpm dev
```

### Issue: Photo upload not working
**Solution**: Check that the Input component supports file type in `components/ui/input.tsx`.

---

## 📞 Support

For detailed documentation, see:
- `ENROLLMENT_GUIDE.md` - Complete user guide
- `FEATURES.md` - Detailed feature list
- Source code comments in individual components

---

## 🎓 Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui Components](https://ui.shadcn.com)

---

## ✅ Deployment Checklist

Before going live:
- [ ] Test all form steps
- [ ] Test mobile responsiveness
- [ ] Update contact information in footer
- [ ] Add real backend integration
- [ ] Set up email notifications
- [ ] Configure admin authentication
- [ ] Enable HTTPS
- [ ] Add analytics

---

## 🎉 You're Ready!

The system is ready to use. Start the dev server and test the enrollment form. All form data is saved during the session, and you can submit applications and view them in the admin dashboard.

Happy enrolling! 🎓
