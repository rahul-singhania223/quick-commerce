"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const Header = ({ showSubHeader = true }) => {
  const router = useRouter();

  const onBack = () => {
    router.back();
  };

  return (
    <div className="fixed top-0 left-0 w-full z-10">
      <nav className="h-14 w-full px-4 bg-white border-b border-border flex items-center justify-between">
        <Button
          variant={"ghost"}
          onClick={onBack}
          aria-label="Go back"
          className=" rounded-4xl flex items-center justify-center transition-colors active:bg-[#F3F4F6] -ml-2 cursor-pointer"
        >
          <ChevronLeft size={20} className="text-foreground" />
          <span>Back</span>
        </Button>

        <h1 className="flex-1 text-center text-[16px] font-semibold text-foreground leading-5 truncate px-2">
          Add Product
        </h1>

        <div className="w-10" aria-hidden="true" />
      </nav>
    </div>
  );
};

export default Header;
