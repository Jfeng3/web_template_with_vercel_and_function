// Basic toast hook for notifications
import { useState } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState<any[]>([]);

  const toast = (message: { title?: string; description?: string }) => {
    console.log('Toast:', message);
  };

  return { toast, toasts };
}