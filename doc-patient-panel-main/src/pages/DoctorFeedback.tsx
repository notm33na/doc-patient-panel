import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MessageCircle } from "lucide-react";

const mockFeedback = {
  1: [
    { id: 1, patient: "John Doe", comment: "Excellent care and very kind!", rating: 5 },
    { id: 2, patient: "Alice M.", comment: "Explained everything clearly.", rating: 4 },
  ],
  2: [
    { id: 1, patient: "Peter R.", comment: "Very knowledgeable neurologist.", rating: 5 },
  ],
};

export default function DoctorFeedback() {
  const { id } = useParams();
  const feedbackList = mockFeedback[id as keyof typeof mockFeedback] || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Doctor Feedback</h1>
      {feedbackList.length === 0 ? (
        <p className="text-muted-foreground">No feedback available for this doctor.</p>
      ) : (
        feedbackList.map((fb) => (
          <Card key={fb.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{fb.patient}</span>
                <Badge className="bg-warning/10 text-warning">
                  <Star className="h-4 w-4 fill-current mr-1" />
                  {fb.rating}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <MessageCircle className="h-4 w-4 text-muted-foreground mt-1" />
              <p>{fb.comment}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
