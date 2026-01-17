"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getOTP } from "@/quries/auth.query";
import { ErrorResponse, OtpMeta, SuccessResponse } from "@/types/types";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  isSubmitting: boolean;
  phone: string;
  session_id: string;
  error: string;
  setError: (msg: string) => void;
  otpMeta: OtpMeta | null;
}

export default function ResendOTP({
  isSubmitting,
  phone,
  session_id,
  error,
  setError,
  otpMeta
}: Props) {
  const [resending, setResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const router = useRouter();

  const resendOTP = async () => {
    if (resending) return;
    if (timeLeft > 0) return;
    if (!phone || !session_id)
      return setError("Phone & sessionId are required!");
    try {
      setResending(true);
      const res = await getOTP({ phone });
      const resData = res.data as SuccessResponse;
      const { session_id: newSessionId } = resData.data;
      return router.push(
        `/auth/verify-otp?session_id=${newSessionId}&phone=${phone}`
      );
    } catch (error) {
      const errorData = error as ErrorResponse;
      setError(errorData.message);
    } finally {
      setResending(false);
    }
  };

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

  return (
    <Button
      disabled={isSubmitting || resending}
      type="button"
      onClick={resendOTP}
      variant={"link"}
      className={cn(
        "mr-auto  text-muted-foreground font-medium hover:no-underline text-base mt-2",
        {
          "text-blue-500 hover:underline! cursor-pointer": timeLeft === 0,
          "text-muted-foreground": resending,
        }
      )}
    >
      {resending && (
        <Loader2 className="w-5! h-5! lg:w-4! lg:h-4! animate-spin text-muted-foreground" />
      )}
      {timeLeft > 0 ? "00:" + String(timeLeft).padStart(2, "0") : "Resend"}
    </Button>
  );
}
