import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Send, 
  Phone, 
  Video, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  ArrowLeft,
  Check,
  CheckCheck,
  Mic,
  Image,
  Camera
} from "lucide-react";

const conversations = [
  {
    id: 1,
    name: "Dr. Sarah Wilson",
    lastMessage: "Patient consultation completed",
    time: "2:30 PM",
    unread: 2,
    avatar: "SW",
    online: true
  },
  {
    id: 2,
    name: "Dr. Mike Johnson",
    lastMessage: "Thanks for the update",
    time: "1:15 PM",
    unread: 0,
    avatar: "MJ",
    online: false
  },
  {
    id: 3,
    name: "Dr. Emily Chen",
    lastMessage: "Can we schedule a meeting?",
    time: "11:30 AM",
    unread: 1,
    avatar: "EC",
    online: true
  },
  {
    id: 4,
    name: "Dr. Robert Brown",
    lastMessage: "Prescription updated",
    time: "Yesterday",
    unread: 0,
    avatar: "RB",
    online: false
  }
];

const messages = [
  {
    id: 1,
    sender: "Dr. Sarah Wilson",
    message: "Good morning! How are the new patient records looking?",
    time: "9:30 AM",
    isSent: false,
    status: "read",
    type: "text"
  },
  {
    id: 2,
    sender: "You",
    message: "Good morning Dr. Wilson! The records are looking great. All patients have been updated with their latest test results.",
    time: "9:32 AM",
    isSent: true,
    status: "delivered",
    type: "text"
  },
  {
    id: 3,
    sender: "Dr. Sarah Wilson",
    message: "Excellent! Could you please send me the summary report for this week?",
    time: "9:35 AM",
    isSent: false,
    status: "read",
    type: "text"
  },
  {
    id: 4,
    sender: "You",
    message: "Absolutely! I'll prepare that right away and send it to you within the next hour.",
    time: "9:36 AM",
    isSent: true,
    status: "read",
    type: "text"
  },
  {
    id: 5,
    sender: "Dr. Sarah Wilson",
    message: "Perfect! Also, we need to discuss the upcoming staff meeting scheduled for Friday.",
    time: "2:30 PM",
    isSent: false,
    status: "read",
    type: "text"
  },
  {
    id: 6,
    sender: "You",
    message: "📋 Weekly Report - Patient Analytics.pdf",
    time: "2:45 PM", 
    isSent: true,
    status: "delivered",
    type: "file"
  }
];

export default function ChatScreen() {
  const [selectedChat, setSelectedChat] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [chatMessages, setChatMessages] = useState(messages);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatMessages]);

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: chatMessages.length + 1,
        sender: "You",
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSent: true,
        status: "sent" as const,
        type: "text" as const
      };
      
      setChatMessages([...chatMessages, message]);
      setNewMessage("");
      
      // Simulate message status updates
      setTimeout(() => {
        setChatMessages(prev => prev.map(msg => 
          msg.id === message.id ? { ...msg, status: "delivered" } : msg
        ));
      }, 1000);
      
      setTimeout(() => {
        setChatMessages(prev => prev.map(msg => 
          msg.id === message.id ? { ...msg, status: "read" } : msg
        ));
      }, 3000);
    }
  };

  const getMessageStatus = (status: string) => {
    switch(status) {
      case "sent":
        return <Check className="h-3 w-3 text-muted-foreground" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-primary" />;
      default:
        return null;
    }
  };

  const simulateVideoCall = () => {
    window.location.href = "/video";
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-background rounded-lg shadow-soft overflow-hidden border">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-border flex flex-col bg-card">
        {/* Header */}
        <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">Chats</h2>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Camera className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedChat(conversation)}
              className={`p-3 border-b border-border/50 cursor-pointer transition-all duration-200 hover:bg-accent ${
                selectedChat.id === conversation.id ? "bg-primary/10 border-l-4 border-l-primary" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-medium shadow-soft">
                    {conversation.avatar}
                  </div>
                  {conversation.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-success rounded-full border-2 border-background shadow-sm"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium truncate text-foreground">{conversation.name}</h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{conversation.time}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm text-muted-foreground truncate pr-2">{conversation.lastMessage}</p>
                    {conversation.unread > 0 && (
                      <div className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-sm">
                        {conversation.unread}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gradient-to-b from-background to-background/95">
        {/* Chat Header */}
        <div className="p-4 border-b border-border bg-card shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="md:hidden">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-medium">
                  {selectedChat.avatar}
                </div>
                {selectedChat.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-background"></div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{selectedChat.name}</h3>
                <p className="text-sm text-success">
                  {selectedChat.online ? (isTyping ? "typing..." : "online") : "last seen recently"}
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <Phone className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-primary/10"
                onClick={simulateVideoCall}
              >
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-primary/5 via-background to-background">
          <div className="space-y-3">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
              >
                <div className="max-w-[75%] group">
                  <div
                    className={`rounded-2xl px-4 py-2 shadow-sm ${
                      message.isSent
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-card text-card-foreground border rounded-bl-md"
                    }`}
                  >
                    {message.type === "file" ? (
                      <div className="flex items-center gap-2">
                        <Paperclip className="h-4 w-4" />
                        <span className="text-sm">{message.message}</span>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed">{message.message}</p>
                    )}
                  </div>
                  <div className={`flex items-center gap-1 mt-1 px-1 ${message.isSent ? "justify-end" : "justify-start"}`}>
                    <span className={`text-xs opacity-70 ${message.isSent ? "text-muted-foreground" : "text-muted-foreground"}`}>
                      {message.time}
                    </span>
                    {message.isSent && getMessageStatus(message.status)}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-card border rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <Image className="h-5 w-5" />
            </Button>
            <div className="flex-1 relative">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                className="pr-10 rounded-full border-2 focus:border-primary"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
              >
                <Smile className="h-4 w-4" />
              </Button>
            </div>
            {newMessage.trim() ? (
              <Button 
                onClick={sendMessage} 
                size="icon"
                className="bg-primary hover:bg-primary/90 rounded-full shadow-lg"
              >
                <Send className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-primary"
              >
                <Mic className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}