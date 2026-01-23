"use client";

import { useCompleteProfile } from "@/hooks/useCompleteProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function CompleteProfilePage() {
  const { user, isLoadingUser, form, onSubmit, isSubmitting } = useCompleteProfile();

  if (isLoadingUser) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50/50 py-8">
      <Card className="w-full max-w-2xl mx-4">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>Tell us more about yourself to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" {...form.register("fullName")} />
              {form.formState.errors.fullName && (
                <p className="text-sm text-red-500">{form.formState.errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location (City, State)</Label>
              <Input id="location" placeholder="e.g. Lagos, Nigeria" {...form.register("location")} />
              {form.formState.errors.location && (
                <p className="text-sm text-red-500">{form.formState.errors.location.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Briefly describe what you do..."
                {...form.register("bio")}
                className="min-h-[100px]"
              />
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Complete Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
