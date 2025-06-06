import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StarIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { SparklesIcon } from "@heroicons/react/24/outline";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface NovaChatProps {
  grade: number;
  isOpen: boolean;
  onClose: () => void;
}

const NovaAvatar = ({ isAnimated = false }: { isAnimated?: boolean }) => (
  <div className={`relative ${isAnimated ? 'animate-pulse' : ''}`}>
    <StarIcon className="w-12 h-12 text-yellow-400 drop-shadow-lg" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-6 h-6 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center">
        <SparklesIcon className="w-3 h-3 text-white" />
      </div>
    </div>
  </div>
);

export default function NovaChat({ grade, isOpen, onClose }: NovaChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hi there! I'm Nova, your learning buddy! I'm here to help you with your STAAR test prep. I love giving detailed explanations to help you understand everything step by step. You'll earn starpower for every correct answer you get! How are you feeling about ${grade}th grade today?`,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getNovaResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch('/api/nova-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          grade: grade
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get Nova response');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error getting Nova response:', error);
      return "Oops! I'm having trouble thinking right now. Can you try asking me again?";
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const novaResponse = await getNovaResponse(inputText);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: novaResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble right now. Let's try again!",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md h-[600px] flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader className="border-b bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <NovaAvatar />
              <div>
                <h3 className="font-bold text-lg">Nova</h3>
                <p className="text-blue-100 text-sm">Your Learning Buddy</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              ✕
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!message.isUser && (
                  <div className="mr-2 mt-1">
                    <NovaAvatar />
                  </div>
                )}
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.isUser
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words leading-relaxed overflow-wrap-anywhere hyphens-auto" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="mr-2 mt-1">
                  <NovaAvatar isAnimated />
                </div>
                <div className="bg-white border border-gray-200 rounded-lg rounded-bl-none p-3 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t p-4 bg-white">
            <div className="flex space-x-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Nova anything about your studies..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <PaperAirplaneIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}