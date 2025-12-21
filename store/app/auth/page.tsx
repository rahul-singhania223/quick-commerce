import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import AuthForm from "./components/authFrorm";

export default function AuthPage() {
  return (
    <div className="relative h-screen flex items-center justify-center">
      <div className="absolute inset-0">
        <div className="absolute top-0 z-[-2] h-screen w-screen rotate-180 transform bg-white bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(252,205,238,.5)_100%)]"></div>
      </div>

      <div className="w-full h-full relative z-100 p-4">
        <div className="mt-18  mb-10 lg:mb-6 flex flex-col items-center">
          <Image src={"/images/logo.png"} alt="logo" width={64} height={64} />
          <h2 className="mt-2 text-[20px] font-semibold">Store Partner</h2>
        </div>

        <div className="text-center mb-10 lg:mb-8">
          <h1 className="text-3xl lg:text-[22px] font-bold">Welcome Back</h1>
          <h3 className="text-lg lg:text-[14px] text-body mt-2 lg:mt-1.5">
            Login to manage you store.
          </h3>
        </div>

        <AuthForm />
      </div>
    </div>
  );
}
