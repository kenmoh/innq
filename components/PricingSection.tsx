'use client'
import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

const PricingSection = () => {
  const plans = [
    {
      name: "Basic",
      price: "$229",
      description: "Perfect for small hotels and restaurants",
      features: [
        "Up to 50 QR codes",
        "Basic analytics",
        "Email support",
        "Restaurant Reservation",
        "70 staff member",
      ],
      gradient: "from-purple-400/20 to-pink-400/20",
      buttonVariant: "outline" as const,
    },
    {
      name: "Pro",
      price: "$799",
      description: "Ideal for growing businesses",
      features: [
        "Unlimited QR codes",
        "Event Booking",
        "Advanced analytics",
        "Priority support",
        "Up to 150 staff members",
        "Inventory management",
        "Custom branding",
      ],
      gradient: "from-purple-900 to-pink-900",
      buttonVariant: "default" as const,
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$999",
      description: "For large-scale operations",
      features: [
        "Everything in Pro",
        "24/7 phone support",
        "Unlimited staff members",
        "Staff Attendance",
        "Payroll Generation"

      ],
      gradient: "from-purple-400/20 to-pink-400/20",
      buttonVariant: "outline" as const,
    },
  ];

  return (
    <section className="px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold ">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Choose the perfect plan for your business. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative p-8 rounded-xl border border-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105 ${plan.popular ? "ring-2 ring-purple-500" : ""
                } bg-gradient-to-b ${plan.gradient}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 ">
                  <span className="bg-purple-600 text-white px-12 py-5 rounded-full text-sm font-bold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <div>
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    <p className="text-gray-300 mt-2 min-h-[48px]">
                      {plan.description}
                    </p>
                  </div>

                  <div className="flex items-baseline">
                    <span className="text-4xl text-white font-bold">{plan.price}</span>
                    <span className="text-white ml-2">/month</span>
                  </div>

                  <ul className="space-y-3 text-white">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-purple-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  variant={plan.buttonVariant}
                  className="w-full"
                  size="lg"
                  asChild
                >
                  <Link href={'/auth/register'}>
                    Get Started
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
        </div>
      </div>
    </section>
  );
};

export default PricingSection;