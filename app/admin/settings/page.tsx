"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Save, CheckCircle2 } from "lucide-react";
import { useSystemSettings, useUpdateSystemSettings } from "@/hooks/useAdmin";

export default function AdminSettingsPage() {
  const { data: settings, isLoading } = useSystemSettings();
  const {
    mutate: updateSettings,
    isPending: isSaving,
    isSuccess: didSave,
  } = useUpdateSystemSettings();

  const [localSettings, setLocalSettings] = useState<Record<string, any>>({});
  const [pendingChanges, setPendingChanges] = useState<Record<string, any>>({});

  useEffect(() => {
    if (settings) {
      setLocalSettings({
        "system.maintenanceMode": settings.system?.maintenanceMode ?? false,
        "system.newUserRegistrations":
          settings.system?.newUserRegistrations ?? true,
        "system.taskPostingEnabled":
          settings.system?.taskPostingEnabled ?? true,
        "security.twoFactorAuthRequired":
          settings.security?.twoFactorAuthRequired ?? false,
        "security.sessionTimeout": settings.security?.sessionTimeout ?? 30,
        "security.ipWhitelistEnabled":
          settings.security?.ipWhitelistEnabled ?? false,
        "notifications.emailNotifications":
          settings.notifications?.emailNotifications ?? true,
        "notifications.reportAlerts":
          settings.notifications?.reportAlerts ?? true,
        "notifications.kycSubmissionAlerts":
          settings.notifications?.kycSubmissionAlerts ?? true,
      });
    }
  }, [settings]);

  const handleToggle = (key: string) => {
    const newValue = !localSettings[key];
    setLocalSettings((prev) => ({ ...prev, [key]: newValue }));
    setPendingChanges((prev) => ({ ...prev, [key]: newValue }));
  };

  const handleNumberChange = (key: string, value: string) => {
    const num = Number(value);
    setLocalSettings((prev) => ({ ...prev, [key]: num }));
    setPendingChanges((prev) => ({ ...prev, [key]: num }));
  };

  const handleSave = () => {
    if (Object.keys(pendingChanges).length === 0) return;
    updateSettings(pendingChanges, {
      onSuccess: () => setPendingChanges({}),
    });
  };

  const hasPendingChanges = Object.keys(pendingChanges).length > 0;

  if (isLoading) {
    return (
      <div className='flex h-[80vh] items-center justify-center'>
        <Loader2 className='h-12 w-12 animate-spin text-[#6B46C1]' />
      </div>
    );
  }

  const toggleSetting = (key: string, label: string, description: string) => (
    <div className='flex items-center justify-between'>
      <div>
        <div className='text-sm font-bold text-gray-900'>{label}</div>
        <div className='text-xs text-gray-500 mt-1'>{description}</div>
      </div>
      <Switch
        checked={localSettings[key] ?? false}
        onCheckedChange={() => handleToggle(key)}
        className='data-[state=checked]:bg-[#6B46C1]'
      />
    </div>
  );

  const numberSetting = (key: string, label: string, suffix?: string) => (
    <div className='flex items-center justify-between gap-4'>
      <div className='flex-1'>
        <div className='text-sm font-bold text-gray-900'>{label}</div>
      </div>
      <div className='flex items-center gap-2'>
        <Input
          type='number'
          value={localSettings[key] ?? ""}
          onChange={(e) => handleNumberChange(key, e.target.value)}
          className='w-32 h-9 text-sm rounded-lg text-right'
        />
        {suffix && (
          <span className='text-xs text-gray-400 font-medium w-8'>
            {suffix}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className='space-y-6 md:space-y-8 p-4 md:p-8 max-w-[1400px] mx-auto'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-xl md:text-2xl font-bold text-gray-900'>
            Admin Settings
          </h1>
          <p className='text-xs md:text-sm text-gray-500 mt-1'>
            Configure system settings and preferences
          </p>
        </div>
        <div className='flex items-center gap-3'>
          {didSave && !hasPendingChanges && (
            <span className='text-xs text-green-500 font-semibold flex items-center gap-1'>
              <CheckCircle2 size={14} /> Saved
            </span>
          )}
          <Button
            onClick={handleSave}
            disabled={!hasPendingChanges || isSaving}
            className='bg-[#6B46C1] hover:bg-[#553098] text-white gap-2 h-10 px-5 rounded-xl font-semibold'
          >
            {isSaving ? (
              <Loader2 size={16} className='animate-spin' />
            ) : (
              <Save size={16} />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8'>
        {/* System Settings */}
        <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem]'>
          <CardHeader className='p-6 md:p-8 pb-4'>
            <CardTitle className='text-base md:text-lg font-bold text-gray-900'>
              System Settings
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 md:p-8 pt-0 space-y-6 md:space-y-8'>
            {toggleSetting(
              "system.maintenanceMode",
              "Maintenance Mode",
              "Temporarily disable user access",
            )}
            {toggleSetting(
              "system.newUserRegistrations",
              "New User Registrations",
              "Allow new users to sign up",
            )}
            {toggleSetting(
              "system.taskPostingEnabled",
              "Task Posting Enabled",
              "Allow users to post new tasks",
            )}
          </CardContent>
        </Card>

        {/* Notifications & Alerts */}
        <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem]'>
          <CardHeader className='p-6 md:p-8 pb-4'>
            <CardTitle className='text-base md:text-lg font-bold text-gray-900'>
              Notifications & Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 md:p-8 pt-0 space-y-6 md:space-y-8'>
            {toggleSetting(
              "notifications.emailNotifications",
              "Email Notifications",
              "Send email alerts to users",
            )}
            {toggleSetting(
              "notifications.reportAlerts",
              "Report Alerts",
              "Notify admin of new reports",
            )}
            {toggleSetting(
              "notifications.kycSubmissionAlerts",
              "KYC Submission Alerts",
              "Notify admin of new KYC submissions",
            )}
          </CardContent>
        </Card>

        {/* Security */}
        <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem]'>
          <CardHeader className='p-6 md:p-8 pb-4'>
            <CardTitle className='text-base md:text-lg font-bold text-gray-900'>
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 md:p-8 pt-0 space-y-6 md:space-y-8'>
            {toggleSetting(
              "security.twoFactorAuthRequired",
              "2FA Required",
              "Force admins to use two-factor authentication",
            )}
            {toggleSetting(
              "security.ipWhitelistEnabled",
              "IP Whitelisting",
              "Restrict admin access to specific IP ranges",
            )}
            {numberSetting("security.sessionTimeout", "Session Timeout", "min")}
          </CardContent>
        </Card>

        {/* System Info */}
        <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem]'>
          <CardHeader className='p-6 md:p-8 pb-4'>
            <CardTitle className='text-base md:text-lg font-bold text-gray-900'>
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 md:p-8 pt-0'>
            <div className='grid grid-cols-2 gap-y-6 md:gap-y-8 gap-x-4'>
              <div>
                <div className='text-xs text-gray-500 font-medium tracking-wide'>
                  Platform Version
                </div>
                <div className='text-sm font-bold text-gray-900 mt-1'>
                  v1.0.0
                </div>
              </div>
              <div>
                <div className='text-xs text-gray-500 font-medium tracking-wide'>
                  Database Status
                </div>
                <div className='text-sm font-bold text-[#10B981] mt-1'>
                  Healthy
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
