"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { googleStore } from "@/lib/google-store";
import { useEffect } from "react";
import { Loader2, User as UserIcon, Phone, MapPin, Calendar, Globe } from "lucide-react";
import { NIGERIAN_STATES } from "@/utils/constants/nigeria-states";
import { SearchableSelect } from "@/components/ui/SearchableSelect";

const onboardingSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email(),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  country: z.string().min(1, "Country is required"),
  residentState: z.string().min(1, "Resident state is required"),
  originState: z.string().optional(), // Required only for taskers logic-wise
  address: z.string().min(5, "Address is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
});

type OnboardingValues = z.infer<typeof onboardingSchema>;

export function GoogleOnboardingForm() {
  const { handleCompleteSignup, isProcessing } = useGoogleAuth();
  const { prefill, role } = googleStore.getState();

  const form = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      fullName: prefill?.name || "",
      email: prefill?.email || "",
      country: "Nigeria",
      residentState: "",
      originState: "",
      address: "",
      phoneNumber: "",
      dateOfBirth: "",
    },
  });

  useEffect(() => {
    if (!prefill) return;
    form.reset({
      fullName: prefill.name,
      email: prefill.email,
      country: "Nigeria",
    });
  }, [prefill, form]);

  const onSubmit = async (data: OnboardingValues) => {
    // Inject originState if it's a tasker and missing
    const payload = { ...data };
    if (role === "tasker" && !payload.originState) {
        payload.originState = data.residentState; // Fallback
    }
    await handleCompleteSignup(payload);
  };

  if (!role) return null;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="fullName"
                placeholder="Jane Doe"
                className="pl-9"
                {...form.register("fullName")}
              />
            </div>
            {form.formState.errors.fullName && (
              <p className="text-xs text-red-500">{form.formState.errors.fullName.message}</p>
            )}
          </div>

          {/* Email (Locked) */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              disabled
              className="bg-muted cursor-not-allowed"
              {...form.register("email")}
            />
            <p className="text-[10px] text-muted-foreground">Registered with Google</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phoneNumber"
                placeholder="+234..."
                className="pl-9"
                {...form.register("phoneNumber")}
              />
            </div>
            {form.formState.errors.phoneNumber && (
              <p className="text-xs text-red-500">{form.formState.errors.phoneNumber.message}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="dateOfBirth"
                type="date"
                className="pl-9"
                {...form.register("dateOfBirth")}
              />
            </div>
            {form.formState.errors.dateOfBirth && (
              <p className="text-xs text-red-500">{form.formState.errors.dateOfBirth.message}</p>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="address"
              placeholder="12 Admiralty Way, Lekki"
              className="pl-9"
              {...form.register("address")}
            />
          </div>
          {form.formState.errors.address && (
            <p className="text-xs text-red-500">{form.formState.errors.address.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="country"
                className="pl-9"
                {...form.register("country")}
              />
            </div>
            {form.formState.errors.country && (
              <p className="text-xs text-red-500">{form.formState.errors.country.message}</p>
            )}
          </div>

          {/* Resident State */}
          <div className="space-y-2">
            <Label htmlFor="residentState">Resident State</Label>
            <SearchableSelect 
              options={NIGERIAN_STATES}
              value={form.watch("residentState") || ""}
              onValueChange={(value) => form.setValue("residentState", value, { shouldValidate: true })}
              placeholder="Select State"
              searchPlaceholder="Search state..."
              error={!!form.formState.errors.residentState}
            />
            {form.formState.errors.residentState && (
              <p className="text-xs text-red-500">{form.formState.errors.residentState.message}</p>
            )}
          </div>

          {/* Origin State (Tasker only) */}
          {role === "tasker" && (
            <div className="space-y-2">
              <Label htmlFor="originState">Origin State</Label>
              <SearchableSelect 
                options={NIGERIAN_STATES}
                value={form.watch("originState") || ""}
                onValueChange={(value) => form.setValue("originState", value, { shouldValidate: true })}
                placeholder="Select State"
                searchPlaceholder="Search state..."
              />
            </div>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className={`w-full h-12 text-lg font-semibold ${role === 'tasker' ? 'bg-[#6B46C1] hover:bg-[#553C9A]' : 'bg-primary'}`}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          "Complete Profile"
        )}
      </Button>
    </form>
  );
}
