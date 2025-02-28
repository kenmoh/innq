'use client'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface StockHistory {
  date: string;
  quantity: number;
}

interface InventoryItem {
  id: number;
  item: string;
  quantity: number;
  minQuantity: number;
  stockHistory: StockHistory[];
}

export default function Inventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: 1,
      item: "Burger Buns",
      quantity: 100,
      minQuantity: 20,
      stockHistory: [
        { date: "2024-03-20", quantity: 50 },
        { date: "2024-03-15", quantity: 50 }
      ]
    },
    {
      id: 2,
      item: "Beef Patties",
      quantity: 150,
      minQuantity: 30,
      stockHistory: [
        { date: "2024-03-19", quantity: 75 },
        { date: "2024-03-14", quantity: 75 }
      ]
    },
    {
      id: 3,
      item: "Cheese Slices",
      quantity: 200,
      minQuantity: 40,
      stockHistory: [
        { date: "2024-03-18", quantity: 100 },
        { date: "2024-03-13", quantity: 100 }
      ]
    },
  ]);
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [newStock, setNewStock] = useState("");
  const { toast } = useToast();
  const [selectedItemDetails, setSelectedItemDetails] = useState<InventoryItem | null>(null);

  const handleAddStock = () => {
    if (selectedItem && newStock) {
      const currentDate = new Date().toISOString().split('T')[0];
      setInventory(inventory.map(item => {
        if (item.id === selectedItem) {
          return {
            ...item,
            quantity: item.quantity + parseInt(newStock),
            stockHistory: [
              { date: currentDate, quantity: parseInt(newStock) },
              ...item.stockHistory
            ]
          };
        }
        return item;
      }));
      toast({
        title: "Stock Updated",
        description: `Added ${newStock} units to inventory`,
      });
      setIsAddStockOpen(false);
      setNewStock("");
      setSelectedItem(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <Button onClick={() => setIsAddStockOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Stock
        </Button>
      </div>

      <Dialog open={isAddStockOpen} onOpenChange={setIsAddStockOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Stock</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <select
              className="w-full p-2 rounded-md bg-background border border-input text-foreground"
              value={selectedItem || ""}
              onChange={(e) => setSelectedItem(parseInt(e.target.value))}
            >
              <option value="">Select Item</option>
              {inventory.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.item}
                </option>
              ))}
            </select>
            <Input
              type="number"
              placeholder="Enter quantity"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              className="bg-background text-foreground"
            />
            <Button onClick={handleAddStock}>Add Stock</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Sheet open={!!selectedItemDetails} onOpenChange={() => setSelectedItemDetails(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{selectedItemDetails?.item} Details</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Current Stock</h3>
                <p className="text-2xl font-bold">{selectedItemDetails?.quantity}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Minimum Stock Level</h3>
                <p className="text-2xl font-bold">{selectedItemDetails?.minQuantity}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Stock History</h3>
                <div className="space-y-2">
                  {selectedItemDetails?.stockHistory.map((history, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-secondary/10 rounded-md">
                      <span>{history.date}</span>
                      <span>+{history.quantity} units</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="rounded-md ">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Reorder Level</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item) => (
              <TableRow
                key={item.id}
                className="cursor-pointer"
                onClick={() => setSelectedItemDetails(item)}
              >
                <TableCell>{item.item}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.minQuantity}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-sm ${item.quantity <= item.minQuantity ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                    {item.quantity <= item.minQuantity ? 'Low Stock' : 'In Stock'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}