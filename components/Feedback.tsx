'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FeedbackItem {
  id: number;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

const mockFeedback: FeedbackItem[] = [
  {
    id: 1,
    customerName: "John Doe",
    rating: 5,
    comment: "Excellent service and amazing food!",
    date: "2024-03-20",
  },
  {
    id: 2,
    customerName: "Jane Smith",
    rating: 4,
    comment: "Great atmosphere, but slightly slow service",
    date: "2024-03-19",
  },
];

export default function Feedback() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Customer Feedback</h2>
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="grid grid-cols-3 gap-4">
          {mockFeedback.map((feedback) => (
            <Card key={feedback.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{feedback.customerName}</span>
                  <span className="text-sm text-muted-foreground">{feedback.date}</span>
                </CardTitle>
                <CardDescription>Rating: {feedback.rating}/5</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{feedback.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}