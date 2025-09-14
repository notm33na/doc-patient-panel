import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  MoreVertical
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

export default function VideoCallScreen() {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="h-[calc(100vh-8rem)] bg-gray-900 rounded-lg overflow-hidden relative">
      {/* Main Video Area */}
      <div className="h-full relative">
        {/* Featured Speaker */}
        <div className="h-3/4 relative bg-gray-800 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-gradient-primary flex items-center justify-center text-white text-4xl font-bold">
            SW
          </div>
          <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-lg">
            <span className="text-sm font-medium">Dr. Sarah Wilson</span>
            <span className="text-xs ml-2 opacity-75">Host</span>
          </div>
          {/* Host Controls */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button size="sm" variant="outline" className="bg-black/50 border-white/20 text-white">
              <Monitor className="h-4 w-4 mr-1" />
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
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/80 rounded-full px-6 py-3 flex items-center gap-4">
          <Button
            onClick={() => setIsMuted(!isMuted)}
            size="icon"
            className={`rounded-full ${isMuted ? "bg-red-500 hover:bg-red-600" : "bg-gray-600 hover:bg-gray-700"}`}
          >
            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>

          <Button
            onClick={() => setIsVideoOn(!isVideoOn)}
            size="icon"
            className={`rounded-full ${!isVideoOn ? "bg-red-500 hover:bg-red-600" : "bg-gray-600 hover:bg-gray-700"}`}
          >
            {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>

          <Button
            onClick={() => setShowParticipants(!showParticipants)}
            size="icon"
            className="rounded-full bg-gray-600 hover:bg-gray-700"
          >
            <Users className="h-5 w-5" />
          </Button>

          <Button
            onClick={() => setShowChat(!showChat)}
            size="icon"
            className="rounded-full bg-gray-600 hover:bg-gray-700"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>

          <Button
            size="icon"
            className="rounded-full bg-gray-600 hover:bg-gray-700"
          >
            <Settings className="h-5 w-5" />
          </Button>

          <Button
            size="icon"
            className="rounded-full bg-red-500 hover:bg-red-600"
          >
            <Phone className="h-5 w-5 transform rotate-[135deg]" />
          </Button>
        </div>

        {/* Meeting Info */}
        <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg">
          <h3 className="font-medium">Weekly Staff Meeting</h3>
          <p className="text-sm opacity-75">Meeting ID: 123-456-789</p>
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
          <div className="absolute right-4 top-4 bottom-20 w-80 bg-white rounded-lg shadow-lg flex flex-col">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Meeting Chat</h3>
            </div>
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              <div className="text-sm">
                <p className="font-medium text-primary">Dr. Sarah Wilson</p>
                <p className="text-muted-foreground">Good morning everyone!</p>
                <p className="text-xs text-muted-foreground">9:30 AM</p>
              </div>
              <div className="text-sm">
                <p className="font-medium text-primary">Dr. Mike Johnson</p>
                <p className="text-muted-foreground">Ready to discuss the new protocols</p>
                <p className="text-xs text-muted-foreground">9:32 AM</p>
              </div>
            </div>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border rounded-lg text-sm"
                />
                <Button size="sm">Send</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}