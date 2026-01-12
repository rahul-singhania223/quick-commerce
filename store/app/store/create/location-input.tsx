"use client";

import Map from "@/components/map";
import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

const centerData = process.env.NEXT_PUBLIC_DEFAULT_MAP_CENTER!!.split(" ");
const center = {
  lat: Number(centerData[0]) || 25.6176,
  lng: Number(centerData[1]) || 85.1451,
};

interface Props {
  address: string;
  onPositionChange: (position: { lat: number; lng: number }) => void;
  selectedLocation?: {
    lat: number;
    lng: number;
  };
}

export default function LocationInput({
  address,
  onPositionChange,
  selectedLocation,
}: Props) {
  const [defaultPosition, setDefaultPosition] = useState<{
    lat: number;
    lng: number;
  }>(selectedLocation || center);
  const [status, setStatus] = useState("");

  if (status) {
    return (
      <div className="text-destructive">
        <AlertTriangle />
        {status}
      </div>
    );
  }

  return (
    <div className="bg-black flex-1 max-w-125 max-h-60">
      <Map
        width="100%"
        height="100%"
        address={address}
        onPositionChange={onPositionChange}
        defaultPosition={defaultPosition}
      />
    </div>
  );
}
