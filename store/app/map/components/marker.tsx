import { useState } from "react";
import { AdvancedMarker } from "@vis.gl/react-google-maps";

export default function DraggableMarker() {
  const [position, setPosition] = useState({ lat: 40.7128, lng: -74.006 });

  const handleDragEnd = (e: any) => {
    const newLat = e.latLng.lat();
    const newLng = e.latLng.lng();

    setPosition({ lat: newLat, lng: newLng });
    console.log("Selected Location:", newLat, newLng);
    // You can now save these coordinates to your database
  };

  return (
    <AdvancedMarker
      position={position}
      draggable={true}
      onDragEnd={handleDragEnd}
    />
  );
}
