import { useState, useRef } from "react";
import { Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MessageInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSend(text);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className='p-4 bg-white border-t border-gray-100 flex items-end gap-3 rounded-b-2xl'>
      <Button
        variant='ghost'
        size='icon'
        className='shrink-0 h-10 w-10 text-gray-400 hover:text-[#6B46C1] hover:bg-purple-50 rounded-xl'
      >
        <Paperclip size={20} />
      </Button>

      <div className='flex-1 relative'>
        <Textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          onKeyDown={handleKeyDown}
          placeholder='Type a message...'
          className='min-h-[44px] max-h-[120px] py-3 px-4 resize-none bg-gray-50 border-none focus-visible:ring-1 focus-visible:ring-purple-200 rounded-xl text-sm placeholder:text-gray-400 overflow-y-auto'
          disabled={disabled}
        />
      </div>

      <Button
        onClick={handleSend}
        disabled={!text.trim() || disabled}
        className='shrink-0 h-10 w-10 bg-[#6B46C1] hover:bg-[#553C9A] text-white rounded-xl shadow-md p-0'
      >
        <Send size={18} />
      </Button>
    </div>
  );
}
