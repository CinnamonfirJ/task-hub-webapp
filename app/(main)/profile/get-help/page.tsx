"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Info, 
  Mail, 
  Phone, 
  Clock, 
  ChevronRight, 
  Copy, 
  FileQuestion 
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function GetHelpPage() {
  const router = useRouter();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Add a toast notification here if available
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className="bg-white border text-gray-400 rounded-xl w-12 h-12"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Get Help</h1>
      </div>

      {/* Intro Icon & Text */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="bg-purple-50 p-6 rounded-full">
           <Info className="text-[#6B46C1] w-10 h-10" />
        </div>
        <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900">We&apos;re here to help</h2>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
                Need assistance? Get in touch with our support team and we&apos;ll be happy to help you.
            </p>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contact Information</h3>

        {/* Email Support */}
        <Card className="border border-gray-50 shadow-sm rounded-[2rem] overflow-hidden">
            <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-purple-100 p-3 rounded-xl text-[#6B46C1]">
                            <Mail size={22} />
                        </div>
                        <span className="font-bold text-gray-700">Email Support</span>
                    </div>
                    <ChevronRight size={20} className="text-gray-300" />
                </div>
                
                <div className="bg-gray-50/50 p-4 rounded-xl flex items-center justify-between border border-gray-100">
                    <span className="text-sm font-medium text-gray-500">support@ngtaskhub.com</span>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => copyToClipboard("support@ngtaskhub.com")}
                        className="text-gray-400 hover:text-[#6B46C1]"
                    >
                        <Copy size={18} />
                    </Button>
                </div>

                <Button className="w-full bg-[#6B46C1] hover:bg-[#553C9A] py-7 text-sm font-bold rounded-xl shadow-lg shadow-purple-50">
                    Send Email
                </Button>
            </CardContent>
        </Card>

        {/* Phone Support */}
        <Card className="border border-gray-50 shadow-sm rounded-[2rem] overflow-hidden">
            <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-purple-100 p-3 rounded-xl text-[#6B46C1]">
                            <Phone size={22} />
                        </div>
                        <span className="font-bold text-gray-700">Phone Support</span>
                    </div>
                    <ChevronRight size={20} className="text-gray-300" />
                </div>
                
                <div className="bg-gray-50/50 p-4 rounded-xl flex items-center justify-between border border-gray-100">
                    <span className="text-sm font-medium text-gray-500">+234 802 524 3900</span>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => copyToClipboard("+234 802 524 3900")}
                        className="text-gray-400 hover:text-[#6B46C1]"
                    >
                        <Copy size={18} />
                    </Button>
                </div>

                <Button className="w-full bg-[#6B46C1] hover:bg-[#553C9A] py-7 text-sm font-bold rounded-xl shadow-lg shadow-purple-50">
                    Call now
                </Button>
            </CardContent>
        </Card>

        {/* Support Hours */}
        <Card className="bg-purple-50/30 border border-purple-100 shadow-sm rounded-[2rem] overflow-hidden">
             <div className="p-6 flex items-center justify-between border-b border-purple-100/50">
                <div className="flex items-center gap-4">
                    <div className="bg-purple-100/50 p-2.5 rounded-xl text-[#6B46C1]">
                        <Clock size={22} />
                    </div>
                    <span className="font-bold text-[#6B46C1]">Support Hours</span>
                </div>
                <ChevronRight size={20} className="text-purple-200" />
             </div>
             <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6B46C1]/70 font-medium">Monday - Friday</span>
                    <span className="font-bold text-[#6B46C1]">9:00AM - 6:00PM</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6B46C1]/70 font-medium">Saturday</span>
                    <span className="font-bold text-[#6B46C1]">10:00AM - 4:00PM</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6B46C1]/70 font-medium">Sunday</span>
                    <span className="font-bold text-red-400">Closed</span>
                </div>
                <p className="text-[10px] text-[#6B46C1]/40 pt-2 font-medium">All times are in West African Time (WAT)</p>
             </div>
        </Card>

        {/* FAQ */}
        <Card className="bg-purple-50/30 border border-purple-100 shadow-sm rounded-[2rem] overflow-hidden">
             <div className="p-6 flex items-center justify-between border-b border-purple-100/50">
                <div className="flex items-center gap-4">
                    <div className="bg-purple-100/50 p-2.5 rounded-xl text-[#6B46C1]">
                        <FileQuestion size={22} />
                    </div>
                    <span className="font-bold text-[#6B46C1]">Frequently Asked Questions</span>
                </div>
                <ChevronRight size={20} className="text-purple-200" />
             </div>
             <div className="p-6 space-y-4">
                <p className="text-sm text-[#6B46C1]/70 font-medium leading-relaxed">
                    Check out our FAQ section for quick answers to common questions before reaching out.
                </p>
                <Link href="/profile/faq">
                    <Button variant="outline" className="bg-white border-purple-100 text-[#6B46C1] hover:bg-white/80 rounded-xl px-6 py-5 text-xs font-bold flex items-center gap-2">
                        Check FAQ <ChevronRight size={14} />
                    </Button>
                </Link>
             </div>
        </Card>
      </div>
    </div>
  );
}
