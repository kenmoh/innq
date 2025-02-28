import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Utensils, QrCode, Clock, Users, Calendar, Bug, Coins, DollarSign, Clock1 } from "lucide-react";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";
import Link from "next/link";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen bg-background relative overflow-hidden">


            <header className="glass-card p-6 flex justify-between items-center backdrop-blur-xl relative z-10">
                <Link href='/' className="text-2xl font-semibold">
                    InnQ
                </Link>
                <div className="flex gap-4">
                    <Button variant="ghost" asChild>
                        <Link href="/auth/login">Login</Link>
                    </Button>
                    <Button className="bg-purple-600 hover:bg-purple-700" asChild>
                        <Link href="/auth/register">Register</Link>
                    </Button>
                </div>
            </header>

            <main className="container mx-auto relative z-10 ">
                {children}

            </main>

            {/* <Footer /> */}
        </div>
    );
};



export default AuthLayout;