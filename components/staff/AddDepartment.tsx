'use client'
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { createDepartment } from "@/app/actions/authActions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader } from "lucide-react";

interface AddDepartmentRoleDialog {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;

}

const DepartmentSchema = z.object({
    name: z.string().min(1, 'Department name is required!'),

});

type RoleValue = z.infer<typeof DepartmentSchema>;


export function AddDepartmentDialog({ isOpen, onOpenChange }: AddDepartmentRoleDialog) {
    const router = useRouter()
    const [state, action, isPending] = React.useActionState(createDepartment, undefined)

    const form = useForm<RoleValue>({
        resolver: zodResolver(DepartmentSchema),
        defaultValues: {
            name: "",

        },
    });
    if (state?.success) {
        router.push('/dashboard/staff')
        toast(state.message)
    }

    if (!state?.success) {
        toast(state?.message)
    }
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Department</DialogTitle>
                    <DialogDescription>
                        Fill in the details to add a new department role.
                        {!state?.success && <p className="text-red-300 text-sm">{state?.message}</p>}
                    </DialogDescription>

                </DialogHeader>
                <div className="space-y-4 py-2">
                    <Form {...form} >
                        <form className="space-y-5" action={action} >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Department Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Name" {...field} />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            <Button disabled={isPending} type="submit" className="w-full my-10">
                                {isPending ? <Loader /> : ' Submit'}

                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}


