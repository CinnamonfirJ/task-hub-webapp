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
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleProceed = () => {
    if (selectedRole) {
      setRole(selectedRole);
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  if (step === 1) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Join us Today !</h1>
          <p className="text-muted-foreground">Be a part of our platform today, see what is taskable</p>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-center text-sm font-medium text-gray-600">Sign up as</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSelectedRole("user")}
                className={`h-14 rounded-md font-bold transition-all duration-200 ${
                  selectedRole === "user"
                    ? "bg-primary text-white scale-[1.02]"
                    : "bg-purple-100/50 text-primary/60 hover:bg-purple-100"
                }`}
              >
                User
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("tasker")}
                className={`h-14 rounded-md font-bold transition-all duration-200 ${
                  selectedRole === "tasker"
                    ? "bg-primary text-white scale-[1.02]"
                    : "bg-purple-100/50 text-primary/60 hover:bg-purple-100"
                }`}
              >
                Tasker
              </button>
            </div>
          </div>

          <Button 
            className="w-full h-14 text-lg font-bold" 
            disabled={!selectedRole}
            onClick={handleProceed}
          >
            Proceed
          </Button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-gray-400 font-semibold tracking-wider">OR</span>
            </div>
          </div>

          <div className="flex justify-center gap-6">
             <GoogleSignInButton role={(selectedRole || "user") as any} />
          </div>

          <div className="mt-8 text-center text-gray-500 font-medium">
            Already have an Account ? <Link href="/login" className="text-primary font-bold hover:underline">Login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center mb-6">
        <button 
            type="button"
            onClick={handleBack}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors relative z-10"
            title="Back to role selection"
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
        </button>
        <div className="flex-1 flex justify-center -ml-8">
          <Logo size="md" />
        </div>
      </div>
      
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">Create {currentRole === 'tasker' ? 'Tasker' : 'User'} Account</h1>
        <p className="text-muted-foreground">Please fill in your details to get started</p>
      </div>

      <div className="space-y-6">
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
              <p className="text-xs font-semibold text-red-500 mt-1">
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
                {...form.register("email")}
                />
            </div>
            {form.formState.errors.email && (
              <p className="text-xs font-semibold text-red-500 mt-1">
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
                {...form.register("phone")}
                />
            </div>
            {form.formState.errors.phone && (
              <p className="text-xs font-semibold text-red-500 mt-1">
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
                {...form.register("country")}
              />
              {form.formState.errors.country && (
                <p className="text-xs font-semibold text-red-500 mt-1">
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
                <p className="text-xs font-semibold text-red-500 mt-1">
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
              {...form.register("address")}
            />
            {form.formState.errors.address && (
              <p className="text-xs font-semibold text-red-500 mt-1">
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
              {...form.register("dateOfBirth")}
            />
            {form.formState.errors.dateOfBirth && (
              <p className="text-xs font-semibold text-red-500 mt-1">
                {form.formState.errors.dateOfBirth.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
               <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-9 pr-10 h-12 bg-gray-50/50"
                  {...form.register("password")}
                />
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
                <p className="text-xs font-semibold text-red-500 mt-1">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
          
          <Button className="w-full h-12 text-lg font-medium" type="submit" disabled={isRegistering}>
            {isRegistering ? "Creating account..." : "Register"}
          </Button>

           {currentRole === 'tasker' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3 text-yellow-800 text-sm mt-4">
                    <AlertTriangle className="h-5 w-5 shrink-0" />
                    <div>
                        <span className="font-semibold block mb-1">Attention</span>
                        For taskers: make sure you register with data that matches your official document
                    </div>
                </div>
           )}
        </form>
      </div>
          
      <div className="mt-8 text-center text-muted-foreground">
        Already have an Account ? <Link href="/login" className="text-primary font-semibold hover:underline">Login</Link>
      </div>
    </div>
  );
}
