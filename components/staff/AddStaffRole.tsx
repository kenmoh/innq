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
import { createUserType } from "@/app/actions/authActions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader } from "lucide-react";

interface AddStaffRoleDialog {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;

}

const RoleSchema = z.object({
    name: z.string().min(1, 'Role name is required!'),

});

type RoleValue = z.infer<typeof RoleSchema>;


export function AddStaffRoletDialog({ isOpen, onOpenChange }: AddStaffRoleDialog) {
    const router = useRouter()
    const [state, action, isPending] = React.useActionState(createUserType, undefined)

    const form = useForm<RoleValue>({
        resolver: zodResolver(RoleSchema),
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
                    <DialogTitle>Add New Role</DialogTitle>
                    <DialogDescription>
                        Fill in the details to add a new staff role.
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
                                        <FormLabel>Role Name</FormLabel>
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


