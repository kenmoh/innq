'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EventCard } from "@/components/events/EventCard";
import { CreateEventDialog } from "@/components/events/CreateEventDialog";
import { useToast } from "@/components/ui/use-toast";


export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  seatingArrangement: string;
  menuSelection: string[];
}

export default function Events() {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "Wine Tasting Evening",
      description: "Experience our finest wine selection with expert sommeliers",
      date: "2024-03-25",
      time: "19:00",
      location: "Main Hall",
      capacity: 30,
      status: "upcoming",
      seatingArrangement: "theater",
      menuSelection: [],
    },
  ]);

  const handleCreateEvent = (newEvent: Omit<Event, "id">) => {
    const event = {
      ...newEvent,
      id: events.length + 1,
    };
    setEvents([...events, event]);
    toast({
      title: "Event Created",
      description: "New event has been successfully created",
    });
  };

  const handleUpdateStatus = (id: number, status: Event["status"]) => {
    setEvents(events.map(event =>
      event.id === id ? { ...event, status } : event
    ));
    toast({
      title: "Event Updated",
      description: `Event status has been updated to ${status}`,
    });
  };

  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter(event => event.id !== id));
    toast({
      title: "Event Deleted",
      description: "Event has been successfully removed",
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Events Management</h1>
        <CreateEventDialog onCreateEvent={handleCreateEvent}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </CreateEventDialog>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDeleteEvent}
          />
        ))}
      </div>
    </div>
  );
}
