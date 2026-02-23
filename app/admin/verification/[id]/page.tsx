"use client";

import { CheckCircle, XCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function KYCDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className='space-y-6 md:space-y-8 p-4 md:p-8 max-w-[1400px] mx-auto'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            KYC / Verification Management
          </h1>
          <p className='text-sm text-gray-500 mt-1'>
            Review and manage identity verifications
          </p>
        </div>
        <div className='flex gap-3'>
          <Button className='bg-green-500 hover:bg-green-600 text-white gap-2 h-10 px-4 font-semibold'>
            <CheckCircle size={16} /> Approve verification
          </Button>
          <Button className='bg-[#EF4444] hover:bg-[#DC2626] text-white gap-2 h-10 px-4 font-semibold'>
            <XCircle size={16} /> Reject
          </Button>
        </div>
      </div>

      <Card className='border border-gray-100 shadow-sm rounded-2xl'>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-500'>
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className='font-bold text-gray-900 text-lg'>
                  Verification Status
                </h3>
                <div className='mt-1'>
                  <span className='bg-yellow-50 text-yellow-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase'>
                    Pending Review
                  </span>
                </div>
              </div>
            </div>
            <div className='text-right'>
              <div className='text-xs text-gray-500 font-medium mb-1'>
                Submitted
              </div>
              <div className='text-sm font-bold text-gray-900'>
                10/02/2026, 11:12:47 AM
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card className='border border-gray-100 shadow-sm rounded-2xl'>
          <CardHeader className='p-6 pb-4'>
            <CardTitle className='text-lg font-bold text-gray-900'>
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 pt-0 space-y-6'>
            <div className='flex items-center gap-4'>
              <div className='w-14 h-14 rounded-full bg-gray-200 shrink-0' />
              <div>
                <div className='font-bold text-gray-900 text-lg'>
                  Adewale Thompson
                </div>
                <div className='text-sm text-gray-500'>
                  adewale.t@example.com
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              <div>
                <div className='text-xs text-gray-500 font-medium mb-1'>
                  Phone Number
                </div>
                <div className='text-sm font-bold text-gray-900'>
                  +234 8108294447
                </div>
              </div>
              <div>
                <div className='text-xs text-gray-500 font-medium mb-1'>
                  Location
                </div>
                <div className='text-sm font-bold text-gray-900'>
                  Lagos, Nigeria
                </div>
              </div>
              <div>
                <div className='text-xs text-gray-500 font-medium mb-2'>
                  Account Type
                </div>
                <span className='inline-block px-3 py-1 bg-gray-50 border border-gray-100 rounded-md text-xs text-gray-600 font-semibold'>
                  Tasker
                </span>
              </div>
              <div>
                <div className='text-xs text-gray-500 font-medium mb-1'>
                  Bio
                </div>
                <div className='text-sm font-bold text-gray-900 leading-relaxed'>
                  Professional plumber with 8 years experience
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border border-gray-100 shadow-sm rounded-2xl'>
          <CardHeader className='p-6 pb-4'>
            <CardTitle className='text-lg font-bold text-gray-900'>
              KYC Information
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 pt-0 space-y-6'>
            <div>
              <div className='text-sm text-gray-500 font-medium mb-2'>
                National Identification Number (NIN)
              </div>
              <div className='bg-gray-50/50 border border-gray-100 rounded-xl p-4 font-bold text-gray-900 tracking-wider'>
                12345678901
              </div>
            </div>

            <div className='space-y-4'>
              <div>
                <div className='text-xs text-gray-500 font-medium mb-1'>
                  User ID
                </div>
                <div className='text-sm font-bold text-gray-900'>User 3</div>
              </div>
              <div>
                <div className='text-xs text-gray-500 font-medium mb-1'>
                  Submission Date
                </div>
                <div className='text-sm font-bold text-gray-900'>
                  10/02/2026, 11:12:47 AM
                </div>
              </div>
              <div>
                <div className='text-xs text-gray-500 font-medium mb-1'>
                  Last updated
                </div>
                <div className='text-sm font-bold text-gray-900'>
                  19/02/2026, 08:12:47 PM
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className='border border-gray-100 shadow-sm rounded-2xl'>
        <CardHeader className='p-6 pb-4'>
          <CardTitle className='text-lg font-bold text-gray-900'>
            Verification Documents
          </CardTitle>
        </CardHeader>
        <CardContent className='p-6 pt-0'>
          <div className='flex gap-4'>
            <div className='w-40 h-40 bg-[url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZTVlNWU1Ii8+CjxyZWN0IHg9IjQiIHk9IjQiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNlNWU1ZTUiLz4KPC9zdmc+")] rounded-2xl flex items-center justify-center border border-gray-100'>
              <Button
                variant='secondary'
                className='bg-white shadow-sm text-sm font-bold h-9 px-6 hover:bg-gray-50'
              >
                View
              </Button>
            </div>
            <div className='w-40 h-40 bg-[url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZTVlNWU1Ii8+CjxyZWN0IHg9IjQiIHk9IjQiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNlNWU1ZTUiLz4KPC9zdmc+")] rounded-2xl border border-gray-100'></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
