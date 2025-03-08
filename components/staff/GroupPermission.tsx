'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Staff, Role, Department, Permission } from "@/types/staff";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface AddStaffDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onAddSPermission: (permissions: Omit<Permission, "id">) => void;

}

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    permissions: z.array(
        z.object({
            resource: z.string(),
            actions: z.array(z.string())
        })
    )
})

const resources = ["Orders", "Inventory", "Stock", "Payment"]
const actions = ["CREATE", "READ", "UPDATE", "DELETE"]

export function GroupPermission({
    isOpen,
    onOpenChange,
    onAddSPermission,

}: AddStaffDialogProps) {

    const { toast } = useToast();



    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            permissions: resources.map(resource => ({
                resource,
                actions: []
            }))
        }
    })

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Group Permissions</DialogTitle>
                    <DialogDescription>
                        Fill in the details to add a new resource permissions.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={() => console.log('first')} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Name" {...field} className="bg-slate-950 border-slate-800" />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="space-y-4">
                            <h3 className="text-sm font-medium">Resource Permissions</h3>

                            {resources.map((resource, resourceIndex) => (
                                <div key={resource} className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                                    <h4 className="mb-3">{resource}</h4>
                                    <div className="flex gap-4 justify-between">
                                        {actions.map(action => (
                                            <FormField
                                                key={`${resource}-${action}`}
                                                control={form.control}
                                                name={`permissions.${resourceIndex}.actions`}
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center space-x-2">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value.includes(action)}
                                                                onCheckedChange={(checked) => {
                                                                    if (checked) {
                                                                        field.onChange([...field.value, action])
                                                                    } else {
                                                                        field.onChange(field.value.filter(a => a !== action))
                                                                    }
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="text-sm font-normal">{action}</FormLabel>
                                                    </FormItem>
                                                )}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Processing..." : "Add Permissions"}
                        </Button>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    );
}









