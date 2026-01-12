"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Message() {
  const params = useSearchParams();
  const phone = params.get("phone");

  return (
    <div className="text-center mb-20 lg:mb-8">
      <h1 className="text-3xl lg:text-4xl font-bold">Verify OTP</h1>
      <h3 className="text-base lg:text-lg text-body/80 mt-4 ">
        A 4-digit OTP has been sent to the phone number {phone} {" "}
        <br />
        <Link href={"/auth"} className="text-blue-500 hover:underline lg:text-sm">Change</Link>
      </h3>
    </div>
  );
}
