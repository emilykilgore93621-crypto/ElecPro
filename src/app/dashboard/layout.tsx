
"use client"

import Link from "next/link";
import {
  Menu,
  User,
  LogOut,
  Cog,
  Crown,
  AlertTriangle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, createContext, useContext } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";


import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { AppLogo } from "@/components/app-logo";
import { MainNav } from "@/components/main-nav";
import { useAuth, useUser, useFirestore } from "@/firebase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

// --- Subscription Context ---
type SubscriptionContextType = {
  subscriptionStatus: string | null;
  handleUpgrade: () => void;
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};
// ----------------------------


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/');
    } else if (user && firestore) {
      const userDocRef = doc(firestore, "users", user.uid);
      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          setSubscriptionStatus(docSnap.data().subscriptionStatus);
        } else {
          // If the user doc doesn't exist, they are on the free tier.
          // The sign-in logic will handle creating it.
          setSubscriptionStatus('free');
        }
      });
      return () => unsubscribe();
    }
  }, [user, isUserLoading, router, firestore]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/');
    } catch (error) {
      console.error("Error signing out: ", error);
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "An error occurred while logging out. Please try again.",
      });
    }
  };

  const handleUpgrade = async () => {
    if (!user || !firestore) return;
    const userDocRef = doc(firestore, 'users', user.uid);
    await setDoc(userDocRef, { subscriptionStatus: 'pro' }, { merge: true });
    toast({
        title: 'Upgrade Successful!',
        description: 'You now have access to all Pro features.',
    });
  };

  if (isUserLoading || !user || subscriptionStatus === null) {
    return (
       <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <SubscriptionContext.Provider value={{ subscriptionStatus, handleUpgrade }}>
      <SidebarProvider>
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
          <Sidebar className="hidden border-r bg-sidebar text-sidebar-foreground md:block">
            <SidebarContent className="flex flex-col">
              <SidebarHeader className="p-4">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold font-headline">
                  <AppLogo className="h-6 w-6 text-sidebar-primary" />
                  <span className="">WattsUp</span>
                </Link>
              </SidebarHeader>
              <div className="flex-1 px-4">
                <MainNav />
              </div>
              {subscriptionStatus === 'free' && (
                <SidebarFooter className="p-4">
                  <Card>
                    <CardHeader className="p-2 pt-0 md:p-4">
                      <CardTitle className="flex items-center gap-2"><Crown className="text-primary"/>Upgrade to Pro</CardTitle>
                      <CardDescription>
                        Unlock all features for just $1.99/month.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-2 pt-0 md:p-4 md:pt-0 flex flex-col gap-2">
                      <Button size="sm" className="w-full" onClick={handleUpgrade}>
                        Upgrade
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">Are you a student or educator? Contact us for a discount.</p>
                    </CardContent>
                  </Card>
                </SidebarFooter>
              )}
            </SidebarContent>
          </Sidebar>
          <div className="flex flex-col">
            <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 md:hidden"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col bg-sidebar text-sidebar-foreground p-0">
                  <SheetHeader className="border-b border-sidebar-border p-4">
                    <Link href="/dashboard" className="flex items-center gap-2 font-semibold font-headline">
                      <AppLogo className="h-6 w-6 text-sidebar-primary" />
                      <span className="">WattsUp</span>
                    </Link>
                    <SheetTitle className="sr-only">Navigation</SheetTitle>
                  </SheetHeader>
                  <div className="flex-1 px-4 py-4">
                  <MainNav />
                  </div>
                </SheetContent>
              </Sheet>
              <div className="w-full flex-1">
                {/* Header content can go here if needed */}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">
                      <Cog className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>Support</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
              <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle className="font-headline">Full Disclosure</AlertTitle>
                  <AlertDescription>
                    It is always better to consult a professional for any electrical repairs if you do not have sufficient knowledge. The information contained herein is to be utilized with careful judgment.
                  </AlertDescription>
              </Alert>
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </SubscriptionContext.Provider>
  );
}
