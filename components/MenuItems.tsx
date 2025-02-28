'use client'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function MenuItems() {
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: "Margherita Pizza", category: "Pizza", price: "$12.99", status: "Available" },
    { id: 2, name: "Caesar Salad", category: "Salads", price: "$8.99", status: "Available" },
    { id: 3, name: "Spaghetti Carbonara", category: "Pasta", price: "$14.99", status: "Available" },
    { id: 4, name: "Tiramisu", category: "Desserts", price: "$6.99", status: "Out of Stock" },
  ]);

  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    price: "",
  });

  const [editingItem, setEditingItem] = useState<null | typeof menuItems[0]>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddItem = () => {
    if (!newItem.name || !newItem.category || !newItem.price) return;

    const newMenuItem = {
      id: menuItems.length + 1,
      name: newItem.name,
      category: newItem.category,
      price: `$${newItem.price}`,
      status: "Available",
    };

    setMenuItems([...menuItems, newMenuItem]);
    setNewItem({ name: "", category: "", price: "" });
    toast({
      title: "Menu Item Added",
      description: `${newItem.name} has been added to the menu`,
    });
  };

  const handleEditItem = () => {
    if (!editingItem) return;

    setMenuItems(menuItems.map(item =>
      item.id === editingItem.id ? editingItem : item
    ));

    setEditingItem(null);
    setIsEditDialogOpen(false);
    toast({
      title: "Menu Item Updated",
      description: `${editingItem.name} has been updated`,
    });
  };

  const handleDelete = (id: number) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
    toast({
      title: "Menu Item Deleted",
      description: "The menu item has been deleted successfully",
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Menu Items</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Menu Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Item name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              />
              <Select
                value={newItem.category}
                onValueChange={(value) => setNewItem({ ...newItem, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pizza">Pizza</SelectItem>
                  <SelectItem value="Pasta">Pasta</SelectItem>
                  <SelectItem value="Salads">Salads</SelectItem>
                  <SelectItem value="Desserts">Desserts</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Price"
                type="number"
                step="0.01"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              />
              <Button onClick={handleAddItem} className="w-full">
                Add Menu Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Item name"
              value={editingItem?.name || ""}
              onChange={(e) => setEditingItem(prev => prev ? { ...prev, name: e.target.value } : null)}
            />
            <Select
              value={editingItem?.category}
              onValueChange={(value) => setEditingItem(prev => prev ? { ...prev, category: value } : null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pizza">Pizza</SelectItem>
                <SelectItem value="Pasta">Pasta</SelectItem>
                <SelectItem value="Salads">Salads</SelectItem>
                <SelectItem value="Desserts">Desserts</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Price"
              value={editingItem?.price?.replace('$', '') || ""}
              onChange={(e) => setEditingItem(prev => prev ? { ...prev, price: `$${e.target.value}` } : null)}
            />
            <Button onClick={handleEditItem} className="w-full">
              Update Menu Item
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menuItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingItem(item);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}