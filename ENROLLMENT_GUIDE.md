# Shomoukh Student Enrollment System

A modern, premium, mobile-responsive student enrollment system built for Shomoukh Early Childhood Education.

## Features

### Multi-Step Form (6 Steps)
1. **Student Data** - Basic student information, languages, and enrollment details
2. **Family Data** - Parent/guardian and family address information
3. **Emergency Contact** - Emergency contact details
4. **Educational Background** - Previous schooling and academic history
5. **Conditions & Waivers** - Terms, conditions, and data processing agreements
6. **Review & Submit** - Final review and submission with confirmation

### Premium Design
- **Shomoukh Branding** - Gold (#C9A84C), white, and dark gray color scheme
- **Elegant Typography** - Plus Jakarta Sans for body, Playfair Display for headers
- **Progress Stepper** - Visual progress indicator with completed step markers
- **Mobile Responsive** - Fully responsive design for all screen sizes
- **Smooth Interactions** - Polished animations and transitions

### Form Management
- **Client-Side State** - React Context for form state management
- **Field Validation** - Real-time validation with error messages
- **Auto-Save** - Form data persists during the session
- **Navigation** - Back/Next buttons for easy step navigation
- **Photo Upload** - Student photo upload with preview

### Admin Features
- **Dashboard** - View all applications with statistics
- **Search & Filter** - Search applications by name, parent, or email
- **Status Tracking** - Track application status (pending, under-review, accepted, rejected)
- **Export Data** - Export applications to CSV format

## Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4 with custom design tokens
- **UI Components**: shadcn/ui components
- **State Management**: React Context API
- **Form Handling**: Custom form validation

## Project Structure

```
app/
├── enrollment/
│   └── context.tsx              # Enrollment form context and state
├── admin/
│   └── page.tsx                 # Admin dashboard
└── page.tsx                      # Main enrollment form page

components/
├── enrollment-stepper.tsx        # Progress stepper component
├── enrollment-step-1.tsx         # Student data form
├── enrollment-step-2.tsx         # Family data form
├── enrollment-step-3.tsx         # Emergency contact form
├── enrollment-step-4.tsx         # Education background form
├── enrollment-step-5.tsx         # Terms & conditions form
└── enrollment-step-6.tsx         # Review & submit page

components/ui/                    # shadcn/ui components
lib/
└── utils.ts                      # Utility functions
```

## Getting Started

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Form Data Structure

The application collects the following information:

### Step 1: Student Data
- Photo upload
- Family Name, Given Names, Middle Name
- Known As (preferred name)
- Date of Birth
- Nationality
- Oman Resident Card Number
- Gender
- First Language Spoken
- Other Language Spoken
- Level of English Spoken
- Enrollment Year
- Anticipated Grade of Entry

### Step 2: Family Data
- Primary Parent/Guardian: Name, Email, Phone, Relationship, Occupation
- Secondary Parent/Guardian: Name, Email, Phone, Relationship, Occupation (optional)
- Family Address, City, Country

### Step 3: Emergency Contact
- Name
- Phone
- Relationship
- Address (optional)

### Step 4: Educational Background
- Previous School Name
- Previous School Country
- Years Attended
- Current Academic Level
- Additional Educational Notes

### Step 5: Conditions & Waivers
- Acceptance of Terms and Conditions
- Acceptance of Privacy Policy
- Consent to Data Processing
- Additional Notes

## Customization

### Colors
Edit the color tokens in `app/globals.css`:
```css
--gold: #C9A84C;
--charcoal: #1E1E2E;
--silver: #F5F4F0;
```

### Form Fields
Modify the form structure in individual step components:
- `components/enrollment-step-1.tsx`
- `components/enrollment-step-2.tsx`
- etc.

### Validation Rules
Update validation logic in `app/enrollment/context.tsx`:
```typescript
const validateStep1 = (): boolean => {
  // Custom validation logic
}
```

## Admin Dashboard

Access the admin dashboard at `/admin` (currently a demo with mock data).

Features:
- View all applications
- Search and filter by status
- Export to CSV
- Statistics overview

## Backend Integration

To connect this to a real backend:

1. **Replace client-side storage** with API calls in the context
2. **Add authentication** to the admin dashboard
3. **Implement database schema** for applications and user data
4. **Add email notifications** on application submission
5. **Create admin approval workflow**

Example API integration points:
- `/api/applications/submit` - Submit form
- `/api/applications` - Fetch applications (admin)
- `/api/applications/[id]` - Get/update application details

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimizations

- Image optimization with Next.js Image component
- CSS minification with Tailwind CSS
- Code splitting and lazy loading
- Responsive images for different screen sizes

## Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Color contrast compliance (WCAG AA)
- Screen reader friendly forms

## Security Considerations

For production deployment:
- Implement HTTPS/SSL
- Add CSRF protection
- Sanitize user inputs
- Use secure session management
- Implement rate limiting on API endpoints
- Add file upload validation for photos

## Deployment

### Deploy to Vercel

```bash
git push origin main
```

The project will automatically deploy when you push to your repository.

### Environment Variables

No environment variables are required for the demo. For production with backend:

```env
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_URL=your_database_url
```

## Support & Documentation

For more information:
- [Next.js Documentation](https://nextjs.org)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

## License

© 2024 Shomoukh Early Childhood Education. All rights reserved.

## Version History

### v1.0.0 (2024-04-01)
- Initial release
- 6-step form workflow
- Admin dashboard
- Mobile responsive design
- Full validation and error handling
