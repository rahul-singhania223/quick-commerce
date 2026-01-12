"use client";

import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { authFormSchema } from "@/schema/auth.schema";
import { Loader2 } from "lucide-react";
import { getOTP } from "@/quries/auth.query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ErrorResponse, SuccessResponse } from "@/types/types";

const AuthForm = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof authFormSchema>>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      phone: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof authFormSchema>) => {
    try {
      return
      const res = await getOTP(data);
      const resData = res.data as SuccessResponse;

      const session_id = resData.data.session_id;
      const phone = resData.data.phone;
      if (!session_id || !phone)
        return toast.error("SERVER_ERROR", {
          description: "Server did not return session id",
        });

      return router.push(
        `/auth/verify-otp?session_id=${session_id}&phone=${phone}`
      );
    } catch (error) {
      const errorData = error as ErrorResponse;
      return toast.error(errorData.message);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-md mx-auto flex-[0.55] w-full"
      >
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="h-16 lg:h-13 w-full bg-white border rounded-2xl px-3.5 text-lg lg:text-base flex items-center">
                  <span className="text-lg font-semibold text-[#374151]">
                    +91
                  </span>
                  <span className="w-px h-6 bg-[#E5E7EB] mx-2.5"></span>
                  <input
                    type="tel"
                    className="flex-1 h-full focus:outline-0 text-lg lg:text-lg"
                    placeholder="Eg. 9939878713"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-[#EF4444] text-base lg:text-[12px] mt-1.5" />
            </FormItem>
          )}
        />

        <Button
          disabled={form.formState.isSubmitting || form.formState.isLoading}
          className="h-16 text-lg lg:text-base lg:h-13 w-full rounded-2xl text-white mt-6 cursor-pointer transition-all active:scale-95 z-100"
        >
          {form.formState.isSubmitting && (
            <Loader2 className="w-5! h-5! lg:w-4! lg:h-4! animate-spin" />
          )}
          Login/Register
        </Button>
        <p className="text-sm lg:text-xs text-body/70 text-center mt-6">
          By continuing, you agree to our{" "}
          <Link href={"#"} className="text-blue-500 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href={"#"} className="text-blue-500 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default AuthForm;
