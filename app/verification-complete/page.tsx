import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Clock, Home } from "lucide-react";
import Link from "next/link";

export default function VerificationCompletePage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50/50 p-4'>
      <Card className='w-full max-w-md border-none shadow-lg'>
        <CardHeader className='text-center'>
          <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600'>
            <Clock className='h-6 w-6' />
          </div>
          <CardTitle className='text-2xl font-bold text-gray-900'>
            Verification Submitted
          </CardTitle>
        </CardHeader>
        <CardContent className='text-center text-gray-600'>
          <p className='mb-4'>
            Thank you for completing the identity verification process.
          </p>
          <div className='rounded-lg bg-gray-50 p-4 text-sm'>
            <p>
              Your verification is now being processed. Our team will review the
              results, and your profile status will be updated shortly.
            </p>
          </div>
          <p className='mt-4 text-xs font-medium text-gray-400'>
            This usually takes a few minutes, but can sometimes take up to 24
            hours.
          </p>
        </CardContent>
        <CardFooter className='flex flex-col gap-2'>
          <Button asChild className='w-full bg-[#6B46C1] hover:bg-[#553C9A]'>
            <Link href='/home'>
              <Home className='mr-2 h-4 w-4' />
              Return to Dashboard
            </Link>
          </Button>
          <p className='text-center text-xs text-gray-400'>
            Status updates will be visible on your profile page.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
