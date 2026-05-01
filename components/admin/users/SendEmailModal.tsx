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
import { Mail, Loader2, Send, Search, User, Check } from "lucide-react";
import { useSendUserEmail, useSendTaskerEmail, useNotificationUsers } from "@/hooks/useAdmin";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SendEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  userEmail?: string;
  userName?: string;
  type?: "user" | "tasker";
}

export function SendEmailModal({
  isOpen,
  onClose,
  userId: initialUserId,
  userEmail: initialUserEmail,
  userName: initialUserName,
  type = "user",
}: SendEmailModalProps) {
  const [selectedUserId, setSelectedUserId] = useState(initialUserId || "");
  const [selectedUserName, setSelectedUserName] = useState(initialUserName || "");
  const [selectedUserEmail, setSelectedUserEmail] = useState(initialUserEmail || "");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [userSearch, setUserSearch] = useState("");

  const { data: userData, isLoading: loadingUsers } = useNotificationUsers();
  
  const userMutation = useSendUserEmail();
  const taskerMutation = useSendTaskerEmail();
  
  // Determine if the selected user is a tasker to use the correct endpoint
  const isSelectedUserTasker = () => {
    if (type === "tasker") return true;
    if (type === "user") return false;
    
    const taskers = userData?.taskers || userData?.data?.taskers || [];
    return taskers.some((t: any) => (t._id || t.id) === (initialUserId || selectedUserId));
  };

  const mutation = isSelectedUserTasker() ? taskerMutation : userMutation;
  const { mutate: sendEmail, isPending } = mutation;

  const allPossibleRecipients = [
    ...(userData?.users || userData?.data?.users || []),
    ...(userData?.taskers || userData?.data?.taskers || []),
  ];

  const filteredRecipients = allPossibleRecipients.filter((u: any) => {
    const name = u.fullName || u.name || "Unknown User";
    const email = u.emailAddress || u.email || "";
    return (
      name.toLowerCase().includes(userSearch.toLowerCase()) ||
      email.toLowerCase().includes(userSearch.toLowerCase())
    );
  });

  const handleSend = () => {
    const targetId = initialUserId || selectedUserId;
    const targetName = initialUserName || selectedUserName;

    if (!targetId) {
      toast.error("Please select a recipient");
      return;
    }
    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill in both subject and message");
      return;
    }

    sendEmail(
      { id: targetId, subject, message },
      {
        onSuccess: () => {
          toast.success(`Email sent to ${targetName}`);
          setSubject("");
          setMessage("");
          if (!initialUserId) {
            setSelectedUserId("");
            setSelectedUserName("");
            setSelectedUserEmail("");
          }
          onClose();
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to send email");
        },
      }
    );
  };

  const selectUser = (user: any) => {
    setSelectedUserId(user._id || user.id);
    setSelectedUserName(user.fullName || user.name);
    setSelectedUserEmail(user.emailAddress || user.email);
    setUserSearch("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px] gap-6 rounded-2xl max-h-[90vh] overflow-y-auto no-scrollbar'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold flex items-center gap-2'>
            <Mail className='text-[#6B46C1]' size={24} />
            {initialUserId ? "Send Email to User" : "Compose Direct Email"}
          </DialogTitle>
          
          {(initialUserId || selectedUserId) ? (
            <div className='flex items-center justify-between mt-2 p-3 bg-purple-50 rounded-xl border border-purple-100'>
              <div className='flex flex-col gap-0.5'>
                <p className='text-sm font-bold text-gray-900'>{initialUserName || selectedUserName}</p>
                <p className='text-xs text-gray-500 font-medium'>{initialUserEmail || selectedUserEmail}</p>
              </div>
              {!initialUserId && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedUserId("")}
                  className="text-[10px] h-7 px-2 font-bold text-purple-600 hover:bg-purple-100"
                >
                  Change
                </Button>
              )}
            </div>
          ) : (
            <div className='space-y-3 mt-4'>
              <Label className='text-xs font-bold text-gray-700 uppercase tracking-wider'>
                Select Recipient
              </Label>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' size={16} />
                <Input
                  placeholder='Search users by name or email...'
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className='pl-10 rounded-xl h-11 bg-gray-50 border-gray-200'
                />
              </div>
              
              <div className='max-h-[200px] overflow-y-auto border border-gray-100 rounded-xl divide-y divide-gray-50 bg-white no-scrollbar shadow-inner'>
                {loadingUsers ? (
                  <div className='flex justify-center py-8'>
                    <Loader2 size={20} className='animate-spin text-purple-600' />
                  </div>
                ) : userSearch && filteredRecipients.length === 0 ? (
                  <p className='text-center py-8 text-xs text-gray-400'>No users found</p>
                ) : !userSearch && allPossibleRecipients.length > 0 ? (
                  <p className='text-center py-4 text-[10px] text-gray-400 font-bold uppercase'>Start typing to find users</p>
                ) : (
                  filteredRecipients.map((user: any) => (
                    <button
                      key={user._id || user.id}
                      type='button'
                      onClick={() => selectUser(user)}
                      className='flex items-center gap-3 w-full p-3 text-left hover:bg-gray-50 transition-colors'
                    >
                      <div className='w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 shrink-0'>
                        <User size={14} />
                      </div>
                      <div className='flex flex-col min-w-0'>
                        <span className='text-xs font-bold text-gray-900 truncate'>{user.fullName || user.name}</span>
                        <span className='text-[10px] text-gray-500 truncate'>{user.emailAddress || user.email}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </DialogHeader>

        <div className='space-y-5 py-2'>
          <div className='space-y-2'>
            <Label htmlFor='subject' className='text-xs font-bold text-gray-700 uppercase tracking-wider'>
              Subject
            </Label>
            <Input
              id='subject'
              placeholder='Enter email subject'
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
              className='rounded-xl min-h-[180px] focus-visible:ring-[#6B46C1] border-gray-200 resize-none p-4'
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
            Send Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
