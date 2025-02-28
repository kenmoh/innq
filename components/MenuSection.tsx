import React from "react";
import { Coffee, UtensilsCrossed, CakeSlice } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    category: "Beverages",
    icon: Coffee,
    items: [
      {
        name: "Freshly Brewed Coffee",
        description: "Premium Arabica blend",
        price: "$6",
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=300",
      },
    ],
  },
  {
    category: "Main Courses",
    icon: UtensilsCrossed,
    items: [
      {
        name: "Grilled Salmon",
        description: "With seasonal vegetables",
        price: "$32",
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=300",
      },
    ],
  },
  {
    category: "Desserts",
    icon: CakeSlice,
    items: [
      {
        name: "Chocolate Fondant",
        description: "With vanilla ice cream",
        price: "$14",
        image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&q=80&w=300",
      },
    ],
  },
];

const MenuSection = () => {
  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center space-x-4 overflow-x-auto pb-4">
        {menuItems.map((category) => (
          <Button
            key={category.category}
            variant="ghost"
            className="flex-shrink-0 glass-card"
          >
            <category.icon className="mr-2 h-4 w-4" />
            {category.category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {menuItems.map((category) =>
          category.items.map((item) => (
            <Card key={item.name} className="glass-card menu-item overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-primary font-semibold">{item.price}</span>
                  <Button size="sm">Add to Order</Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MenuSection;