'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';

export default function HistoryDialog({ isOpen, setIsOpen, history, onClear }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className='max-h-[70vh] w-[22rem] rounded-lg'>
        <DialogHeader>
          <DialogTitle className='text-center'>Spin History</DialogTitle>
        </DialogHeader>

        {history.length === 0 ? (
          <p className='py-4 text-center text-gray-500'>No spins yet!</p>
        ) : (
          <div className='flex max-h-[50vh] flex-col gap-2 overflow-y-auto'>
            {history.map((entry, index) => (
              <div
                key={`${entry.timestamp}-${index}`}
                className='flex items-center justify-between rounded-md bg-neutral-100 px-3 py-2'>
                <span className='font-medium'>{entry.option}</span>
                <span className='text-sm text-gray-500'>
                  {formatTime(entry.timestamp)}
                </span>
              </div>
            ))}
          </div>
        )}

        {history.length > 0 && (
          <Button onClick={onClear} variant='destructive' className='mt-2'>
            Clear History
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
