'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScanLine } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Staff {
  id: string;
  name: string;
  role: string;
}

interface StaffScannerProps {
  onScan: (staffId: string) => void;
  staff: Staff[];
}

export function StaffScanner({ onScan, staff }: StaffScannerProps) {
  const [selectedStaff, setSelectedStaff] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStaff) {
      toast({
        title: "Error",
        description: "Please select a staff member",
        variant: "destructive",
      });
      return;
    }

    // In a real app, we would verify the PIN against user credentials
    // For demo purposes, we're allowing any PIN
    if (pin.length < 4) {
      toast({
        title: "Error",
        description: "Please enter a valid PIN (at least 4 digits)",
        variant: "destructive",
      });
      return;
    }

    onScan(selectedStaff);
    setPin("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="staff-select" className="block text-sm font-medium mb-1">
          Select Staff
        </label>
        <Select value={selectedStaff} onValueChange={setSelectedStaff}>
          <SelectTrigger id="staff-select">
            <SelectValue placeholder="Select staff member" />
          </SelectTrigger>
          <SelectContent>
            {staff.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.name} - {member.role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="pin" className="block text-sm font-medium mb-1">
          Enter PIN
        </label>
        <Input
          id="pin"
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="Enter your PIN"
          maxLength={6}
        />
      </div>

      <Button type="submit" className="w-full">
        <ScanLine className="mr-2 h-4 w-4" />
        Scan Attendance
      </Button>

      <div className="text-xs text-muted-foreground text-center mt-2">
        In a real app, this would use the device camera to scan QR codes.
        For demo purposes, we're using staff selection and PIN.
      </div>
    </form>
  );
}
