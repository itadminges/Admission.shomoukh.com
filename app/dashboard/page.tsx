"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, LogOut, User, Mail, Shield, Calendar } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
    router.push(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/sign-in");
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null; // Handled by middleware
  }

  return (
    <div className="min-h-screen bg-muted/40 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <Avatar className="h-16 w-16 border-2 border-primary/10">
                <AvatarImage src={user.imageUrl || ""} alt={user.fullName || "User"} />
                <AvatarFallback className="text-xl bg-primary/5">
                  {user.firstName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{user.fullName}</CardTitle>
                <CardDescription>Welcome back to your account</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-muted rounded-md">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Email Address</p>
                  <p className="text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</p>
                </div>
                <Badge variant="default" className="ml-auto bg-green-500/10 text-green-600 hover:bg-green-500/20 border-none">
                  Verified
                </Badge>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-muted rounded-md">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Account Role</p>
                  <Badge variant="secondary" className="capitalize">
                    {user.publicMetadata?.role as string || "Parent"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-muted rounded-md">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Member Since</p>
                  <p className="text-muted-foreground">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recently"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm bg-primary text-primary-foreground overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <User className="w-32 h-32" />
            </div>
            <CardHeader>
              <CardTitle>Profile Completion</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Keep your information up to date
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                Your profile is currently active. You can start your admission process or check your application status here.
              </p>
              <Button variant="secondary" className="w-full" asChild>
                <Link href="/enrollment">Start Enrollment</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
