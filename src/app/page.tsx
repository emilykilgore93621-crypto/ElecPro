
"use client";

import { AppLogo } from '@/components/app-logo';
import { AuthForm } from './auth-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function LoginPage() {
  return (
    <div className="w-full min-h-screen relative">
      {/* Background can be managed here */}
      <div className="absolute inset-0 w-full h-full bg-background -z-10 brightness-50"></div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center text-foreground p-4 bg-background/80">
          <AppLogo className="h-20 w-20 text-primary mb-4" />
          <h1 className="text-5xl md:text-7xl font-bold font-headline mb-4">
            WattsUp
          </h1>
          <p className="text-lg md:text-xl max-w-2xl text-balance text-muted-foreground mb-8">
            Your complete electrical toolkit for residential repairs and installations. Professional calculators, step-by-step guides, and interactive tools for planning your projects.
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="text-lg font-semibold px-8 py-6 rounded-full">
                Get Started Free
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-center text-2xl font-bold font-headline">Welcome</DialogTitle>
                <DialogDescription className="text-center">
                  Sign in or create an account to continue.
                </DialogDescription>
              </DialogHeader>
              <div className="px-6 pb-6">
                <AuthForm />
              </div>
            </DialogContent>
          </Dialog>
      </div>
    </div>
  );
}
