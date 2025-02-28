'use client'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, QrCode, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function QRCode() {
    const [qrCodes, setQrCodes] = useState([
        { id: 1, name: "Table 1", type: "restaurant", scans: 245, lastScan: "2024-01-05", status: "Active" },
        { id: 2, name: "Table 2", type: "restaurant", scans: 189, lastScan: "2024-01-05", status: "Active" },
        { id: 3, name: "Room 101", type: "room", scans: 567, lastScan: "2024-01-05", status: "Active" },
        { id: 4, name: "Room 102", type: "room", scans: 123, lastScan: "2024-01-04", status: "Inactive" },
    ]);
    const [newQRName, setNewQRName] = useState("");
    const [newQRType, setNewQRType] = useState<"room" | "restaurant">("restaurant");
    const { toast } = useToast();

    const handleGenerateQR = () => {
        if (!newQRName || !newQRType) return;

        const newQR = {
            id: qrCodes.length + 1,
            name: newQRName,
            type: newQRType,
            scans: 0,
            lastScan: "Never",
            status: "Active"
        };

        setQrCodes([...qrCodes, newQR]);
        setNewQRName("");
        setNewQRType("restaurant");
        toast({
            title: "QR Code Generated",
            description: `New QR code created for ${newQRName}`,
        });
    };

    const handleDelete = (id: number) => {
        setQrCodes(qrCodes.filter(code => code.id !== id));
        toast({
            title: "QR Code Deleted",
            description: "The QR code has been deleted successfully",
        });
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">QR Codes</h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Generate New QR Code
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Generate New QR Code</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <Select
                                value={newQRType}
                                onValueChange={(value: "room" | "restaurant") => setNewQRType(value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="room">Room</SelectItem>
                                    <SelectItem value="restaurant">Restaurant</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input
                                placeholder={newQRType === "room" ? "Enter room number" : "Enter table name"}
                                value={newQRName}
                                onChange={(e) => setNewQRName(e.target.value)}
                            />
                            <div className="flex justify-end">
                                {newQRName && (
                                    <QrCode

                                        size={50}
                                    />
                                )}
                            </div>
                            <Button onClick={handleGenerateQR} className="w-full">
                                Generate
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Total Scans</TableHead>
                            <TableHead>Last Scan</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>QR Code</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {qrCodes.map((code) => (
                            <TableRow key={code.id}>
                                <TableCell className="font-medium">{code.name}</TableCell>
                                <TableCell className="capitalize">{code.type}</TableCell>
                                <TableCell>{code.scans}</TableCell>
                                <TableCell>{code.lastScan}</TableCell>
                                <TableCell>{code.status}</TableCell>
                                <TableCell>
                                    <QrCode
                                        size={50}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(code.id)}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}