
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  sendPasswordResetEmail,
} from "firebase/auth"

import { useAuth } from "@/firebase"
import {
    initiateEmailSignIn,
    initiateEmailSignUp,
} from '@/firebase/non-blocking-login';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { useUser } from '@/firebase/auth/use-user';


const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
})

type AuthFormValues = z.infer<typeof formSchema>

export function AuthForm({ adminEmail }: { adminEmail: string | undefined }) {
  const [mode, setMode] = useState<"signin" | "signup" | "reset">("signin")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const auth = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    // This effect redirects the user to the dashboard if they are already logged in.
    if (!isUserLoading && user) {
        router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleAuthAction = async (data: AuthFormValues) => {
    setIsSubmitting(true)
    setError(null)
    try {
      if (mode === "signup") {
        initiateEmailSignUp(auth, data.email, data.password, adminEmail)
      } else {
        initiateEmailSignIn(auth, data.email, data.password, adminEmail)
      }
      // The redirect is now handled by the useEffect hook above and the DashboardLayout.
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePasswordReset = async () => {
    const email = form.getValues("email")
    if (!email) {
      form.setError("email", {
        type: "manual",
        message: "Please enter your email to reset your password.",
      })
      return
    }
    setIsSubmitting(true)
    setError(null)
    try {
      await sendPasswordResetEmail(auth, email)
      toast({
        title: "Password Reset Email Sent",
        description:
          "Please check your inbox for instructions to reset your password.",
      })
      setMode("signin")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleMode = () => {
    setMode(prevMode => (prevMode === "signin" ? "signup" : "signin"))
    setError(null)
    form.reset()
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleAuthAction)}
          className="grid gap-4"
        >
          {mode !== "reset" && (
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="youremail@account.com"
                        {...field}
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                     <div className="flex items-center">
                        <FormLabel>Password</FormLabel>
                        {mode === "signin" && (
                            <button
                            type="button"
                            onClick={() => setMode("reset")}
                            className="ml-auto inline-block text-sm underline"
                            >
                            Forgot your password?
                            </button>
                        )}
                    </div>
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {mode === "reset" && (
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email to reset password"
                      {...field}
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {mode === "reset" ? (
            <Button
              type="button"
              onClick={handlePasswordReset}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Reset Email"}
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting || isUserLoading}>
              {isSubmitting || isUserLoading
                ? "Processing..."
                : mode === "signin"
                ? "Login"
                : "Sign Up"}
            </Button>
          )}
        </form>
      </Form>

      <div className="mt-4 text-center text-sm">
        {mode === "signin" && (
          <>
            Don't have an account?{" "}
            <button onClick={toggleMode} className="underline">
              Sign up
            </button>
          </>
        )}
        {mode === "signup" && (
          <>
            Already have an account?{" "}
            <button onClick={toggleMode} className="underline">
              Login
            </button>
          </>
        )}
        {mode === "reset" && (
            <button onClick={() => setMode('signin')} className="underline">
                Back to Login
            </button>
        )}
      </div>
    </div>
  )
}
