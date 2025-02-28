import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useState } from "react";

interface NewIssue {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  location: string;
}

interface CreateIssueDialogProps {
  onCreateIssue: (issue: NewIssue) => void;
}

export function CreateIssueDialog({ onCreateIssue }: CreateIssueDialogProps) {
  const [newIssue, setNewIssue] = useState<NewIssue>({
    title: "",
    description: "",
    priority: "medium",
    location: "",
  });

  const handleSubmit = () => {
    onCreateIssue(newIssue);
    setNewIssue({
      title: "",
      description: "",
      priority: "medium",
      location: "",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Report Issue
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report New Issue</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Issue title"
            value={newIssue.title}
            onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
          />
          <Textarea
            placeholder="Describe the issue"
            value={newIssue.description}
            onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
          />
          <Input
            placeholder="Location (Room number or area)"
            value={newIssue.location}
            onChange={(e) => setNewIssue({ ...newIssue, location: e.target.value })}
          />
          <Select
            value={newIssue.priority}
            onValueChange={(value: "low" | "medium" | "high") =>
              setNewIssue({ ...newIssue, priority: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSubmit} className="w-full">
            Create Issue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}