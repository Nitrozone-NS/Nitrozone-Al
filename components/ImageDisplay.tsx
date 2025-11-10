import React, { useRef, useEffect } from 'react';

const FormattedContent: React.FC<{ content: string }> = ({ content }) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return (
        <p className="whitespace-pre-wrap">
            {parts.map((part, index) => {
                if (part.startsWith('```') && part.endsWith('```')) {
                    const code = part.slice(3, -3).trim();
                    const language = code.split('\n')[0].toLowerCase();
                    return (
                        <pre key={index} className="bg-base-100 p-3 rounded-md my-2 overflow-x-auto">
                            <code className={`language-${language}`}>{code}</code>
                        </pre>
                    );
                }
                return <span key={index}>{part}</span>;
            })}
        </p>
    );
};

interface Message {
    role: 'user' | 'model';
    content: string;
    image?: string;
}

interface ChatHistoryProps {
  messages: Message[];
  isLoading: boolean;
}

const TypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1 p-3">
        <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce"></div>
    </div>
);


export const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, isLoading }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    return (
    <div ref={scrollRef} className="flex-grow p-4 space-y-4 overflow-y-auto">
      {messages.map((msg, index) => (
        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div
            className={`max-w-xl lg:max-w-2xl px-4 py-3 rounded-2xl flex flex-col ${
              msg.role === 'user'
                ? 'bg-brand-primary text-white rounded-br-none'
                : 'bg-base-300 text-text-primary rounded-bl-none'
            }`}
          >
            {msg.image && (
                <img src={msg.image} alt="User upload" className="rounded-lg mb-2 max-w-full h-auto" style={{maxWidth: '320px'}} />
            )}
            {msg.content && <FormattedContent content={msg.content} />}
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-start">
             <div className="px-4 py-2 rounded-2xl bg-base-300 text-text-primary rounded-bl-none">
                <TypingIndicator />
             </div>
        </div>
      )}
    </div>
  );
};