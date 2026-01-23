"use client";

import Link from "next/link";
import { useLogin } from "@/hooks/useLogin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, Activity } from "lucide-react"; 

// Using generic Activity icon for logo placeholder until asset is available
const Logo = () => (
  <div className="flex flex-col items-center justify-center mb-6">
    <div className="flex items-center gap-2 mb-2">
        <Activity className="h-8 w-8 text-primary" /> 
        <span className="text-2xl font-bold tracking-tighter">TaskHub.</span>
    </div>
  </div>
);

export default function LoginPage() {
  const { form, role, setRole, onSubmit, isLoggingIn, loginError } = useLogin();

  return (
    <div className="w-full max-w-md mx-auto"> 
      <Logo />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
        <p className="text-muted-foreground">Sign in to manage your {role === 'tasker' ? 'Work' : 'Tasks'}</p>
      </div>

      <div className="space-y-6">
           <div className="grid grid-cols-2 gap-4 mb-6">
                <Button 
                    type="button"
                    variant={role === 'user' ? "default" : "outline"} 
                    className={`w-full ${role === 'user' ? 'bg-primary hover:bg-primary/90' : 'bg-transparent border-input hover:bg-accent hover:text-accent-foreground'}`}
                    onClick={() => setRole('user')}
                >
                    User
                </Button>
                <Button 
                    type="button"
                    variant={role === 'tasker' ? "default" : "outline"} 
                    className={`w-full ${role === 'tasker' ? 'bg-[#6B46C1] hover:bg-[#553C9A] text-white' : 'bg-transparent border-input hover:bg-accent hover:text-accent-foreground'}`}
                    onClick={() => setRole('tasker')}
                >
                    Tasker
                </Button>
           </div>


          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {loginError && (
              <Alert variant="destructive">
                <AlertDescription>
                  {(loginError as Error).message || "An error occurred during login"}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.domain"
                  className="pl-9 h-12 bg-gray-50/50"
                  {...form.register("email")}
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-9 h-12 bg-gray-50/50"
                  {...form.register("password")}
                />
              </div>
               {form.formState.errors.password && (
                <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
              )}
            </div>

            <div className="flex justify-end">
                <Link 
                  href="/forgot-password" 
                  className="text-sm font-medium text-primary hover:underline font-semibold"
                >
                  Forgot password?
                </Link>
            </div>
            
            <Button className="w-full h-12 text-lg font-medium" type="submit" disabled={isLoggingIn}>
              {isLoggingIn ? "Logging in..." : "Login"}
            </Button>
          </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">OR</span>
                </div>
            </div>

            <div className="flex justify-center gap-6">
                {/* Social Login Placeholders */}
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-none shadow-sm bg-gray-50">
                     <svg className="h-6 w-6" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                     </svg>
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-none shadow-sm bg-gray-50">
                     <svg className="h-6 w-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                         <path d="M17.05 20.28c-.98.95-2.05.88-3.08.35-1.09-.56-2.09-.48-3.08.35 1.04 1.79 2.44 2.09 3.08.35zM12.03 5.38c.3.93.98 1.83 2.05 2.1-.55 1.33-1.38 2.07-2.05 2-.69-.07-1.28-.9-2.06-2 .76-1.12 1.48-1.57 2.06-2.1zM21 12.03c-.27 1.06-1.07 2.91-2.91 3.08-.94.09-1.74-.53-2.91-.53-1.17 0-1.97.64-2.91.53-2.91-.32-4.51-4.82-3.08-8.2.98-2.32 2.81-2.31 3.08-.53.27 1.78 1.95 2.05 2.45.18.5-.18 3.51-.18 5.28 3.08.18.35.32.7.45 1.06-.55.35-1.09.88-1.09 1.76 0 1.28.82 2.08 1.64 2.57z"/>
                     </svg>
                </Button>
            </div>
      </div>
          
      <div className="mt-8 text-center text-muted-foreground">
        Do not have an Account ? <Link href="/register" className="text-primary font-semibold hover:underline">Sign up</Link>
      </div>
    </div>
  );
}
