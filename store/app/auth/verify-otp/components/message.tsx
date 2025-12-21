"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Message() {
  const params = useSearchParams();
  const phone = params.get("phone");

  return (
    <div className="text-center mb-10 lg:mb-8">
      <h1 className="text-3xl lg:text-[22px] font-bold">Verify OTP</h1>
      <h3 className="text-lg lg:text-[14px] text-body mt-3 lg:mt-1.5">
        A 6-digit OTP has been sent to the phone number {phone} {" "}
        <br />
        <Link href={"/auth"} className="text-blue-500 hover:underline">Change</Link>
      </h3>
    </div>
  );
}
