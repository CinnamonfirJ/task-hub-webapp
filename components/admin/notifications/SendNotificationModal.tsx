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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSendNotification } from "@/hooks/useAdmin";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

interface SendNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SendNotificationModal({
  isOpen,
  onClose,
}: SendNotificationModalProps) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<any>("Announcement");
  const [audience, setAudience] = useState<any>("All Users");

  const { mutate: sendNotification, isPending } = useSendNotification();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !message) {
      toast.error("Please fill in all required fields");
      return;
    }

    sendNotification(
      {
        title,
        message,
        type,
        audience,
      },
      {
        onSuccess: () => {
          toast.success("Notification broadcasted successfully!");
          onClose();
          resetForm();
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to send notification");
        },
      }
    );
  };

  const resetForm = () => {
    setTitle("");
    setMessage("");
    setType("Announcement");
    setAudience("All Users");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px] gap-6'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold'>
            Broadcast Notification
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='title' className='text-sm font-semibold'>
              Title
            </Label>
            <Input
              id='title'
              placeholder='Enter notification title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='h-10 text-xs'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='type' className='text-sm font-semibold'>
                Type
              </Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id='type' className='h-10 text-xs'>
                  <SelectValue placeholder='Select type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Announcement'>Announcement</SelectItem>
                  <SelectItem value='Alert'>Alert</SelectItem>
                  <SelectItem value='Warning'>Warning</SelectItem>
                  <SelectItem value='Update'>Update</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='audience' className='text-sm font-semibold'>
                Audience
              </Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger id='audience' className='h-10 text-xs'>
                  <SelectValue placeholder='Select audience' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='All Users'>All Users</SelectItem>
                  <SelectItem value='All Taskers'>All Taskers</SelectItem>
                  <SelectItem value='Everyone'>Everyone</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='message' className='text-sm font-semibold'>
              Message
            </Label>
            <Textarea
              id='message'
              placeholder='What do you want to tell them?'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className='text-xs'
            />
          </div>

          <DialogFooter className='pt-2'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              className='h-10'
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isPending}
              className='bg-[#6B46C1] hover:bg-[#553C9A] text-white h-10 gap-2 min-w-[140px]'
            >
              {isPending ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send Broadcast
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
