"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useState } from "react";

export default function AuthForm() {
  const [error, setError] = useState("Something went wrong");

  return (
    <form className="space-y-4">
      <p className="text-center text-destructive">{error}</p>
      <Input className="h-11" type="email" placeholder="Eg. email@domain" />
      <Input className="h-11" type="password" placeholder="Password" />
      <Button className="w-full">Login</Button>
    </form>
  );
}
