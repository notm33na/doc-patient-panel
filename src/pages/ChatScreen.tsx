import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search, Send, Phone, Video, MoreVertical, Paperclip, Smile } from "lucide-react";

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
    isSent: false
  },
  {
    id: 2,
    sender: "You",
    message: "Good morning Dr. Wilson! The records are looking great. All patients have been updated with their latest test results.",
    time: "9:32 AM",
    isSent: true
  },
  {
    id: 3,
    sender: "Dr. Sarah Wilson",
    message: "Excellent! Could you please send me the summary report for this week?",
    time: "9:35 AM",
    isSent: false
  },
  {
    id: 4,
    sender: "You",
    message: "Absolutely! I'll prepare that right away and send it to you within the next hour.",
    time: "9:36 AM",
    isSent: true
  },
  {
    id: 5,
    sender: "Dr. Sarah Wilson",
    message: "Perfect! Also, we need to discuss the upcoming staff meeting scheduled for Friday.",
    time: "2:30 PM",
    isSent: false
  }
];

export default function ChatScreen() {
  const [selectedChat, setSelectedChat] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sendMessage = () => {
    if (newMessage.trim()) {
      // Handle sending message
      setNewMessage("");
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-card rounded-lg shadow-soft overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold mb-3">Messages</h2>
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
              className={`p-4 border-b border-border cursor-pointer transition-colors hover:bg-accent ${
                selectedChat.id === conversation.id ? "bg-accent" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-medium">
                    {conversation.avatar}
                  </div>
                  {conversation.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium truncate">{conversation.name}</h3>
                    <span className="text-xs text-muted-foreground">{conversation.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                    {conversation.unread > 0 && (
                      <Badge className="bg-primary text-primary-foreground text-xs px-2 py-1 ml-2">
                        {conversation.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-border bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-medium">
                  {selectedChat.avatar}
                </div>
                {selectedChat.online && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background"></div>
                )}
              </div>
              <div>
                <h3 className="font-medium">{selectedChat.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedChat.online ? "Online" : "Last seen recently"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.isSent
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p className={`text-xs mt-1 ${message.isSent ? "text-primary-foreground/70" : "text-muted-foreground/70"}`}>
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Paperclip className="h-5 w-5" />
            </Button>
            <div className="flex-1 relative">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                className="pr-10"
              />
              <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2">
                <Smile className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={sendMessage} className="bg-gradient-primary">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}