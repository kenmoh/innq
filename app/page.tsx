import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Utensils, QrCode, Clock, Users, Calendar, DollarSign, TriangleAlert, Menu } from "lucide-react";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";
import Link from "next/link";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#09090B] relative overflow-hidden text-white">
      {/* Glowing background effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-background to-background" />

        {/* Centered animated glowing orbs */}
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[128px] animate-pulse" />
        <div className="absolute top-[60%] left-1/3 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-pink-600/20 blur-[96px] animate-pulse delay-700" />
        <div className="absolute top-[50%] right-1/3 translate-x-1/2 w-[550px] h-[550px] rounded-full bg-blue-600/20 blur-[160px] animate-pulse delay-1000" />
      </div>

      <header className="glass-card p-6 flex justify-between items-center backdrop-blur-xl bg-black/10 relative z-10">
        <Link href='/' className="text-4xl font-semibold text-white">
          MOHospitality
        </Link>
        <div className="flex gap-4">
          <Button variant="ghost" asChild className="text-white">
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700" asChild>
            <Link href="/auth/register">Register</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-20 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold leading-tight max-w-5xl ">
            Redefining Hospitality: Digital Ordering, Staff Management & More
          </h2>
          <p className="text-md text-muted-foreground max-w-3xl">
            Redefining hospitality through seamless digital solutions. From QR code ordering to comprehensive staff management, our platform enhances guest satisfaction while optimizing your entire operational workflow.
          </p>
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/20" asChild>
            <Link href="/register">
              Start Your Free Trial <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>

        <div className="relative mt-20">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-blue-700/50 blur-[120px] animate-none" />

          <div className="relative z-10 grid md:grid-cols-3 gap-8 ">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass-card p-8 rounded-lg space-y-4 transform transition-all duration-300 hover:scale-105 backdrop-blur-xl bg-black/10"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-gray-100">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-32">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-blue-800 blur-[120px] animate-none" />

          <div className="relative z-10">
            <PricingSection />
          </div>
        </div>

        <div className="mt-32 text-center">
          <h3 className="text-3xl font-bold mb-8 ">
            Ready to Transform Your Business?
          </h3>
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/20" asChild>
            <Link href="/auth/register">
              Get Started Today <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const features = [
  {
    title: "QR Code Generation",
    description: "Generate unique QR codes for each room or table instantly. Track orders and manage service efficiently.",
    icon: QrCode,
  },
  {
    title: "Event Booking",
    description: "Manage and schedule events seamlessly. From small gatherings to large conferences, handle bookings with ease.",
    icon: Calendar,
  },
  {
    title: "Issue Tracking",
    description: "Track and resolve maintenance issues and customer requests promptly. Keep your service quality high.",
    icon: TriangleAlert,
  },
  {
    title: "Staff Management",
    description: "Manage your team with role-based access control. Assign tasks and monitor performance.",
    icon: Users,
  },
  {
    title: "Real-time Orders",
    description: "Track and manage orders in real-time across your property. Never miss a guest request.",
    icon: Clock,
  },
  {
    title: "Menu Management",
    description: "Update and customize your menu offerings easily. Keep your menu fresh and exciting.",
    icon: Menu,
  },
  {
    title: "Staff Attendance",
    description: "Track employee check-ins and check-outs with our digital attendance system. Monitor work hours and generate attendance reports effortlessly.",
    icon: Clock,
  },
  {
    title: "Payroll",
    description: "Streamline payroll processing with automated calculations based on attendance data. Manage salaries, bonuses, and deductions in one place.",
    icon: DollarSign,
  },
  {
    title: "Restaurant Reservations",
    description: "Efficiently manage table reservations and optimize seating capacity. Send automated confirmations and reminders to enhance the guest experience.",
    icon: Utensils,
  },
];

export default Home;