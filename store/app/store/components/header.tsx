"use client";

import Image from "next/image";
import { Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getUser, logout } from "@/quries/auth.query";
import { useRouter } from "next/navigation";
import { ErrorResponse, SuccessResponse, User } from "@/types/types";
import { toast } from "sonner";
import { useUser } from "@/zustand-store/user.store";

export default function Header() {
  const [loggingOut, setLoggingOut] = useState(false);

  const router = useRouter();

  const { user, setUser, emptyUser, loading, setLoading } = useUser();

  const handleLogout = async () => {
    if (loggingOut) return;
    if (!loading || !user) return;
    try {
      setLoggingOut(true);

      const res = await logout();
      emptyUser();
      return router.refresh();
    } catch (error) {
      console.log(error);
      const errorDetails = error as ErrorResponse;
      return toast.error(errorDetails.message);
    }
  };

  useEffect(() => {
    if (user) return;
    if (loading) return;

    const getUserDetails = async () => {
      try {
        setLoading(true);
        const res = await getUser();
        const data = res.data as SuccessResponse;
        setUser(data.data.user as User);
      } catch (error) {
        const message = (error as ErrorResponse).message;
        return toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    getUserDetails();
  }, []);

  return (
    <div className="h-16 bg-white border-b px-4 lg:px-6 flex items-center justify-between">
      <div className="flex items-center">
        <Image src={"/images/logo.png"} alt="logo" width={32} height={32} />
        <h2 className="text-[16px] font-semibold ml-3">Store Partner</h2>
      </div>

      <div className="flex items-center text-sm lg:space-x-8 lg:text-[14px]">
       
        <Button
          disabled={loggingOut}
          onClick={handleLogout}
          variant={"ghost"}
          className="text-destructive hover:text-destructive"
        >
          {loggingOut || loading ? (
            <Loader2 className="animate-spin text-muted-foreground" />
          ) : (
            <>
              Log Out <LogOut className="size-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
