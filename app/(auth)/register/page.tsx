"use client";

import Link from "next/link";
import { useRegister } from "@/hooks/useRegister";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, Phone, User, AlertTriangle } from "lucide-react";
import { Logo } from "@/components/layout/Logo";

export default function RegisterPage() {
  const { form, onSubmit, currentRole, setRole, isRegistering, registerError } = useRegister();

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-center mb-6">
        <Logo />
      </div>
      
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">Join us Today !</h1>
        <p className="text-muted-foreground">Be a part of our platform today, see what is taskable</p>
      </div>

      <div className="space-y-6">
          <Tabs 
              value={currentRole} 
              onValueChange={setRole} 
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 h-12 bg-purple-100/50 p-1">
                <TabsTrigger 
                    value="user" 
                    className="h-full data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow text-primary/60"
                >User</TabsTrigger>
                <TabsTrigger 
                    value="tasker"
                    className="h-full data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow text-primary/60"
                >Tasker</TabsTrigger>
              </TabsList>
            </Tabs>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
           {registerError && (
            <Alert variant="destructive">
              <AlertDescription>
                {(registerError as Error).message || "An error occurred during registration"}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                id="fullName"
                placeholder="e.g shola davies"
                className="pl-9 h-12 bg-gray-50/50"
                {...form.register("fullName")}
                />
            </div>
            {form.formState.errors.fullName && (
              <p className="text-sm text-red-500">{form.formState.errors.fullName.message}</p>
            )}
          </div>

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
            <Label htmlFor="phone">Phone Number</Label>
             <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                 <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                className="pl-9 h-12 bg-gray-50/50"
                {...form.register("phone")}
                />
            </div>
            {form.formState.errors.phone && (
              <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
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
          
          <Button className="w-full h-12 text-lg font-medium" type="submit" disabled={isRegistering}>
            {isRegistering ? "Creating account..." : "Register"}
          </Button>

           {currentRole === 'tasker' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3 text-yellow-800 text-sm">
                    <AlertTriangle className="h-5 w-5 shrink-0" />
                    <div>
                        <span className="font-semibold block mb-1">Attention</span>
                        For taskers: make sure you register with data that matches your official document
                    </div>
                </div>
           )}

        </form>

            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">OR</span>
                </div>
            </div>

             <div className="flex justify-center gap-6">
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
        Already have an Account ? <Link href="/login" className="text-primary font-semibold hover:underline">Login</Link>
      </div>
    </div>
  );
}
