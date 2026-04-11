import { useState, useRef } from "react";
import { Send, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MessageInputProps {
  onSend: (data: string | FormData) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ url: string; name: string; type: string }[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if ((!text.trim() && files.length === 0) || disabled) return;

    if (files.length > 0) {
      const formData = new FormData();
      if (text.trim()) formData.append("text", text);
      files.forEach((file) => {
        formData.append("attachments", file);
      });
      onSend(formData);
    } else {
      onSend(text);
    }

    setText("");
    setFiles([]);
    setPreviews([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const newFiles = [...files, ...selectedFiles].slice(0, 5);
    setFiles(newFiles);

    const newPreviews = selectedFiles.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      type: file.type,
    }));
    setPreviews([...previews, ...newPreviews].slice(0, 5));

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className='bg-white border-t border-gray-100 rounded-b-2xl'>
      {previews.length > 0 && (
        <div className='p-3 flex flex-wrap gap-2 border-b border-gray-50'>
          {previews.map((preview, idx) => (
            <div key={idx} className='relative group h-16 w-16 bg-gray-50 rounded-lg overflow-hidden border border-gray-200'>
              {preview.type.startsWith("image/") ? (
                <img src={preview.url} alt={preview.name} className='h-full w-full object-cover' />
              ) : (
                <div className='h-full w-full flex items-center justify-center p-2 text-[10px] font-bold text-gray-400 break-all text-center'>
                  {preview.name.split('.').pop()?.toUpperCase()}
                </div>
              )}
              <button
                onClick={() => removeFile(idx)}
                className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity'
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className='p-4 flex items-end gap-3'>
        <input
          type='file'
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          className='hidden'
          accept='image/*,.pdf,.doc,.docx'
        />
        <Button
          variant='ghost'
          size='icon'
          onClick={() => fileInputRef.current?.click()}
          className='shrink-0 h-10 w-10 text-gray-400 hover:text-[#6B46C1] hover:bg-purple-50 rounded-xl'
          disabled={disabled || files.length >= 5}
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
        disabled={(!text.trim() && files.length === 0) || disabled}
        className='shrink-0 h-10 w-10 bg-[#6B46C1] hover:bg-[#553C9A] text-white rounded-xl shadow-md p-0'
      >
        <Send size={18} />
      </Button>
    </div>
  </div>
  );
}
