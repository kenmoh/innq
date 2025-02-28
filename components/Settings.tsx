'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Settings() {
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState({
    key: "",
    secret: "",
    gateway: "flutterwave",
  });

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Password Updated",
      description: "Your password has been successfully updated.",
    });
  };

  const handleApiKeysUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "API Keys Updated",
      description: "Your API keys have been successfully updated.",
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid w-full max-w-xl gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <Input id="name" placeholder="Your name" defaultValue="John Doe" />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input id="email" type="email" placeholder="Your email" defaultValue="john@example.com" />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">Phone</label>
              <Input id="phone" placeholder="Your phone number" defaultValue="+1 234 567 890" />
            </div>

            <Button>Save Changes</Button>
          </div>
        </TabsContent>

        <TabsContent value="restaurant" className="space-y-6">
          <div className="grid w-full max-w-xl gap-4">
            <div className="space-y-2">
              <label htmlFor="restaurant-name" className="text-sm font-medium">Restaurant Name</label>
              <Input id="restaurant-name" placeholder="Restaurant name" defaultValue="The Good Food" />
            </div>

            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">Address</label>
              <Input id="address" placeholder="Restaurant address" defaultValue="123 Food Street" />
            </div>

            <div className="space-y-2">
              <label htmlFor="opening-hours" className="text-sm font-medium">Opening Hours</label>
              <Input id="opening-hours" placeholder="Opening hours" defaultValue="9:00 AM - 10:00 PM" />
            </div>

            <Button>Update Restaurant Info</Button>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <form onSubmit={handlePasswordUpdate} className="grid w-full max-w-xl gap-4">
            <div className="space-y-2">
              <label htmlFor="current-password" className="text-sm font-medium">Current Password</label>
              <Input id="current-password" type="password" placeholder="Enter current password" />
            </div>

            <div className="space-y-2">
              <label htmlFor="new-password" className="text-sm font-medium">New Password</label>
              <Input id="new-password" type="password" placeholder="Enter new password" />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-sm font-medium">Confirm New Password</label>
              <Input id="confirm-password" type="password" placeholder="Confirm new password" />
            </div>

            <Button type="submit">Update Password</Button>
          </form>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <form onSubmit={handleApiKeysUpdate} className="grid w-full max-w-xl gap-4">
            <div className="space-y-2">
              <label htmlFor="payment-gateway" className="text-sm font-medium">Payment Gateway</label>
              <Select
                onValueChange={(value) => setApiKeys({ ...apiKeys, gateway: value })}
                defaultValue={apiKeys.gateway}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment gateway" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flutterwave">Flutterwave</SelectItem>
                  <SelectItem value="paystack">PayStack</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="api-key" className="text-sm font-medium">API Key</label>
              <Input
                id="api-key"
                placeholder="Enter API key"
                value={apiKeys.key}
                onChange={(e) => setApiKeys({ ...apiKeys, key: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="api-secret" className="text-sm font-medium">API Secret</label>
              <Input
                id="api-secret"
                placeholder="Enter API secret"
                value={apiKeys.secret}
                onChange={(e) => setApiKeys({ ...apiKeys, secret: e.target.value })}
              />
            </div>

            <Button type="submit">Update API Keys</Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
