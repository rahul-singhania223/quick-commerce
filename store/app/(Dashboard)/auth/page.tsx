import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import AuthForm from "./components/authFrorm";
import Wrapper from "@/components/wrapper";
import Link from "next/link";

export default function AuthPage() {
  return (
    <div className="relative h-screen flex items-center justify-center">
      <div className="absolute inset-0">
        <div className="absolute top-0 z-[-2] h-screen w-screen rotate-180 transform bg-white bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(252,205,238,.5)_100%)]"></div>
      </div>

      <Wrapper>
        <div className="w-full h-full relative z-100 p-4 flex flex-col justify-between ">
          <Link
            href={"/auth"}
            className="mt-0  mb-10 lg:mb-6 flex items-center gap-4"
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

          <div className="text-center mb-10 lg:mb-8 flex-[0.3] flex flex-col justify-end">
            <h1 className="text-4xl lg:text-5xl font-bold">
              Grow your business online
            </h1>
            <h3 className="text-lg lg:text-xl text-body/70 mt-4">
              Join 10,000+ local stores on RojBazaar.
            </h3>
          </div>

          <AuthForm />
        </div>
      </Wrapper>
    </div>
  );
}
