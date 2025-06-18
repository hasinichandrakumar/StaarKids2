import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Bot, Send, Sparkles, BookOpen, Calculator, Target, Lightbulb, Heart, Trophy, Zap, Brain, Star } from "lucide-react";

interface EnhancedNovaBotProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  grade: number;
}

interface ChatMessage {
  id: string;
  type: "user" | "nova";
  content: string;
  timestamp: Date;
  category?: "practice" | "explanation" | "motivation" | "study-plan";
  metadata?: {
    subject?: "math" | "reading";
    teksCode?: string;
    difficulty?: string;
    questionGenerated?: boolean;
  };
}

const NOVA_CAPABILITIES = [
  {
    id: "practice-generation",
    title: "Generate Practice Questions",
    description: "Create unlimited TEKS-aligned questions with AI-powered images and word problems",
    icon: Target,
    color: "bg-blue-500",
    examples: [
      "Generate 5 Grade 4 fraction questions",
      "Create word problems about measurement",
      "Make reading comprehension questions about animals"
    ]
  },
  {
    id: "concept-explanation",
    title: "Explain Concepts Simply",
    description: "Break down complex concepts into easy-to-understand explanations",
    icon: Lightbulb,
    color: "bg-yellow-500",
    examples: [
      "Explain fractions like I'm 9 years old",
      "What is the main idea in reading?",
      "How do I solve word problems step by step?"
    ]
  },
  {
    id: "motivation",
    title: "Motivational Support",
    description: "Provide encouragement, celebrate achievements, and boost confidence",
    icon: Heart,
    color: "bg-pink-500",
    examples: [
      "I'm struggling with math, can you help?",
      "Give me motivation for the STAAR test",
      "I got a question wrong, what should I do?"
    ]
  },
  {
    id: "study-guidance",
    title: "Study Plan Guidance",
    description: "Personalized study recommendations and progress tracking insights",
    icon: Brain,
    color: "bg-purple-500",
    examples: [
      "How should I prepare for my test next month?",
      "What should I focus on this week?",
      "Review my recent performance"
    ]
  }
];

const SAMPLE_CHAT_HISTORY: ChatMessage[] = [
  {
    id: "1",
    type: "nova",
    content: "Hi there! I'm Nova, your AI study companion! 🚀 I'm here to help you master STAAR with practice questions, explanations, and motivation. What would you like to work on today?",
    timestamp: new Date(Date.now() - 300000),
    category: "motivation"
  },
  {
    id: "2",
    type: "user",
    content: "Can you help me with fractions? I don't understand them.",
    timestamp: new Date(Date.now() - 240000)
  },
  {
    id: "3",
    type: "nova",
    content: "Absolutely! Let me explain fractions in a simple way. Think of fractions like pieces of pizza! 🍕\n\nIf you have 1 whole pizza and cut it into 4 equal pieces, each piece is 1/4 (one-fourth) of the pizza.\n\n• The bottom number (4) tells you how many pieces the whole thing is cut into\n• The top number (1) tells you how many pieces you have\n\nSo 2/4 means you have 2 pieces out of 4 total pieces. That's the same as half the pizza!\n\nWould you like me to generate some practice questions about fractions?",
    timestamp: new Date(Date.now() - 180000),
    category: "explanation",
    metadata: { subject: "math", teksCode: "4.2A" }
  }
];

const MOTIVATIONAL_PHRASES = [
  "You're doing amazing! Every question you practice makes you stronger! 💪",
  "Mistakes are just learning opportunities in disguise! Keep going! 🌟",
  "I believe in you! You have the power to master any concept! 🚀",
  "Your progress is incredible! Look how far you've come! 📈",
  "Remember: every expert was once a beginner. You're on your way! 🎯",
  "You're not just preparing for a test - you're building your future! ✨",
  "Challenge accepted! Let's tackle this together step by step! 🏆",
  "Your curiosity and determination will take you far! Keep asking questions! 🤔"
];

export default function EnhancedNovaBot({ isOpen, onClose, user, grade }: EnhancedNovaBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(SAMPLE_CHAT_HISTORY);
  const [inputValue, setInputValue] = useState("");
  const [selectedCapability, setSelectedCapability] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      // Simulate AI response - in production this would call OpenAI API
      return new Promise((resolve) => {
        setTimeout(() => {
          const responses = {
            practice: "I'll generate some practice questions for you! Here are 3 TEKS-aligned questions:\n\n**Question 1:** Which fraction is equivalent to 1/2?\nA) 2/4  B) 1/3  C) 3/5  D) 2/3\n\n**Question 2:** Sarah ate 3/8 of a pizza. What fraction is left?\nA) 5/8  B) 3/5  C) 2/8  D) 6/8\n\n**Question 3:** Which is larger: 2/3 or 3/4?\nA) 2/3  B) 3/4  C) They're equal  D) Can't tell\n\nWould you like me to explain any of these?",
            explanation: "Great question! Let me break this down step by step:\n\n1. **Start with what you know** - Read the problem carefully\n2. **Identify what you need to find** - What is the question asking?\n3. **Choose your strategy** - What math operation do you need?\n4. **Solve step by step** - Show your work\n5. **Check your answer** - Does it make sense?\n\nThis works for almost any math problem! Want to try it with a specific example?",
            motivation: MOTIVATIONAL_PHRASES[Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)] + "\n\nRemember, I'm here to help you succeed! What would you like to work on next?",
            default: "I understand! Let me help you with that. Could you tell me more specifically what you'd like to work on? I can:\n\n• Generate practice questions\n• Explain concepts simply\n• Give you study tips\n• Provide motivation\n\nWhat sounds most helpful right now?"
          };
          
          if (message.toLowerCase().includes('practice') || message.toLowerCase().includes('question')) {
            resolve(responses.practice);
          } else if (message.toLowerCase().includes('explain') || message.toLowerCase().includes('how')) {
            resolve(responses.explanation);
          } else if (message.toLowerCase().includes('motivat') || message.toLowerCase().includes('help') || message.toLowerCase().includes('struggling')) {
            resolve(responses.motivation);
          } else {
            resolve(responses.default);
          }
        }, 1500);
      });
    },
    onSuccess: (response) => {
      const novaMessage: ChatMessage = {
        id: Date.now().toString(),
        type: "nova",
        content: response as string,
        timestamp: new Date(),
        category: "practice"
      };
      setMessages(prev => [...prev, novaMessage]);
      setIsTyping(false);
    },
    onError: () => {
      setIsTyping(false);
      toast({
        title: "Connection Error",
        description: "Unable to reach Nova. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    chatMutation.mutate(inputValue);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (example: string) => {
    setInputValue(example);
    handleSendMessage();
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold">Nova</span>
              <div className="text-sm text-gray-600">Your AI Study Companion</div>
            </div>
            <Badge className="bg-green-500 flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Online</span>
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="chat" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat">Chat with Nova</TabsTrigger>
            <TabsTrigger value="capabilities">Nova's Powers</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="flex-1 flex flex-col space-y-4">
            {/* Chat Area */}
            <ScrollArea ref={scrollAreaRef} className="flex-1 border rounded-lg p-4 space-y-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {message.type === "nova" && (
                        <div className="flex items-center space-x-2 mb-2">
                          <Bot className="w-4 h-4" />
                          <span className="font-semibold text-sm">Nova</span>
                          {message.category && (
                            <Badge variant="outline" className="text-xs">
                              {message.category}
                            </Badge>
                          )}
                        </div>
                      )}
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <div className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4" />
                        <span className="font-semibold text-sm">Nova</span>
                      </div>
                      <div className="flex space-x-1 mt-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="space-y-3">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Nova anything about STAAR prep..."
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction("Generate 3 math practice questions for Grade " + grade)}
                >
                  <Target className="w-3 h-3 mr-1" />
                  Practice Questions
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction("Explain fractions in simple terms")}
                >
                  <Lightbulb className="w-3 h-3 mr-1" />
                  Explain Concept
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction("I need motivation for studying")}
                >
                  <Heart className="w-3 h-3 mr-1" />
                  Motivate Me
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction("Help me create a study plan")}
                >
                  <Brain className="w-3 h-3 mr-1" />
                  Study Help
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="capabilities" className="flex-1">
            <ScrollArea className="h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {NOVA_CAPABILITIES.map((capability) => (
                  <Card key={capability.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${capability.color} rounded-lg flex items-center justify-center`}>
                          <capability.icon className="w-5 h-5 text-white" />
                        </div>
                        <span>{capability.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-600">{capability.description}</p>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Try saying:</h4>
                        <div className="space-y-2">
                          {capability.examples.map((example, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="w-full text-left justify-start h-auto p-2"
                              onClick={() => {
                                setInputValue(example);
                                // Switch to chat tab
                                const chatTab = document.querySelector('[value="chat"]') as HTMLElement;
                                chatTab?.click();
                              }}
                            >
                              "{example}"
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Nova Stats */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span>Nova's Impact on Your Learning</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">247</div>
                      <div className="text-sm text-gray-600">Questions Generated</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">89%</div>
                      <div className="text-sm text-gray-600">Concepts Mastered</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">42</div>
                      <div className="text-sm text-gray-600">Study Sessions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">156</div>
                      <div className="text-sm text-gray-600">StarPower Earned</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}