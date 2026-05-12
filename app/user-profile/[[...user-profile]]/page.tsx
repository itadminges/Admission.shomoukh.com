import { UserProfile } from "@clerk/nextjs";

export default function UserProfilePage() {
  return (
    <div className="min-h-screen bg-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-navy">Account Settings</h1>
          <p className="text-slate-500 mt-2">Manage your profile and security settings</p>
        </div>
        <UserProfile 
          appearance={{
            elements: {
              card: "shadow-xl border border-[#e8e4dc] rounded-2xl",
              navbar: "border-r border-[#e8e4dc]",
              headerTitle: "text-navy font-serif font-bold",
              headerSubtitle: "text-slate-500",
              profileSectionTitleText: "text-navy font-bold",
            }
          }}
          routing="path" 
          path="/user-profile" 
        />
      </div>
    </div>
  );
}
