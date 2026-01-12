"use client";

import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { getOTP, getOTPMetaData, verifyOTP } from "@/quries/auth.query";
import { ErrorResponse, SuccessResponse, OtpMeta } from "@/types/types";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Message from "./message";
import PageLoader from "@/components/page-loader";

interface Props {
  session_id: string | undefined;
  phone: string | undefined;
}


export default function OTPForm({ session_id, phone }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [resending, setResending] = useState(false);
  const [otpMeta, setOtpMeta] = useState<OtpMeta | null>(null);
  const [globalError, setGlobalError] = useState<null | string>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  console.log(session_id, phone)


  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!otpMeta) return;
    if (isSubmitting) return;
    if (!phone) return setError("Phone number is required!");
    if (otp.length === 0) return setError("OTP is required!");
    if (otp.length !== 6) return setError("Invalid OTP!");

    try {
      setIsSubmitting(true);
      const res = await verifyOTP({
        OTP: otp,
        phone: otpMeta.phone,
        session_id: otpMeta.session_id,
      });
      return router.push("/store");
    } catch (error) {
      const errorData = error as ErrorResponse;
      setError(errorData.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendOTP = async () => {
    if (resending) return;
    if (timeLeft > 0) return;
    if (!phone) return setError("Phone number is required!");
    try {
      setResending(true);
      const res = await getOTP({ phone });
      return router.refresh();
    } catch (error) {
      const errorData = error as ErrorResponse;
      setError(errorData.message);
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    const getOtpMeta = async () => {
      try {
        setLoading(true);
        if (!session_id || !phone)
          return setGlobalError("Session ID & Phone are required!");

        const res = await getOTPMetaData({ session_id, phone });
        const resData = res.data as SuccessResponse;
        setOtpMeta(resData.data as OtpMeta);
      } catch (error) {
        const errorData = error as ErrorResponse;
        setGlobalError(errorData.message);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getOtpMeta();
  }, [session_id, phone]);

  useEffect(() => {
    if (!otpMeta) return;

    const tick = () => {
      const nowMs = Date.now();
      const remainingMs = otpMeta.resend_at - nowMs;

      const remainingSec = Math.max(Math.ceil(remainingMs / 1000), 0);

      setTimeLeft(remainingSec);
    };

    // run immediately
    tick();

    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, [otpMeta]);

  if (loading) return <PageLoader />;

  if (globalError)
    return (
      <div className="w-full flex flex-col space-y-5 items-center justify-center max-w-md">
        <h2 className="text-xl font-semibold text-red-500">{globalError}</h2>
        <Button
          type="button"
          onClick={() => router.push("/auth")}
          className="h-16 text-lg lg:text-base lg:h-13 w-full rounded-2xl text-white mt-6 cursor-pointer transition-all active:scale-95 z-100"
        >
          Get New OTP
        </Button>
      </div>
    );

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <Message />

      <form
        onSubmit={onSubmit}
        className="max-w-md mx-auto flex flex-col items-center w-full"
      >
        <InputOTP
          value={otp}
          onChange={(val) => setOtp(val)}
          maxLength={6}
          className="flex! items-center w-full! justify-between!"
        >
          <InputOTPSlot
            index={0}
            className="bg-white text-xl font-semibold h-16 w-16 shadow-none rounded-xl!"
          />
          <InputOTPSlot
            index={1}
            className="bg-white text-xl font-semibold  h-16 w-16 shadow-none rounded-xl!"
          />
          <InputOTPSlot
            index={2}
            className="bg-white text-xl font-semibold  h-16 w-16 shadow-none rounded-xl!"
          />

          <InputOTPSlot
            index={3}
            className="bg-white text-xl font-semibold  h-16 w-16 shadow-none rounded-xl!"
          />
        </InputOTP>
        <Button
          type="button"
          onClick={resendOTP}
          variant={"link"}
          className={cn(
            "mr-auto  text-muted-foreground font-medium hover:no-underline text-base mt-2",
            {
              "text-blue-500 hover:underline! cursor-pointer": timeLeft === 0,
            }
          )}
        >
          {timeLeft > 0 ? "00:" + String(timeLeft).padStart(2, "0") : "Resend"}
        </Button>
        <p className="text-red-500 text-base lg:text-sm mt-4 text-start w-full">
          {error}
        </p>
        <Button
          disabled={isSubmitting}
          className="h-16 text-lg lg:text-base lg:h-13 w-full rounded-2xl text-white mt-10 cursor-pointer"
        >
          {isSubmitting && (
            <Loader2 className="w-5! h-5! lg:w-4! lg:h-4! animate-spin" />
          )}
          Verify OTP
        </Button>{" "}
      </form>
    </div>
  );
}
