import { MessageSquare } from "lucide-react";

export default function MessagesEmptyStatePage() {
  return (
    <div className='h-full w-full flex flex-col items-center justify-center p-8 text-center bg-gray-50/30'>
      <MessageSquare size={48} className='text-gray-300 mb-4' />
      <h2 className='text-xl font-bold text-gray-900 mb-2'>
        Select a conversation to view messages
      </h2>
      <p className='text-sm text-gray-500 max-w-sm'>
        Choose a conversation from the list on the left to read messages between
        users and taskers.
      </p>
    </div>
  );
}
