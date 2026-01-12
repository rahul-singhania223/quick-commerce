import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Message from "./components/message";
import OTPForm from "./components/otpForm";
import Link from "next/link";
import Wrapper from "@/components/wrapper";

export default function VerifyOTP() {
  return (
    <div className="relative h-screen flex items-center justify-center">
      <div className="absolute inset-0">
        <div className="absolute top-0 z-[-2] h-screen w-screen rotate-180 transform bg-white bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(252,205,238,.5)_100%)]"></div>
      </div>

      <Wrapper className="" >
        <div className="w-full h-full relative  p-5 flex items-center justify-center">
          <Link
            href={"/auth"}
            className="mt-0  mb-10 lg:mb-6 flex items-center gap-4 absolute top-0 left-0 right-0 p-5"
          >
            <Image
              src={"/images/logo.png"}
              alt="logo"
              width={100}
              height={100}
              className="w-12  object-contain"
            />
            <h2 className="mt-2 text-lg font-semibold">Store Partner</h2>
          </Link>

          <OTPForm />
        </div>
      </Wrapper>
    </div>
  );
}
