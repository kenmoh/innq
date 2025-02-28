'use client'
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { IssueCard } from "@/components/issues/IssueCard";
import { CreateIssueDialog } from "@/components/issues/CreateIssueDialog";

interface Issue {
  id: number;
  title: string;
  description: string;
  status: "open" | "in-progress" | "resolved";
  priority: "low" | "medium" | "high";
  location: string;
  createdAt: string;
}

interface NewIssue {
  title: string;
  description: string;
  priority: Issue["priority"];
  location: string;
}

export default function Issues() {
  const [issues, setIssues] = useState<Issue[]>([
    {
      id: 1,
      title: "Broken AC in Room 101",
      description: "The air conditioning unit is not cooling properly",
      status: "open",
      priority: "high",
      location: "Room 101",
      createdAt: "2024-01-05",
    },
    {
      id: 2,
      title: "Table 3 Wobbly",
      description: "Restaurant table needs maintenance",
      status: "in-progress",
      priority: "medium",
      location: "Restaurant",
      createdAt: "2024-01-05",
    },
  ]);

  const { toast } = useToast();

  const handleAddIssue = (newIssue: NewIssue) => {
    if (!newIssue.title || !newIssue.description || !newIssue.location) return;

    const issue: Issue = {
      id: issues.length + 1,
      ...newIssue,
      status: "open",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setIssues([...issues, issue]);
    toast({
      title: "Issue Created",
      description: "New issue has been created successfully",
    });
  };

  const handleUpdateStatus = (issueId: number, newStatus: Issue["status"]) => {
    setIssues(issues.map(issue =>
      issue.id === issueId
        ? { ...issue, status: newStatus }
        : issue
    ));
    toast({
      title: "Status Updated",
      description: `Issue status has been updated to ${newStatus}`,
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Issues</h1>
          <p className="text-muted-foreground">Track and manage maintenance issues and complaints</p>
        </div>
        <CreateIssueDialog onCreateIssue={handleAddIssue} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {issues.map((issue) => (
          <IssueCard
            key={issue.id}
            issue={issue}
            onUpdateStatus={handleUpdateStatus}
          />
        ))}
      </div>
    </div>
  );
}