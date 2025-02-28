export interface Event {
  id: number;
  title: string;
  coffeeBreak?: number;
  lunch?: number;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  seatingArrangement: string;
  menuSelection: string[];
}
