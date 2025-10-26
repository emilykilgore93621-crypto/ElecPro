
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';

import { useAuth, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, FileText } from 'lucide-react';

const formSchema = z
  .object({
    currentPassword: z.string().min(1, { message: 'Current password is required.' }),
    newPassword: z.string().min(6, { message: 'New password must be at least 6 characters.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type PasswordFormValues = z.infer<typeof formSchema>;

export default function SettingsPage() {
  const auth = useAuth();
  const { user } = useUser();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleChangePassword = async (data: PasswordFormValues) => {
    if (!user || !user.email) {
      setError('User not found. Please log in again.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Re-authenticate the user
      const credential = EmailAuthProvider.credential(user.email, data.currentPassword);
      await reauthenticateWithCredential(user, credential);

      // If re-authentication is successful, update the password
      await updatePassword(user, data.newPassword);

      toast({
        title: 'Success!',
        description: 'Your password has been updated.',
      });
      form.reset();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while changing your password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Settings</h1>
      </div>
      <div className="max-w-xl grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className='font-headline'>Change Password</CardTitle>
            <CardDescription>
              Update your password here. Please use a strong, unique password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleChangePassword)} className="grid gap-4">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input placeholder="••••••••" {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input placeholder="••••••••" {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input placeholder="••••••••" {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" disabled={isSubmitting} className="mt-2">
                  {isSubmitting ? 'Updating...' : 'Change Password'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='font-headline'>User Rights &amp; Privacy</CardTitle>
             <CardDescription>
                Information regarding your data and privacy on this platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div>
                <h3 className="font-semibold mb-2">Your Rights</h3>
                <p className="text-sm text-muted-foreground">
                    As a user, you have the right to access, rectify, or erase your personal data stored on our platform. You can manage your account information directly from this settings page. For complete data deletion, please contact our support team.
                </p>
             </div>
              <div>
                <h3 className="font-semibold mb-2">Data Privacy</h3>
                <p className="text-sm text-muted-foreground">
                    We are committed to protecting your privacy. We only collect data that is essential for the application to function, such as your user authentication details. We do not sell or share your data with third parties. All user-generated content, such as canvas diagrams, is stored securely and is only accessible to you.
                </p>
             </div>
             <Button variant="outline">
                <FileText className="mr-2 h-4 w-4"/>
                View Full Privacy Policy
             </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
