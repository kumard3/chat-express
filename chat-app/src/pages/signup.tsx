import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, type RouterInputs } from "@/utils/api";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
type CreateUserFrom = RouterInputs["auth"]["register"];

export default function LoginForm() {
  const router = useRouter();
  const session = useSession();

  const { mutate } = api.auth.register.useMutation({
    onSuccess() {
      toast.success("Account created successfully", {
        closeButton: true,
      });
      void router.push("/login");
    },
    onError(error) {
      console.error(error);
      toast.error("Something went wrong", {
        description: error.message,
        closeButton: true,
      });
    },
  });

  const form = useForm<CreateUserFrom>({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  function onSubmit(values: CreateUserFrom) {
    mutate(values);
  }

  useEffect(() => {
    if (session?.status === "authenticated") {
      void router.push("/");
    }
  }, [router, session]);
  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="username">username</Label>

                      <FormControl>
                        <Input
                          id="username"
                          type="text"
                          placeholder="username"
                          required
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="password">Password</Label>

                      <FormControl>
                        <Input id="password" type="password" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Create an account
                </Button>
              </form>
            </Form>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
