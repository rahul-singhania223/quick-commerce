"use client";

import React, { useState, useCallback, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { MapPinPlusInside } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";

// Define the size of the map container
const containerStyle = {
  width: "100%",
  height: "100vh",
};

// Default center coordinates (e.g., San Francisco)
const centerData = process.env.NEXT_PUBLIC_DEFAULT_MAP_CENTER!!.split(" ");
const center = {
  lat: Number(centerData[0]) || 25.6176,
  lng: Number(centerData[1]) || 85.1451,
};

function PageComponent() {
  const { isLoaded } = useJsApiLoader({
    id: "googlEe-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY!!, // Replace with your actual key
  });

  const [map, setMap] = useState(null);

  const [position, setPosition] = useState(center);
  const [defaultPosition, setDefaultPosition] = useState({ lat: 0, lng: 0 });
  const [status, setStatus] = useState("");

  // Function to handle the end of a drag event
  const onMarkerDragEnd = (event: any) => {
    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();
    setPosition({ lat: newLat, lng: newLng });

    console.log("New Location:", newLat, newLng);
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

  const getGpsLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation not supported");
      return;
    }

    setStatus("Locating...");

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;

        console.log("Accuracy:", accuracy);

        // Accept best effort after threshold
        if (accuracy <= 500) {
          setDefaultPosition({ lat: latitude, lng: longitude });
          navigator.geolocation.clearWatch(watchId);
          setStatus("");
        }

      },
      (err) => {
        setStatus(err.message);
        navigator.geolocation.clearWatch(watchId);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000,
      }
    );
  };

  console.log(center)

  // useEffect(() => {
  //   getGpsLocation();
  // }, []);

  // if (status) return <div>{status}</div>;

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center as any}
      zoom={16}
      onLoad={onLoad}
      onUnmount={onUnmount}
      mapTypeId="hybrid"
    >
      {/* Basic Marker */}
      <Marker
        position={center as any}
        title="Click to see more"
        draggable={true} // 1. Makes the marker draggable
        onDragEnd={onMarkerDragEnd} // 2. Captures the new coordinates
        icon={{
          url: getCustomIcon(MapPinPlusInside), // Pass Lucide icon and custom color
          scaledSize: new window.google.maps.Size(50, 50),
          anchor: new window.google.maps.Point(20, 40),
        }}
      />
    </GoogleMap>
  ) : (
    <div>Loading Maps...</div>
  );
}

export default React.memo(PageComponent);
