import React, { useState } from 'react';
import { MessageCircle, RefreshCw, Loader2 } from 'lucide-react';

interface AIAssistantButtonsProps {
  onCritic: () => void;
  onRephrase: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function AIAssistantButtons({
  onCritic,
  onRephrase,
  isLoading = false,
  disabled = false
}: AIAssistantButtonsProps) {
  const [activeAction, setActiveAction] = useState<'critic' | 'rephrase' | null>(null);

  const handleCritic = () => {
    setActiveAction('critic');
    onCritic();
  };

  const handleRephrase = () => {
    setActiveAction('rephrase');
    onRephrase();
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleCritic}
        disabled={disabled || isLoading}
        className="flex items-center gap-2 text-black border border-[#E5E5EA] rounded-lg px-3 py-2 text-sm hover:bg-[#fffef9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading && activeAction === 'critic' ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <MessageCircle size={16} />
        )}
        Critic
      </button>
      
      <button
        onClick={handleRephrase}
        disabled={disabled || isLoading}
        className="flex items-center gap-2 text-black border border-[#E5E5EA] rounded-lg px-3 py-2 text-sm hover:bg-[#fffef9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading && activeAction === 'rephrase' ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <RefreshCw size={16} />
        )}
        Rephrase
      </button>
    </div>
  );
}