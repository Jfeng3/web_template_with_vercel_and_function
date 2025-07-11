import React from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

interface AIResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'critic' | 'rephrase';
  response: {
    feedback?: string;
    suggestions?: string[];
    score?: number;
    rephrased?: string;
    alternatives?: string[];
  };
  onApply?: (content: string) => void;
  isLoading?: boolean;
}

export default function AIResponseModal({
  isOpen,
  onClose,
  type,
  response,
  onApply,
  isLoading = false
}: AIResponseModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5EA] max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#E5E5EA]">
          <h2 className="text-lg font-semibold text-black">
            {type === 'critic' ? 'AI Critic Feedback' : 'AI Rephrase Options'}
          </h2>
          <button
            onClick={onClose}
            className="text-[#71717A] hover:text-black"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              <span className="ml-3 text-[#71717A]">Analyzing your content...</span>
            </div>
          ) : (
            <>
              {type === 'critic' && (
                <div className="space-y-4">
                  {response.score && (
                    <div className="flex items-center gap-2 p-3 bg-[#fffef9] rounded-lg">
                      <CheckCircle size={16} className="text-green-600" />
                      <span className="text-sm text-black">
                        Quality Score: <span className="font-semibold">{response.score}/100</span>
                      </span>
                    </div>
                  )}
                  
                  {response.feedback && (
                    <div className="space-y-2">
                      <h3 className="font-medium text-black">Feedback:</h3>
                      <p className="text-sm text-black leading-relaxed bg-[#fffef9] p-3 rounded-lg">
                        {response.feedback}
                      </p>
                    </div>
                  )}

                  {response.suggestions && response.suggestions.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-medium text-black">Key Suggestions:</h3>
                      <ul className="space-y-1">
                        {response.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-black">
                            <AlertCircle size={14} className="text-[#71717A] mt-0.5 flex-shrink-0" />
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {type === 'rephrase' && (
                <div className="space-y-4">
                  {response.rephrased && (
                    <div className="space-y-2">
                      <h3 className="font-medium text-black">Improved Version:</h3>
                      <div className="bg-[#fffef9] p-3 rounded-lg">
                        <p className="text-sm text-black leading-relaxed">
                          {response.rephrased}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-[#71717A]">
                            {response.rephrased.split(/\s+/).filter(w => w).length} words
                          </span>
                          <button
                            onClick={() => onApply?.(response.rephrased!)}
                            className="text-xs bg-black text-white px-3 py-1 rounded hover:opacity-90"
                          >
                            Apply This Version
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {response.alternatives && response.alternatives.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-medium text-black">Alternative Approaches:</h3>
                      <div className="space-y-2">
                        {response.alternatives.map((alternative, index) => (
                          <div key={index} className="bg-[#fffef9] p-3 rounded-lg">
                            <p className="text-sm text-black leading-relaxed">
                              {alternative}
                            </p>
                            <button
                              onClick={() => onApply?.(alternative)}
                              className="text-xs text-black border border-[#E5E5EA] rounded px-2 py-1 mt-2 hover:bg-white"
                            >
                              Use This
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 p-6 border-t border-[#E5E5EA]">
          <button
            onClick={onClose}
            className="text-black border border-[#E5E5EA] rounded-lg px-4 py-2 hover:bg-[#fffef9]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}