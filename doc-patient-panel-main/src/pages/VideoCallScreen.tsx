import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  Users, 
  MessageSquare, 
  Settings,
  Monitor,
  Volume2,
  MoreVertical,
  Send,
  ArrowLeft,
  Maximize,
  Minimize
} from "lucide-react";

const participants = [
  {
    id: 1,
    name: "Dr. Sarah Wilson",
    role: "Cardiologist",
    avatar: "SW",
    isHost: true,
    isMuted: false,
    isVideoOn: true
  },
  {
    id: 2,
    name: "Dr. Mike Johnson",
    role: "Neurologist", 
    avatar: "MJ",
    isHost: false,
    isMuted: true,
    isVideoOn: true
  },
  {
    id: 3,
    name: "Dr. Emily Chen",
    role: "Pediatrician",
    avatar: "EC",
    isHost: false,
    isMuted: false,
    isVideoOn: false
  },
  {
    id: 4,
    name: "You (Admin)",
    role: "Administrator",
    avatar: "AD",
    isHost: false,
    isMuted: false,
    isVideoOn: true
  }
];

const chatMessages = [
  { id: 1, sender: "Dr. Sarah Wilson", message: "Good morning everyone!", time: "9:30 AM" },
  { id: 2, sender: "Dr. Mike Johnson", message: "Ready to discuss the new protocols", time: "9:32 AM" },
  { id: 3, sender: "Dr. Emily Chen", message: "I have some updates on the pediatric guidelines", time: "9:35 AM" },
];

export default function VideoCallScreen() {
  const [searchParams] = useSearchParams();
  const contactName = searchParams.get('contact') || 'Dr. Sarah Wilson';
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState(chatMessages);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const sendChatMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "You",
        message: chatMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setChatMessage("");
    }
  };

  const endCall = () => {
    window.location.href = "/chat";
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'h-[calc(100vh-2rem)] m-4'} bg-gray-900 rounded-lg overflow-hidden relative`}>
      {/* Header Bar */}
      <div className="absolute top-0 left-0 right-0 bg-black/50 text-white p-4 flex justify-between items-center z-20">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/20"
            onClick={() => window.location.href = "/chat"}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h3 className="font-semibold">Call with {contactName}</h3>
            <p className="text-sm opacity-75">Video Call • {formatDuration(callDuration)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/20"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {/* Main Video Area */}
      <div className="h-full relative pt-16">
        {/* Featured Speaker */}
        <div className="h-3/4 relative bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="relative">
            <div className="w-40 h-40 rounded-full bg-gradient-primary flex items-center justify-center text-white text-5xl font-bold shadow-2xl">
              SW
            </div>
            <div className="absolute -bottom-2 -right-2">
              <div className="bg-success rounded-full p-2">
                <Mic className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-6 left-6 bg-black/70 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
            <span className="text-lg font-semibold">Dr. Sarah Wilson</span>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-primary text-primary-foreground text-xs">Host</Badge>
              <span className="text-sm opacity-75">Speaking</span>
            </div>
          </div>
          {/* Host Controls */}
          <div className="absolute top-6 right-6 flex gap-2">
            <Button size="sm" variant="outline" className="bg-black/50 border-white/20 text-white hover:bg-black/70">
              <Monitor className="h-4 w-4 mr-2" />
              Share Screen
            </Button>
          </div>
        </div>

        {/* Participant Thumbnails */}
        <div className="h-1/4 p-4 bg-gray-800 border-t border-gray-700">
          <div className="flex gap-3 h-full">
            {participants.slice(1).map((participant) => (
              <Card key={participant.id} className="relative bg-gray-700 border-gray-600 flex-1 min-w-0">
                <div className="h-full flex items-center justify-center relative">
                  {participant.isVideoOn ? (
                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-medium">
                      {participant.avatar}
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center">
                      <VideoOff className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-xs font-medium truncate">{participant.name}</p>
                  </div>
                  {participant.isMuted && (
                    <div className="absolute top-2 right-2 bg-red-500 rounded-full p-1">
                      <MicOff className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Controls Bar */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/90 rounded-full px-6 py-3 flex items-center gap-3 backdrop-blur-sm shadow-xl">
          <Button
            onClick={() => setIsMuted(!isMuted)}
            size="icon"
            className={`rounded-full transition-all ${isMuted ? "bg-red-500 hover:bg-red-600" : "bg-gray-600 hover:bg-gray-700"}`}
          >
            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>

          <Button
            onClick={() => setIsVideoOn(!isVideoOn)}
            size="icon"
            className={`rounded-full transition-all ${!isVideoOn ? "bg-red-500 hover:bg-red-600" : "bg-gray-600 hover:bg-gray-700"}`}
          >
            {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>

          <Button
            onClick={() => setShowParticipants(!showParticipants)}
            size="icon"
            className={`rounded-full transition-all ${showParticipants ? "bg-primary" : "bg-gray-600 hover:bg-gray-700"}`}
          >
            <Users className="h-5 w-5" />
          </Button>

          <Button
            onClick={() => setShowChat(!showChat)}
            size="icon"
            className={`rounded-full transition-all ${showChat ? "bg-primary" : "bg-gray-600 hover:bg-gray-700"}`}
          >
            <MessageSquare className="h-5 w-5" />
          </Button>

          <Button
            size="icon"
            className="rounded-full bg-gray-600 hover:bg-gray-700 transition-all"
          >
            <Settings className="h-5 w-5" />
          </Button>

          <div className="w-px h-6 bg-gray-500 mx-1"></div>

          <Button
            onClick={endCall}
            size="icon"
            className="rounded-full bg-red-500 hover:bg-red-600 transition-all shadow-lg"
          >
            <Phone className="h-5 w-5 transform rotate-[135deg]" />
          </Button>
        </div>

        {/* Participants Panel */}
        {showParticipants && (
          <div className="absolute right-4 top-4 bottom-20 w-80 bg-white rounded-lg shadow-lg">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Participants ({participants.length})</h3>
            </div>
            <div className="p-4 space-y-3">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-medium">
                      {participant.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{participant.name}</p>
                      <p className="text-xs text-muted-foreground">{participant.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {participant.isMuted && <MicOff className="h-4 w-4 text-red-500" />}
                    {!participant.isVideoOn && <VideoOff className="h-4 w-4 text-gray-500" />}
                    {participant.isHost && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">Host</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Panel */}
        {showChat && (
          <div className="absolute right-4 top-20 bottom-20 w-80 bg-white rounded-lg shadow-xl flex flex-col border">
            <div className="p-4 border-b bg-gradient-to-r from-primary/5 to-primary/10">
              <h3 className="font-semibold">Meeting Chat</h3>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-primary text-sm">{message.sender}</span>
                      <span className="text-xs text-muted-foreground">{message.time}</span>
                    </div>
                    <p className="text-sm text-foreground pl-2 border-l-2 border-primary/20">{message.message}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-4 border-t bg-background">
              <div className="flex gap-2">
                <Input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="text-sm"
                  onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                />
                <Button size="sm" onClick={sendChatMessage} className="bg-primary">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}