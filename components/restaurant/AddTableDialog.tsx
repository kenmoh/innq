import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface AddTableDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTable: (tableName: string, tableCapacity: string) => void;
}

export function AddTableDialog({ isOpen, onOpenChange, onAddTable }: AddTableDialogProps) {
  const [newTableName, setNewTableName] = useState("");
  const [newTableCapacity, setNewTableCapacity] = useState("");
  const { toast } = useToast();

  const handleAddTable = () => {
    if (!newTableName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a table name",
        variant: "destructive",
      })
      if (!newTableCapacity) {
        toast({
          title: "Error",
          description: "Please enter a table capacity",
          variant: "destructive",
        });
        return;
      }
    }

    onAddTable(newTableName, newTableCapacity);
    setNewTableName("");
    setNewTableCapacity("")
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Table</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Table name"
            value={newTableName}
            onChange={(e) => setNewTableName(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Table Capacity"
            value={newTableCapacity}
            onChange={(e) => setNewTableCapacity(e.target.value)}
          />
          <Button onClick={handleAddTable} className="w-full">
            Add Table
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}