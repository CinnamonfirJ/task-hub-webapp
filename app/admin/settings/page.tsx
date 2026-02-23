"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    newUserRegistrations: true,
    taskPostingEnabled: true,
    emailNotifications: false,
    reportAlerts: true,
    kycSubmissionAlerts: true,
    twoFactorAuth: false,
    sessionTimeout: true,
    ipWhitelist: true,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className='space-y-6 md:space-y-8 p-4 md:p-8 max-w-[1400px] mx-auto'>
      <div>
        <h1 className='text-xl md:text-2xl font-bold text-gray-900'>
          Admin Settings
        </h1>
        <p className='text-xs md:text-sm text-gray-500 mt-1'>
          Configure system settings and preferences
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8'>
        <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem]'>
          <CardHeader className='p-6 md:p-8 pb-4'>
            <CardTitle className='text-base md:text-lg font-bold text-gray-900'>
              System Settings
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 md:p-8 pt-0 space-y-6 md:space-y-8'>
            <div className='flex items-center justify-between'>
              <div>
                <div className='text-sm font-bold text-gray-900'>
                  Maintenance Mode
                </div>
                <div className='text-xs text-gray-500 mt-1'>
                  Temporarily disable user access
                </div>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={() => handleToggle("maintenanceMode")}
                className='data-[state=checked]:bg-[#6B46C1]'
              />
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <div className='text-sm font-bold text-gray-900'>
                  New User Registrations
                </div>
                <div className='text-xs text-gray-500 mt-1'>
                  Allow new users to sign up
                </div>
              </div>
              <Switch
                checked={settings.newUserRegistrations}
                onCheckedChange={() => handleToggle("newUserRegistrations")}
                className='data-[state=checked]:bg-[#6B46C1]'
              />
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <div className='text-sm font-bold text-gray-900'>
                  Task Posting Enabled
                </div>
                <div className='text-xs text-gray-500 mt-1'>
                  Allow users to post new tasks
                </div>
              </div>
              <Switch
                checked={settings.taskPostingEnabled}
                onCheckedChange={() => handleToggle("taskPostingEnabled")}
                className='data-[state=checked]:bg-[#6B46C1]'
              />
            </div>
          </CardContent>
        </Card>

        <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem]'>
          <CardHeader className='p-6 md:p-8 pb-4'>
            <CardTitle className='text-base md:text-lg font-bold text-gray-900'>
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 md:p-8 pt-0 space-y-6 md:space-y-8'>
            <div className='flex items-center justify-between'>
              <div>
                <div className='text-sm font-bold text-gray-900'>
                  Email Notifications
                </div>
                <div className='text-xs text-gray-500 mt-1'>
                  Send email alerts to admins
                </div>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={() => handleToggle("emailNotifications")}
                className='data-[state=checked]:bg-[#6B46C1]'
              />
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <div className='text-sm font-bold text-gray-900'>
                  Report Alerts
                </div>
                <div className='text-xs text-gray-500 mt-1'>
                  Notify when users submit reports
                </div>
              </div>
              <Switch
                checked={settings.reportAlerts}
                onCheckedChange={() => handleToggle("reportAlerts")}
                className='data-[state=checked]:bg-[#6B46C1]'
              />
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <div className='text-sm font-bold text-gray-900'>
                  KYC Submission Alerts
                </div>
                <div className='text-xs text-gray-500 mt-1'>
                  Alert on new verification submissions
                </div>
              </div>
              <Switch
                checked={settings.kycSubmissionAlerts}
                onCheckedChange={() => handleToggle("kycSubmissionAlerts")}
                className='data-[state=checked]:bg-[#6B46C1]'
              />
            </div>
          </CardContent>
        </Card>

        <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem]'>
          <CardHeader className='p-6 md:p-8 pb-4'>
            <CardTitle className='text-base md:text-lg font-bold text-gray-900'>
              Security & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 md:p-8 pt-0 space-y-6 md:space-y-8'>
            <div className='flex items-center justify-between'>
              <div>
                <div className='text-sm font-bold text-gray-900'>
                  Two-Factor Authentication
                </div>
                <div className='text-xs text-gray-500 mt-1'>
                  Require 2FA for admin accounts
                </div>
              </div>
              <Switch
                checked={settings.twoFactorAuth}
                onCheckedChange={() => handleToggle("twoFactorAuth")}
                className='data-[state=checked]:bg-[#6B46C1]'
              />
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <div className='text-sm font-bold text-gray-900'>
                  Session Timeout
                </div>
                <div className='text-xs text-gray-500 mt-1'>
                  Auto-logout after 30 minutes of inactivity
                </div>
              </div>
              <Switch
                checked={settings.sessionTimeout}
                onCheckedChange={() => handleToggle("sessionTimeout")}
                className='data-[state=checked]:bg-[#6B46C1]'
              />
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <div className='text-sm font-bold text-gray-900'>
                  IP Whitelist
                </div>
                <div className='text-xs text-gray-500 mt-1'>
                  Restrict admin access to specific IPs
                </div>
              </div>
              <Switch
                checked={settings.ipWhitelist}
                onCheckedChange={() => handleToggle("ipWhitelist")}
                className='data-[state=checked]:bg-[#6B46C1]'
              />
            </div>
          </CardContent>
        </Card>

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
                  Last Backup
                </div>
                <div className='text-sm font-bold text-gray-900 mt-1'>
                  2 hours ago
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
              <div>
                <div className='text-xs text-gray-500 font-medium tracking-wide'>
                  Storage used
                </div>
                <div className='text-sm font-bold text-gray-900 mt-1'>
                  2.4 GB / 10 GB
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
