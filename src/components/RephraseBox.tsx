import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface RephraseBoxProps {
  rephraseResponse: {
    rephrased?: string;
    alternatives?: string[];
    wordCount?: number;
  } | null;
  isLoading: boolean;
  onApply: (content: string) => void;
  onClose: () => void;
  originalText: string;
}

export function RephraseBox({ rephraseResponse, isLoading, onApply, onClose, originalText }: RephraseBoxProps) {
  if (!rephraseResponse && !isLoading) return null;


  return (
    <div className="space-y-3 animate-in slide-in-from-right-2">
      {isLoading ? (
        <div className="w-full rounded-lg border-2 border-[#75E6DA] bg-white">
          <div className="p-4 flex items-center justify-center min-h-[200px]">
            <Loader2 className="w-5 h-5 animate-spin mr-2 text-[#05445E]" />
            <span className="text-sm text-[#71717A]">Generating rephrase suggestions...</span>
          </div>
        </div>
      ) : (
        <>
          {rephraseResponse?.rephrased && (
            <div className="w-full rounded-lg border-2 border-[#75E6DA] bg-white">
              <div className="prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4 text-[#202124]">
                <p className="text-sm text-black leading-relaxed whitespace-pre-wrap">
                  {rephraseResponse.rephrased}
                </p>
              </div>
              
              <div className="flex items-center justify-between p-3 border-t border-gray-100">
                <span className="text-xs text-[#71717A]">
                  {rephraseResponse.wordCount || rephraseResponse.rephrased.split(/\s+/).filter(w => w).length} words
                </span>
                <div className="flex gap-2">
                  <Button
                    onClick={onClose}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      onApply(rephraseResponse.rephrased!);
                      onClose();
                    }}
                    size="sm"
                    className="bg-[#05445E] hover:bg-[#189AB4] text-white"
                  >
                    Accept
                  </Button>
                </div>
              </div>
            </div>
          )}

          {rephraseResponse?.alternatives && rephraseResponse.alternatives.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium text-[#71717A] px-1">Alternative options:</h4>
              {rephraseResponse.alternatives.map((alternative, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <p className="text-sm text-black leading-relaxed mb-2">
                    {alternative}
                  </p>
                  <Button
                    onClick={() => {
                      onApply(alternative);
                      onClose();
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-[#05445E] hover:text-[#189AB4]"
                  >
                    Use This
                  </Button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}