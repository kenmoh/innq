'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const salesData = [
    { date: "Mon", sales: 4000, orders: 24, customers: 18 },
    { date: "Tue", sales: 3000, orders: 18, customers: 15 },
    { date: "Wed", sales: 2000, orders: 12, customers: 10 },
    { date: "Thu", sales: 2780, orders: 16, customers: 12 },
    { date: "Fri", sales: 1890, orders: 11, customers: 8 },
    { date: "Sat", sales: 2390, orders: 14, customers: 11 },
    { date: "Sun", sales: 3490, orders: 21, customers: 16 },
];

const categoryData = [
    { name: "Main Course", value: 400 },
    { name: "Appetizers", value: 300 },
    { name: "Desserts", value: 200 },
    { name: "Beverages", value: 150 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Analytics() {
    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold">Analytics</h2>
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Weekly Sales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={salesData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="sales" stroke="#8b5cf6" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Orders & Customers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={salesData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="orders" fill="#ec4899" />
                                    <Bar dataKey="customers" fill="#06b6d4" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Sales by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Key Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Average Order Value</p>
                                <p className="text-2xl font-bold">₦45.80</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Customer Retention</p>
                                <p className="text-2xl font-bold">68%</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Table Turnover Rate</p>
                                <p className="text-2xl font-bold">1.8h</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Staff Efficiency</p>
                                <p className="text-2xl font-bold">92%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}