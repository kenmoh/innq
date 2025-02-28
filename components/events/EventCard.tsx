import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Coffee, MapPin, Users, Utensils } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Event } from "@/types/event";




interface EventCardProps {
  event: Event;
  onUpdateStatus: (id: number, status: Event["status"]) => void;
  onDelete: (id: number) => void;
}

export function EventCard({ event, onUpdateStatus, onDelete }: EventCardProps) {
  return (
    <Card className="shadow-none rounded-md border-[0.25px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">{event.title}</h3>
          <Badge
            variant={
              event.status === "completed"
                ? "default"
                : event.status === "cancelled"
                  ? "destructive"
                  : event.status === "ongoing"
                    ? "secondary"
                    : "outline"
            }
          >
            {event.status}
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onUpdateStatus(event.id, "upcoming")}>
              Mark as Upcoming
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUpdateStatus(event.id, "ongoing")}>
              Mark as Ongoing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUpdateStatus(event.id, "completed")}>
              Mark as Completed
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUpdateStatus(event.id, "cancelled")}>
              Mark as Cancelled
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(event.id)}
            >
              Delete Event
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">{event.description}</p>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {event.date}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {event.time}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {event.location}
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {event.capacity} guests
          </div>
          <div className="flex items-center gap-2">
            <Coffee className="h-4 w-4" />
            {event.capacity} Coffee
          </div>
          <div className="flex items-center gap-2">
            <Utensils className="h-4 w-4" />
            {event.capacity} Lunch
          </div>
        </div>
      </CardContent>
      <CardFooter>
      </CardFooter>
    </Card>
  );
}