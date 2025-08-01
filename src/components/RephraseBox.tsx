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
}

export function RephraseBox({ rephraseResponse, isLoading, onApply, onClose }: RephraseBoxProps) {
  if (!rephraseResponse && !isLoading) return null;

  return (
    <div className="mt-4 space-y-3 animate-in slide-in-from-top-2">
      {isLoading ? (
        <Card className="border-[#75E6DA]">
          <CardContent className="p-4 flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin mr-2 text-[#05445E]" />
            <span className="text-sm text-[#71717A]">Generating rephrase suggestions...</span>
          </CardContent>
        </Card>
      ) : (
        <>
          {rephraseResponse?.rephrased && (
            <Card className="border-[#75E6DA] bg-[#D4F1F4]/10">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-[#05445E]">Suggested Rephrase:</h4>
                  <p className="text-sm text-black leading-relaxed">
                    {rephraseResponse.rephrased}
                  </p>
                  <div className="flex items-center justify-between">
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
              </CardContent>
            </Card>
          )}

          {rephraseResponse?.alternatives && rephraseResponse.alternatives.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[#71717A] px-1">Alternative options:</h4>
              {rephraseResponse.alternatives.map((alternative, index) => (
                <Card key={index} className="border-gray-200">
                  <CardContent className="p-3">
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
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}