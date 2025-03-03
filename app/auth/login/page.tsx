'use client'
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser } from "@/app/actions/authActions";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Loader } from "lucide-react";


export const LoginSchema = z.object({
  username: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});



type LoginValues = z.infer<typeof LoginSchema>;

export default function Login() {
  const router = useRouter()
  const [state, action, isPending] = useActionState(loginUser, undefined)

  const form = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",

    },
  });


  // Form submission handler
  // const onSubmit = async (data: z.output<typeof LoginSchema>) => {

  //   const formData = new FormData()

  //   formData.append('username', data.username)
  //   formData.append('password', data.password)
  //   const result = await loginUser(formData)

  //   if (result?.success) {
  //     router.push('/dashboard')
  //   } else {
  //     setMessage(result?.message)
  //   }

  // };

  if (state?.success) {
    router.push('/dashboard')
    toast(state.message)
  }

  if (!state?.success) {
    toast(state?.message)
  }

  return (
    <div className="max-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-1/4 max-w-md rounded-sm shadow-none p-6 glass-card animate-fade-in">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tighter">Welcome back</h1>
            <p className="text-muted-foreground text-[12px]">
              Enter your credentials to access your account
            </p>
          </div>
          {!state?.success && <p className="text-red-300 text-sm text-center">{state?.message}</p>}
          <Form {...form} >
            <form className="space-y-5" action={action} >
              <FormField
                control={form.control}
                name="username"
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

              <Button disabled={isPending} type="submit" className="w-full my-10 text-white bg-blue-800 hover:bg-blue-500">
                {isPending ? <Loader /> : ' Login'}

              </Button>
            </form>
          </Form>


          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="text-primary hover:text-primary/90 underline-offset-4 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}