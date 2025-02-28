import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Event } from "@/types/event";

const locations = [
  { name: "Main Dining Room", price: 1500, capacity: 200 },
  { name: "Private Dining Room", price: 800, capacity: 50 },
  { name: "Outdoor Patio", price: 1200, capacity: 150 },
  { name: "Banquet Hall", price: 2000, capacity: 300 },
  { name: "Bar Area", price: 1000, capacity: 100 },
  { name: "Rooftop Terrace", price: 1800, capacity: 180 },
] as const;

const seatingArrangements = [
  {
    id: "theater",
    name: "Theater Style",
    image: "/seating/theater.png",
    description: "Rows of chairs facing the front"
  },
  {
    id: "classroom",
    name: "Classroom Style",
    image: "/seating/classroom.png",
    description: "Rows of tables with chairs facing front"
  },
  {
    id: "banquet",
    name: "Banquet Style",
    image: "/seating/banquet.png",
    description: "Round tables with chairs"
  },
  {
    id: "ushape",
    name: "U-Shape Style",
    image: "/seating/ushape.png",
    description: "Tables arranged in U shape"
  }
] as const;

const menuOptions = [
  {
    type: "Coffee Break",
    items: [
      {
        name: "Standard Coffee Break",
        price: "$12/person",
        items: [
          "Premium Coffee",
          "Selection of Teas",
          "Filtered Water",
          "Assorted Cookies"
        ]
      },
      {
        name: "Premium Coffee Break",
        price: "$18/person",
        items: [
          "Premium Coffee",
          "Selection of Teas",
          "Filtered Water",
          "Assorted Cookies",
          "Fresh Danish Pastries",
          "Seasonal Fresh Fruits"
        ]
      },
      {
        name: "Deluxe Coffee Break",
        price: "$25/person",
        items: [
          "Premium Coffee",
          "Selection of Teas",
          "Filtered Water",
          "Assorted Cookies",
          "Fresh Danish Pastries",
          "Seasonal Fresh Fruits",
          "Mini Sandwiches Selection"
        ]
      }
    ]
  },
  {
    type: "Lunch",
    items: [
      {
        name: "Working Lunch",
        price: "$35/person",
        items: [
          "Gourmet Sandwiches",
          "Fresh Green Salad",
          "Pasta Salad",
          "Fresh Fruits",
          "Soft Drinks"
        ]
      },
      {
        name: "Hot Buffet Lunch",
        price: "$45/person",
        isBuffet: true
      },
      {
        name: "Plated Service Lunch",
        price: "$55/person",
        items: [
          "Choice of Starter",
          "Main Course Selection",
          "Dessert",
          "Coffee/Tea"
        ]
      }
    ]
  },
  {
    type: "Dinner",
    items: [
      {
        name: "Buffet Dinner",
        price: "$65/person",
        isBuffet: true
      },
      {
        name: "3-Course Plated Dinner",
        price: "$85/person",
        items: [
          "Appetizer",
          "Main Course",
          "Dessert",
          "Coffee/Tea Service"
        ]
      },
      {
        name: "5-Course Gala Dinner",
        price: "$120/person",
        items: [
          "Amuse-bouche",
          "Appetizer",
          "Soup",
          "Main Course",
          "Dessert",
          "Coffee/Tea Service",
          "Petit Fours"
        ]
      }
    ]
  }
];

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
  time: z.string(),
  location: z.string().refine((val) => locations.some(loc => loc.name === val), {
    message: "Please select a valid location",
  }),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  status: z.enum(["upcoming", "ongoing", "completed", "cancelled"]).default("upcoming"),
  seatingArrangement: z.enum(seatingArrangements.map(arr => arr.id) as [string, ...string[]]),
  menuSelection: z.array(z.string()).min(1, "Please select at least one menu option"),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateEventDialogProps {
  children: React.ReactNode;
  onCreateEvent: (event: Omit<Event, "id">) => void;
}

export function CreateEventDialog({ children, onCreateEvent }: CreateEventDialogProps) {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      dateRange: {
        from: new Date(),
        to: new Date(),
      },
      time: "",
      location: undefined,
      capacity: 1,
      status: "upcoming",
      seatingArrangement: seatingArrangements[0].id,
      menuSelection: [],
    },
  });

  const onSubmit = (values: FormValues) => {
    const event: Omit<Event, "id"> = {
      title: values.title,
      description: values.description,
      date: `${format(values.dateRange.from, 'yyyy-MM-dd')} to ${format(values.dateRange.to, 'yyyy-MM-dd')}`,
      time: values.time,
      location: values.location,
      capacity: values.capacity,
      status: values.status,
      seatingArrangement: values.seatingArrangement,
      menuSelection: values.menuSelection,
    };

    onCreateEvent(event);
    form.reset();
    toast({
      title: "Success",
      description: "Event has been created successfully.",
    });
  };

  const calculateTotalCost = (values: z.infer<typeof formSchema>) => {
    let foodCost = 0;
    let beverageCost = 0;
    let hallCost = 0;

    // Calculate venue cost
    const selectedLocation = locations.find(loc => loc.name === values.location);
    if (selectedLocation) {
      hallCost = selectedLocation.price;
    }

    // Calculate food and beverage costs
    values.menuSelection.forEach(selection => {
      menuOptions.forEach(category => {
        category.items.forEach(item => {
          if (item.name === selection) {
            const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
            if (category.type === "Coffee Break") {
              beverageCost += price * values.capacity;
            } else {
              foodCost += price * values.capacity;
            }
          }
        });
      });
    });

    return {
      foodCost,
      beverageCost,
      hallCost,
      total: foodCost + beverageCost + hallCost
    };
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new event.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date Range</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value?.from ? (
                            field.value.to ? (
                              <>
                                {format(field.value.from, "LLL dd, y")} -{" "}
                                {format(field.value.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(field.value.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date range</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={field.value?.from}
                        selected={field.value as DateRange}
                        onSelect={field.onChange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.name} value={location.name}>
                          {location.name} - ${location.price} (Capacity: {location.capacity})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="seatingArrangement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seating Arrangement</FormLabel>
                  <div className="grid grid-cols-2 gap-4">
                    {seatingArrangements.map((arrangement) => (
                      <div
                        key={arrangement.id}
                        className={`cursor-pointer p-2 rounded-lg border-2 ${field.value === arrangement.id
                          ? "border-primary"
                          : "border-transparent"
                          }`}
                        onClick={() => field.onChange(arrangement.id)}
                      >
                        <img
                          src={arrangement.image}
                          alt={arrangement.name}
                          className="w-full h-24 object-cover rounded"
                        />
                        <p className="text-sm font-medium mt-2">{arrangement.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {arrangement.description}
                        </p>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="menuSelection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Menu Selection</FormLabel>
                  <div className="space-y-6">
                    {menuOptions.map((menuType) => (
                      <div key={menuType.type} className="space-y-4">
                        <h4 className="font-medium text-lg">{menuType.type}</h4>
                        {menuType.items.map((item) => (
                          <div key={item.name} className="space-y-2">
                            <div className="flex items-start space-x-2">
                              <Checkbox
                                checked={field.value.includes(item.name)}
                                onCheckedChange={(checked) => {
                                  const updatedSelection = checked
                                    ? [...field.value, item.name]
                                    : field.value.filter((i) => i !== item.name);
                                  field.onChange(updatedSelection);
                                }}
                              />
                              <div className="flex-1">
                                <div className="flex justify-between items-center">
                                  <label className="text-sm font-medium">{item.name}</label>
                                  <span className="text-sm text-muted-foreground">{item.price}</span>
                                </div>
                                {!item.isBuffet && item.items && (
                                  <ul className="mt-2 text-sm text-muted-foreground list-disc pl-5">
                                    {item.items.map((menuItem) => (
                                      <li key={menuItem}>{menuItem}</li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="border rounded-lg p-4 space-y-2 bg-muted/50">
              <h3 className="font-semibold">Cost Breakdown</h3>
              {form.watch() && (
                <>
                  {(() => {
                    const costs = calculateTotalCost(form.getValues());
                    return (
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Venue Cost:</span>
                          <span>${costs.hallCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Food Cost:</span>
                          <span>${costs.foodCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Beverage Cost:</span>
                          <span>${costs.beverageCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t pt-1">
                          <span>Total Cost:</span>
                          <span>${costs.total.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })()}
                </>
              )}
            </div>
            <Button type="submit">Create Event</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateEventDialog;
