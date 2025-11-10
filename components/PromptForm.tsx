import React, { useRef } from 'react';

interface ChatInputProps {
  input: string;
  setInput: (input: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  imagePreviewUrl: string | null;
  onImageChange: (file: File | null) => void;
  onRemoveImage: () => void;
}

const SendIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
);

const PaperClipIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.5 10.5a.75.75 0 001.06 1.06l10.5-10.5a.75.75 0 011.06 0 2.25 2.25 0 010 3.182l-6.75 6.75a.75.75 0 001.06 1.06l6.75-6.75a3.75 3.75 0 00-5.303-5.303l-10.5 10.5a2.25 2.25 0 003.182 3.182l6.75-6.75a.75.75 0 011.06 1.06l-6.75 6.75a3.75 3.75 0 11-5.303-5.303l10.5-10.5a.75.75 0 00-1.06-1.06l-10.5 10.5a5.25 5.25 0 007.424 7.424l10.5-10.5a2.25 2.25 0 000-3.182z" clipRule="evenodd" />
  </svg>
);

const XMarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
  </svg>
);


export const ChatInput: React.FC<ChatInputProps> = ({ input, setInput, onSubmit, isLoading, imagePreviewUrl, onImageChange, onRemoveImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageChange(e.target.files[0]);
    }
    e.target.value = '';
  };

  return (
    <form onSubmit={onSubmit} className="p-2">
       {imagePreviewUrl && (
        <div className="relative w-fit p-2">
          <img src={imagePreviewUrl} alt="Image preview" className="max-h-24 rounded-lg" />
          <button
            type="button"
            onClick={onRemoveImage}
            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/75 transition-colors"
            aria-label="Remove image"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}
      <div className="flex items-end space-x-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="p-3 text-text-secondary hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Attach image"
        >
          <PaperClipIcon className="w-6 h-6" />
        </button>
        <textarea
          id="prompt-input"
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message AI..."
          className="flex-grow bg-base-300 border border-base-300 rounded-lg p-3 text-text-primary focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-200 resize-none"
          disabled={isLoading}
          style={{ maxHeight: '150px' }}
          onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
          }}
        />
        <button
          type="submit"
          disabled={isLoading || (!input.trim() && !imagePreviewUrl)}
          className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold p-3 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105"
          aria-label="Send message"
        >
          <SendIcon className="w-6 h-6" />
        </button>
      </div>
    </form>
  );
};