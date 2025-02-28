import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Issue {
  id: number;
  title: string;
  description: string;
  status: "open" | "in-progress" | "resolved";
  priority: "low" | "medium" | "high";
  location: string;
  createdAt: string;
}

interface IssueCardProps {
  issue: Issue;
  onUpdateStatus: (issueId: number, newStatus: Issue["status"]) => void;
}

export function IssueCard({ issue, onUpdateStatus }: IssueCardProps) {
  const getPriorityColor = (priority: Issue["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusBadge = (status: Issue["status"]) => {
    switch (status) {
      case "open":
        return <Badge variant="destructive">Open</Badge>;
      case "in-progress":
        return <Badge variant="default">In Progress</Badge>;
      case "resolved":
        return <Badge variant="secondary">Resolved</Badge>;
    }
  };

  return (
    <Card className="shadow-none rounded-md border-[0.25px]">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">{issue.title}</CardTitle>
            <CardDescription>{issue.location}</CardDescription>
          </div>
          <div
            className={`w-3 h-3 rounded-full ${getPriorityColor(
              issue.priority
            )}`}
          />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {issue.description}
        </p>
        <div className="flex items-center justify-between cursor-pointer">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {getStatusBadge(issue.status)}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onUpdateStatus(issue.id, "open")}>
                Open
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdateStatus(issue.id, "in-progress")}>
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdateStatus(issue.id, "resolved")}>
                Resolved
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <span className="text-xs text-muted-foreground">
            {issue.createdAt}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}