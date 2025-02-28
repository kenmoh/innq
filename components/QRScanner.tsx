import React from "react";
import { Camera, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";

const QRScanner = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-6">
      <div className="relative w-full max-w-md aspect-square glass-card rounded-lg flex items-center justify-center">
        <Camera className="w-16 h-16 text-primary animate-pulse" />
      </div>
      <p className="text-muted-foreground text-center max-w-md">
        Point your camera at the QR code to access the room service menu
      </p>
      <div className="flex flex-col space-y-4 w-full max-w-md">
        <Button variant="outline" className="glass-card">
          <KeyRound className="mr-2 h-4 w-4" />
          Enter Room Code Manually
        </Button>
      </div>
    </div>
  );
};

export default QRScanner;