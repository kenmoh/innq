import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { useToast } from "@/hooks/use-toast";

interface AddWaiterDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddWaiter: (waiter: { name: string; shift: string; tables: string[] }) => void;
  tables: string[];
}

export function AddWaiterDialog({ isOpen, onOpenChange, onAddWaiter, tables = [] }: AddWaiterDialogProps) {
  const [newWaiter, setNewWaiter] = React.useState({
    name: "",
    shift: "Morning",
    tables: [] as string[],
  });
  const { toast } = useToast();

  const handleAddWaiter = () => {
    if (!newWaiter.name || !newWaiter.shift) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    onAddWaiter(newWaiter);
    setNewWaiter({ name: "", shift: "Morning", tables: [] });
    onOpenChange(false);
  };

  const handleTableSelection = (selected: string[]) => {
    setNewWaiter(prev => ({ ...prev, tables: selected }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] z-50">
        <DialogHeader>
          <DialogTitle>Add New Waiter</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Waiter name"
            value={newWaiter.name}
            onChange={(e) => setNewWaiter(prev => ({ ...prev, name: e.target.value }))}
          />
          <Select
            value={newWaiter.shift}
            onValueChange={(value) => setNewWaiter(prev => ({ ...prev, shift: value }))}
          >
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="Select shift" />
            </SelectTrigger>
            <SelectContent className="z-[60] bg-background">
              <SelectItem value="Morning">Morning</SelectItem>
              <SelectItem value="Evening">Evening</SelectItem>
              <SelectItem value="Night">Night</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative">
            <MultiSelect
              options={tables}
              selected={newWaiter.tables}
              onChange={handleTableSelection}
              placeholder="Select tables"
            />
          </div>
          <Button onClick={handleAddWaiter} className="w-full">
            Add Waiter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}