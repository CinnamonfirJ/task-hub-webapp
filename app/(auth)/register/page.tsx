"use client";

import Link from "next/link";
import { useRegister } from "@/hooks/useRegister";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, Phone, User, AlertTriangle, EyeOff, Eye } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { useState } from "react";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { NIGERIAN_STATES } from "@/utils/constants/nigeria-states";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RegisterPage() {
  const { form, onSubmit, currentRole, setRole, isRegistering, registerError } = useRegister();
  const [showPassword, setShowPassword] = useState(false)

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
                aria-invalid={!!form.formState.errors.fullName}
                {...form.register("fullName")}
                />
            </div>
            {form.formState.errors.fullName && (
              <p className="text-xs font-semibold text-red-500 mt-1 transition-all duration-200 animate-in fade-in slide-in-from-top-1">
                {form.formState.errors.fullName.message}
              </p>
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
                aria-invalid={!!form.formState.errors.email}
                {...form.register("email")}
                />
            </div>
            {form.formState.errors.email && (
              <p className="text-xs font-semibold text-red-500 mt-1 transition-all duration-200 animate-in fade-in slide-in-from-top-1">
                {form.formState.errors.email.message}
              </p>
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
                aria-invalid={!!form.formState.errors.phone}
                {...form.register("phone")}
                />
            </div>
            {form.formState.errors.phone && (
              <p className="text-xs font-semibold text-red-500 mt-1 transition-all duration-200 animate-in fade-in slide-in-from-top-1">
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                placeholder="Nigeria"
                className="h-12 bg-gray-50/50"
                aria-invalid={!!form.formState.errors.country}
                {...form.register("country")}
              />
              {form.formState.errors.country && (
                <p className="text-xs font-semibold text-red-500 mt-1 transition-all duration-200 animate-in fade-in slide-in-from-top-1">
                  {form.formState.errors.country.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">Resident State</Label>
              <SearchableSelect 
                options={NIGERIAN_STATES}
                value={form.watch("residentState") || ""}
                onValueChange={(value) => form.setValue("residentState", value, { shouldValidate: true })}
                placeholder="Select State"
                searchPlaceholder="Search state..."
                error={!!form.formState.errors.residentState}
              />
              {form.formState.errors.residentState && (
                <p className="text-xs font-semibold text-red-500 mt-1 transition-all duration-200 animate-in fade-in slide-in-from-top-1">
                  {form.formState.errors.residentState.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="Enter your full address"
              className="h-12 bg-gray-50/50"
              aria-invalid={!!form.formState.errors.address}
              {...form.register("address")}
            />
            {form.formState.errors.address && (
              <p className="text-xs font-semibold text-red-500 mt-1 transition-all duration-200 animate-in fade-in slide-in-from-top-1">
                {form.formState.errors.address.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              className="h-12 bg-gray-50/50"
              aria-invalid={!!form.formState.errors.dateOfBirth}
              {...form.register("dateOfBirth")}
            />
            {form.formState.errors.dateOfBirth && (
              <p className="text-xs font-semibold text-red-500 mt-1 transition-all duration-200 animate-in fade-in slide-in-from-top-1">
                {form.formState.errors.dateOfBirth.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
               <div className="relative">
        {/* Left lock icon */}
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          className="pl-9 pr-10 h-12 bg-gray-50/50"
          aria-invalid={!!form.formState.errors.password}
          {...form.register("password")}
        />

        {/* Eye toggle button */}
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
               {form.formState.errors.password && (
                <p className="text-xs font-semibold text-red-500 mt-1 transition-all duration-200 animate-in fade-in slide-in-from-top-1">
                  {form.formState.errors.password.message}
                </p>
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

        <div className='flex justify-center'>
          <GoogleSignInButton role={currentRole as any} />
        </div>

      </div>
          
      <div className="mt-8 text-center text-muted-foreground">
        Already have an Account ? <Link href="/login" className="text-primary font-semibold hover:underline">Login</Link>
      </div>
    </div>
  );
}
