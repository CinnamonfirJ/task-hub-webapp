"use client";

import { useState, useEffect } from "react";
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
import { useSendNotification, useNotificationUsers } from "@/hooks/useAdmin";
import { Loader2, Send, X, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AdminNotification } from "@/types/admin";

interface SendNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: AdminNotification | null;
}

export function SendNotificationModal({
  isOpen,
  onClose,
  initialData,
}: SendNotificationModalProps) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<any>("Announcement");
  const [audience, setAudience] = useState<any>("All Users");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [inApp, setInApp] = useState(true);
  const [emailNotification, setEmailNotification] = useState(false);
  const [userSearch, setUserSearch] = useState("");

  useEffect(() => {
    if (isOpen && initialData) {
      setTitle(initialData.title || "");
      setMessage(initialData.message || "");
      setType(initialData.type || "Announcement");
      setAudience(initialData.audience || "All users");
      setInApp(initialData.isInApp ?? initialData.sendInApp ?? initialData.inApp ?? true);
      setEmailNotification(initialData.isEmail ?? initialData.sendEmail ?? initialData.email ?? false);
      // selectedUserIds are usually not included in the list response, 
      // but if they are present in some extended notification object, we use them.
      setSelectedUserIds([]); 
    } else if (isOpen && !initialData) {
      resetForm();
    }
  }, [isOpen, initialData]);

  const { data: userData, isLoading: loadingUsers } = useNotificationUsers();
  const { mutate: sendNotification, isPending } = useSendNotification();

  const allPossibleRecipients = (() => {
    if (!userData || !Array.isArray(userData.data)) return [];
    
    const recipientsMap = new Map();

    userData.data.forEach((item: any) => {
      const target = item.user || item.tasker;
      if (!target) return;

      const id = target._id;
      if (!id || recipientsMap.has(id)) return;

      recipientsMap.set(id, {
        id,
        fullName: target.fullName || `${target.firstName || ""} ${target.lastName || ""}`.trim() || "Unknown User",
        email: target.emailAddress || target.email || "No email",
        type: item.user ? "User" : "Tasker"
      });
    });

    return Array.from(recipientsMap.values());
  })();

  const filteredRecipients = allPossibleRecipients.filter((u: any) => {
    const name = u.fullName || u.name || "";
    const email = u.emailAddress || u.email || "";
    const searchStr = `${name} ${email}`.toLowerCase();
    return searchStr.includes(userSearch.toLowerCase());
  });

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
        selectedUserIds: audience === "Selected Users" ? selectedUserIds : [],
        sendEmail: emailNotification,
        sendInApp: inApp,
      },
      {
        onSuccess: () => {
          const mode = initialData ? "duplicated" : "broadcasted";
          toast.success(`Notification ${mode} successfully!`);
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
    setType("Announcement");
    setAudience("All Users");
    setSelectedUserIds([]);
    setInApp(true);
    setEmailNotification(false);
  };

  const toggleUser = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px] gap-6 max-h-[90vh] overflow-y-auto no-scrollbar'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold'>
            Send Notification
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='title' className='text-sm font-semibold'>
              Title
            </Label>
            <Input
              id='title'
              placeholder='Enter category name'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='h-10 text-xs'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='message' className='text-sm font-semibold'>
              Message
            </Label>
            <Textarea
              id='message'
              placeholder='Write your message...'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className='text-xs'
            />
          </div>

          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-2'>
              <input 
                type="checkbox" 
                id="inApp" 
                checked={inApp} 
                onChange={(e) => setInApp(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <Label htmlFor='inApp' className='text-sm font-medium cursor-pointer'>In app</Label>
            </div>
            <div className='flex items-center gap-2'>
              <input 
                type="checkbox" 
                id="emailNotification" 
                checked={emailNotification} 
                onChange={(e) => setEmailNotification(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <Label htmlFor='emailNotification' className='text-sm font-medium cursor-pointer'>Email Notification</Label>
            </div>
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
                  <SelectItem value='Promotional'>Promotional</SelectItem>
                  <SelectItem value='Maintenance'>Maintenance</SelectItem>
                  <SelectItem value='Warning'>Warning</SelectItem>
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
                  <SelectItem value='Selected Users'>Selected Users</SelectItem>
                  <SelectItem value='Everyone'>Everyone</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {audience === "Selected Users" && (
            <div className='space-y-2 border border-gray-100 rounded-xl p-4 bg-gray-50/30'>
              <Label className='text-sm font-semibold flex justify-between'>
                Select Recipients
                <span className='text-[10px] text-purple-600 font-bold'>
                  {selectedUserIds.length} selected
                </span>
              </Label>
              <Input
                placeholder='Search users or taskers...'
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className='h-9 text-xs bg-white'
              />
              <div className='max-h-[160px] overflow-y-auto space-y-1 mt-2 no-scrollbar'>
                {loadingUsers ? (
                  <div className='flex justify-center py-4'>
                    <Loader2 size={16} className='animate-spin text-purple-600' />
                  </div>
                ) : filteredRecipients.length === 0 ? (
                  <p className='text-center py-4 text-xs text-gray-400'>No users found</p>
                ) : (
                  filteredRecipients.map((recipient: any) => (
                    <button
                      key={recipient.id}
                      type='button'
                      onClick={() => toggleUser(recipient.id)}
                      className={cn(
                        "flex items-center justify-between w-full p-2.5 rounded-lg text-left transition-all",
                        selectedUserIds.includes(recipient.id)
                          ? "bg-purple-100 text-[#6B46C1] border-purple-200"
                          : "bg-white border-transparent hover:bg-gray-100"
                      )}
                    >
                      <div className='flex items-center gap-2'>
                        <div className='flex flex-col'>
                          <span className='text-xs font-bold'>{recipient.fullName}</span>
                          <div className='flex items-center gap-2'>
                            <span className='text-[10px] uppercase opacity-60 font-bold'>{recipient.type}</span>
                            {recipient.email && <span className='text-[10px] opacity-40'>{recipient.email}</span>}
                          </div>
                        </div>
                      </div>
                      {selectedUserIds.includes(recipient.id) && <Check size={14} />}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          <DialogFooter className='pt-2 flex flex-row items-center justify-end gap-3'>
            <Button
              type='button'
              variant='ghost'
              onClick={onClose}
              className='h-10 text-gray-600'
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isPending}
              className='bg-[#6B46C1] hover:bg-[#553C9A] text-white h-10 px-8 rounded-xl font-bold'
            >
              {isPending ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  Sending...
                </>
              ) : (
                "Send Now"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
