
import Image from 'next/image';
import { AppLogo } from '@/components/app-logo';
import { placeHolderImages } from '@/lib/placeholder-images';
import { AuthForm } from './auth-form';

export default function LoginPage() {
  const loginImage = placeHolderImages.find(p => p.id === 'login-bg');
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12 px-4" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/wood-grain.png')", backgroundSize: 'auto', backgroundRepeat: 'repeat' }}>
        <div className="mx-auto grid w-[350px] gap-6 bg-card p-8 rounded-lg shadow-lg">
          <div className="grid gap-2 text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
              <h1 className="text-3xl font-bold font-headline">
                ELECPRO-HUB
              </h1>
            </div>
            <p className="text-balance text-muted-foreground">
              Your all-in-one toolkit for modern electrical work.
            </p>
          </div>
          <AuthForm />
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        {loginImage && (
          <Image
            src={loginImage.imageUrl}
            alt={loginImage.description}
            width="1280"
            height="853"
            data-ai-hint={loginImage.imageHint}
            className="h-full w-full object-cover dark:brightness-[0.4]"
          />
        )}
      </div>
    </div>
  );
}
