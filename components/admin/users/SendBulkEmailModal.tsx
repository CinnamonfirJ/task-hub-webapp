"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Loader2, Send, Users } from "lucide-react";
import { useSendBulkEmail, useSendBulkTaskerEmail } from "@/hooks/useAdmin";
import { toast } from "sonner";

interface SendBulkEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultGroup?: "verified" | "unverified" | "all";
  type?: "user" | "tasker";
}

export function SendBulkEmailModal({
  isOpen,
  onClose,
  defaultGroup = "all",
  type = "user",
}: SendBulkEmailModalProps) {
  const [targetGroup, setTargetGroup] = useState<"verified" | "unverified" | "all">(defaultGroup);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  
  const userMutation = useSendBulkEmail();
  const taskerMutation = useSendBulkTaskerEmail();
  
  const mutation = type === "tasker" ? taskerMutation : userMutation;
  const { mutate: sendBulkEmail, isPending } = mutation;

  const handleSend = () => {
    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill in both subject and message");
      return;
    }

    sendBulkEmail(
      { targetGroup, subject, message },
      {
        onSuccess: () => {
          toast.success(`Bulk email campaign started for ${targetGroup} users`);
          setSubject("");
          setMessage("");
          onClose();
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to start bulk email campaign");
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[550px] gap-6 rounded-2xl'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold flex items-center gap-2'>
            <Users className='text-[#6B46C1]' size={24} />
            Bulk Email Campaign
          </DialogTitle>
          <p className='text-sm text-gray-500 mt-1'>
            Send a targeted email to a group of users. This process runs in the background.
          </p>
        </DialogHeader>

        <div className='space-y-5 py-2'>
          <div className='space-y-2'>
            <Label htmlFor='targetGroup' className='text-xs font-bold text-gray-700 uppercase tracking-wider'>
              Target Audience
            </Label>
            <Select 
              value={targetGroup} 
              onValueChange={(value: any) => setTargetGroup(value)}
            >
              <SelectTrigger id='targetGroup' className='rounded-xl h-12 border-gray-200'>
                <SelectValue placeholder='Select target group' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Users</SelectItem>
                <SelectItem value='verified'>Verified Users Only</SelectItem>
                <SelectItem value='unverified'>Unverified Users Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='subject' className='text-xs font-bold text-gray-700 uppercase tracking-wider'>
              Email Subject
            </Label>
            <Input
              id='subject'
              placeholder='e.g. Important Account Update'
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className='rounded-xl h-12 focus-visible:ring-[#6B46C1] border-gray-200'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='message' className='text-xs font-bold text-gray-700 uppercase tracking-wider'>
              Message Body
            </Label>
            <Textarea
              id='message'
              placeholder='Type your message here...'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className='rounded-xl min-h-[200px] focus-visible:ring-[#6B46C1] border-gray-200 resize-none p-4'
            />
          </div>
        </div>

        <DialogFooter className='gap-3 sm:gap-0'>
          <Button
            variant='ghost'
            onClick={onClose}
            className='rounded-xl font-bold text-gray-500 hover:bg-gray-100'
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={isPending}
            className='bg-[#6B46C1] hover:bg-[#553C9A] text-white rounded-xl gap-2 px-8 h-12 font-bold shadow-lg shadow-purple-200 transition-all active:scale-95'
          >
            {isPending ? (
              <Loader2 size={18} className='animate-spin' />
            ) : (
              <Send size={18} />
            )}
            Start Campaign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
