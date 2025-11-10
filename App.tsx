import React, { useState } from 'react';
import { ai } from './services/geminiService';
import { Header } from './components/Header';
import { ChatHistory } from './components/ImageDisplay';
import { ChatInput } from './components/PromptForm';
import { Footer } from './components/Footer';
import type { Content, Part } from '@google/genai';

interface Message {
    role: 'user' | 'model';
    content: string;
    image?: string; // Data URL for display
}

// Convert message history to API-compatible format
const messagesToApiHistory = (messages: Message[]): Content[] => {
    return messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }], // Note: This simplification ignores images in history
    })).filter(msg => msg.parts[0].text); // Filter out empty model responses during streaming
};

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const App: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', content: 'Hello! How can I help you today? You can send text or images.' }
    ]);
    const [input, setInput] = useState<string>('');
    const [image, setImage] = useState<string | null>(null); // dataURL for preview
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!input.trim() && !imageFile) || isLoading) return;

        const history = messagesToApiHistory(messages);

        const userMessage: Message = { role: 'user', content: input, image: image };
        setMessages(prev => [...prev, userMessage]);
        
        const currentInput = input;
        const currentImageFile = imageFile;
        setInput('');
        setImage(null);
        setImageFile(null);
        setIsLoading(true);
        setError(null);
        
        try {
            const model = 'gemini-2.5-flash';

            const parts: Part[] = [];

            if (currentInput.trim()) {
                parts.push({ text: currentInput.trim() });
            }
            if (currentImageFile) {
                const base64Image = await fileToBase64(currentImageFile);
                parts.push({
                    inlineData: {
                        mimeType: currentImageFile.type,
                        data: base64Image.split(',')[1],
                    },
                });
            }

            const contents: Content[] = [...history, { role: 'user', parts }];

            const responseStream = await ai.models.generateContentStream({ model, contents });

            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', content: '' }]);

            for await (const chunk of responseStream) {
                const chunkText = chunk.text;
                if (chunkText) {
                    modelResponse += chunkText;
                    setMessages(prev => {
                        const newMessages = [...prev];
                        newMessages[newMessages.length - 1].content = modelResponse;
                        return newMessages;
                    });
                }
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Failed to get response: ${errorMessage}`);
            setMessages(prev => [...prev, { role: 'model', content: `Sorry, something went wrong: ${errorMessage}` }]);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (file: File | null) => {
        if (!file) {
            setImage(null);
            setImageFile(null);
            return;
        }
        if (!file.type.startsWith('image/')) {
            setError('Please select a valid image file.');
            return;
        }
        setError(null);
        setImageFile(file);
        fileToBase64(file).then(setImage);
    };
    
    const handleRemoveImage = () => {
        setImage(null);
        setImageFile(null);
    };

    return (
        <div className="flex flex-col h-screen font-sans bg-base-100">
            <Header />
            <main className="flex-grow container mx-auto px-0 md:px-4 py-4 flex flex-col overflow-hidden">
                <div className="flex-grow w-full max-w-4xl mx-auto bg-base-200 rounded-2xl shadow-2xl flex flex-col">
                    <ChatHistory messages={messages} isLoading={isLoading} />
                    {error && (
                        <div className="px-4 pb-2 text-red-400" role="alert">
                            {error}
                        </div>
                    )}
                    <div className="border-t border-base-300">
                         <ChatInput
                            input={input}
                            setInput={setInput}
                            onSubmit={handleSendMessage}
                            isLoading={isLoading}
                            imagePreviewUrl={image}
                            onImageChange={handleImageChange}
                            onRemoveImage={handleRemoveImage}
                         />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default App;