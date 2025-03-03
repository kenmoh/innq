'use client'
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { registerCompanyUser } from "@/app/actions/authActions";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { toast } from "sonner";


const RegisterSchema = z
  .object({
    email: z.string().trim().email("Invalid email address"),
    password: z.string().trim().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().trim().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match.",
    path: ["confirmPassword"],
  });
type RegisterValues = z.infer<typeof RegisterSchema>;


export default function Register() {

  const [state, action, isPending] = useActionState(registerCompanyUser, undefined)
  const router = useRouter()

  const form = useForm<RegisterValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: '',
    },
  });



  // // Form submission handler
  // const onSubmit = async (data: z.output<typeof RegisterSchema>) => {
  //   const formData = new FormData()
  //   formData.append('email', data.email)
  //   formData.append('password', data.password)
  //   formData.append('confirmPassword', data.confirmPassword)
  //   const result = await registerCompanyUser(formData)

  //   if (result.success) {
  //     router.push('/auth/login')
  //   } else {
  //     setMessage(result.message)
  //   }

  // };

  if (state?.success) {
    router.push('/auth/login')
    toast(state.message)
  }
  if (!state?.success) {
    toast(state?.message)
  }




  return (
    <div className="max-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-1/4 max-w-md shadow-none rounded-sm p-6 glass-card animate-fade-in">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tighter">
              Create an account
            </h1>
            <p className="text-muted-foreground text-[12px]">
              Enter your details to create your account
            </p>
          </div>
          <p className="text-red-400 text-sm text-center">{state?.message}</p>

          <Form {...form} >
            <form className="space-y-5" action={action} >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isPending} type="submit" className="w-full my-10 bg-blue-800 hover:bg-blue-500">
                {isPending ? <Loader /> : ' Register'}

              </Button>
            </form>
          </Form>


          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-primary hover:text-primary/90 underline-offset-4 hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}