
import React, { useState } from 'react';
import { ChatSidebar } from '@/components/ChatSidebar';
import { VideoEditor } from '@/components/VideoEditor';
import { Toolbar } from '@/components/Toolbar';

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Chat Sidebar */}
      <div className={`transition-all duration-300 ${isChatOpen ? 'w-80' : 'w-0'} overflow-hidden`}>
        <ChatSidebar isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} />
      </div>

      {/* Main Video Editor Area */}
      <div className="flex-1 flex flex-col">
        <Toolbar isChatOpen={isChatOpen} onToggleChat={() => setIsChatOpen(!isChatOpen)} />
        <VideoEditor />
      </div>
    </div>
  );
};

export default Index;
