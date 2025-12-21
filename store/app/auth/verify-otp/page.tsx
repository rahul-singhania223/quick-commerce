import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Message from "./components/message";
import OTPForm from "./components/otpForm";

export default function VerifyOTP() {
  return (
    <div className="relative h-screen flex items-center justify-center">
      <div className="absolute inset-0">
        <div className="absolute top-0 z-[-2] h-screen w-screen rotate-180 transform bg-white bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(252,205,238,.5)_100%)]"></div>
      </div>

      <div className="w-full h-full relative z-100 p-5">
        <div className="mt-14  mb-10 lg:mb-6 flex flex-col items-center">
          <Image src={"/images/logo.png"} alt="logo" width={64} height={64} />
          <h2 className="mt-2 text-[20px] font-semibold">Store Partner</h2>
        </div>

        <OTPForm />
      </div>
    </div>
  );
}
