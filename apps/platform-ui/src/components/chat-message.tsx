import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import { PDFDocument } from '@/types/graphTypes';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface ChatMessageProps {
  message: {
    role: 'user' | 'assistant';
    content: string;
    sources?: PDFDocument[];
  };
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const isLoading = message.role === 'assistant' && message.content === '';
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [thinking, setThinking] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      const content = message.content;
      const thinkStart = content.indexOf('<think>');
      const thinkEnd = content.indexOf('</think>');

      if (thinkStart !== -1 && thinkEnd === -1) {
        setThinking(true);
      } else if (thinkEnd !== -1) {
        setThinking(false);
      }
    }
  }, [message.content]);

  const renderContent = (content: string) => {
  const parts = content.split(/(<think>[\s\S]*?<\/think>)/).filter(str => str.trim().length > 0);
  return parts.map((part, index) => {
    if (part.startsWith('<think>')) {
      const isComplete = part.includes('</think>');
      return (
        <Accordion type="single" defaultValue="thinking" collapsible className="w-full mt-2 italic text-gray-500">
          <AccordionItem value="thinking" className="border-b-0">
            <AccordionTrigger className="text-sm py-2 justify-start gap-2 hover:no-underline">
              Thinking...
            </AccordionTrigger>
            <AccordionContent>
              {part.replace(/<\/?think>/g, '')}
              {!isComplete && '...'}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] ${isUser ? 'bg-black text-white' : 'bg-muted'} rounded-2xl px-4 py-2`}
      >
        {isLoading ? (
          <div className="flex space-x-1 h-6 items-center">
            <div className="w-1.5 h-1.5 bg-current rounded-full animate-[loading_1s_ease-in-out_infinite]" />
            <div className="w-1.5 h-1.5 bg-current rounded-full animate-[loading_1s_ease-in-out_0.2s_infinite]" />
            <div className="w-1.5 h-1.5 bg-current rounded-full animate-[loading_1s_ease-in-out_0.4s_infinite]" />
          </div>
        ) : (
          <>

              <p ref={contentRef} className={` ${thinking ? 'italic text-gray-500' : ''}`}>
              {renderContent(message.content)}
            </p>
            {!isUser && (
              <div className="flex gap-2 mt-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleCopy}
                  title={copied ? 'Copied!' : 'Copy to clipboard'}
                >
                  <Copy
                    className={`h-4 w-4 ${copied ? 'text-green-500' : ''}`}
                  />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
