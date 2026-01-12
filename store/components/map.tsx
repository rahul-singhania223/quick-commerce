"use client";

import React, { useState, useCallback, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Loader2, MapPinPlusInside } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import axios from "axios";
import { toast } from "sonner";

// Define the size of the map container
const containerStyle = {
  width: "100%",
  height: "100vh",
};

interface Props {
  defaultPosition: {
    lat: number;
    lng: number;
  };
  address?: string;
  width?: string;
  height?: string;
  onPositionChange: (position: { lat: number; lng: number }) => void;
}

function Map({
  defaultPosition,
  height,
  width,
  onPositionChange,
  address,
}: Props) {
  const { isLoaded } = useJsApiLoader({
    id: "googlEe-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY!!, // Replace with your actual key
  });

  const [map, setMap] = useState<any>(null);
  const [position, setPosition] = useState(defaultPosition);

  // get geocode address
  const geocodeAddress = async () => {
    if (!map) return;
    if (!address || !address.trim()) return;

    try {
      const res = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY!!}`
      );

      const data = res.data;
      console.log(data);

      const location = data.results[0].geometry.location;
      const newPos = { lat: location.lat, lng: location.lng };
      setPosition(newPos);
      map.panTo(newPos); // Smoothly moves the map
      map.setZoom(14);
    } catch (err) {
      console.log(err);
      toast.error("Failed to geocode address!");
    }
  };

  // Function to handle the end of a drag event
  const onMarkerDragEnd = (event: any) => {
    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();
    setPosition({ lat: newLat, lng: newLng });
    onPositionChange({ lat: newLat, lng: newLng });

    const newPos = { lat: newLat, lng: newLng };
    map.panTo(newPos); // Smoothly moves the map
    map.setZoom(19);
  };

  const getCustomIcon = (IconComponent: any, color = "#ef4444") => {
    const svgString = renderToStaticMarkup(
      <IconComponent fill={color} color={"#ffff"} size={48} strokeWidth={1} />
    );
    // Encode the SVG string to a Data URI
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgString)}`;
  };

  const onLoad = useCallback(function callback(mapInstance: any) {
    // This allows you to store the map instance to use later (e.g., for bounds)
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(function callback(mapInstance: any) {
    setMap(null);
  }, []);

  useEffect(() => {
    if (!address || !address.trim()) return;
    geocodeAddress();
  }, [address]);

  if (!isLoaded)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Loader2 className="size-5 text-muted-foreground animate-spin" />
      </div>
    );

  return (
    <GoogleMap
      mapContainerStyle={{ width: width || "100%", height: height || "100vh" }}
      center={defaultPosition}
      zoom={16}
      onLoad={onLoad}
      onUnmount={onUnmount}
      mapTypeId="hybrid"
    >
      <Marker
        position={position}
        title="Click to see more"
        draggable={true}
        onDragEnd={onMarkerDragEnd}
        icon={{
          url: getCustomIcon(MapPinPlusInside, "#000"),
          scaledSize: new window.google.maps.Size(45, 45),
          anchor: new window.google.maps.Point(20, 40),
        }}
      />
    </GoogleMap>
  );
}

export default React.memo(Map);
