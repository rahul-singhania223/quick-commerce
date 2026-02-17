"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  APIProvider,
  Map,
  useMapsLibrary,
  useMap,
} from "@vis.gl/react-google-maps";
import { X, RotateCcw, Check, Loader2 } from "lucide-react";

function DrawingManager({
  onComplete,
  resetTrigger,
}: {
  onComplete: (coords: [number, number][]) => void;
  resetTrigger: number;
}) {
  const map = useMap();
  const drawingLib = useMapsLibrary("drawing");
  const [manager, setManager] =
    useState<google.maps.drawing.DrawingManager | null>(null);
  const [currentPolygon, setCurrentPolygon] =
    useState<google.maps.Polygon | null>(null);

  useEffect(() => {
    if (!drawingLib || !map) return;

    const dm = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: false,
      polygonOptions: {
        fillColor: "#ff714b80",
        fillOpacity: 0.3,
        strokeWeight: 2,
        strokeColor: "#ff714b",
        editable: true,
      },
    });

    dm.setMap(map);
    setManager(dm);

    google.maps.event.addListener(
      dm,
      "polygoncomplete",
      (polygon: google.maps.Polygon) => {
        // If a polygon already exists, remove it (only one zone at a time)
        if (currentPolygon) currentPolygon.setMap(null);

        setCurrentPolygon(polygon);
        dm.setDrawingMode(null); // Stop drawing after one is finished

        const path = polygon.getPath();
        const coords: [number, number][] = [];
        for (let i = 0; i < path.getLength(); i++) {
          const point = path.getAt(i);
          coords.push([point.lng(), point.lat()]);
        }
        onComplete(coords);
      },
    );

    return () => dm.setMap(null);
  }, [drawingLib, map]);

  // Handle Reset from parent
  useEffect(() => {
    if (currentPolygon) currentPolygon.setMap(null);
    if (manager)
      manager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    onComplete([]);
  }, [resetTrigger]);

  return null;
}

/* Geocode city to center map */

function MapGeocoder({ city }: { city: string }) {
  const map = useMap();
  const geocodingLib = useMapsLibrary("geocoding");

  useEffect(() => {
    if (!geocodingLib || !map || !city) return;

    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: city }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        map.setCenter(location);
        map.setZoom(12); // Optional: Adjust zoom level for city view
      } else {
        console.error("Geocode failed: " + status);
      }
    });
  }, [city, geocodingLib, map]);

  return null;
}

// --- Main Modal Component ---

interface ModalProps {
  city: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (coords: [number, number][]) => void;
  apiKey: string;
}

export default function ZoneDrawingModal({
  isOpen,
  onClose,
  onSubmit,
  apiKey,
  city,
}: ModalProps) {
  const [tempCoords, setTempCoords] = useState<[number, number][]>([]);
  const [resetKey, setResetKey] = useState(0);

  const handlePolygonComplete = useCallback((coords: [number, number][]) => {
    setTempCoords(coords);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col h-[80vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Draw Zone Boundary
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              Click on the map to define the polygon area
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Map Body */}
        <div className="flex-1 relative bg-gray-50">
          <APIProvider apiKey={apiKey}>
            <Map
              defaultCenter={{ lat: 12.9716, lng: 77.5946 }}
              defaultZoom={13}
              mapId="drawing-map-id"
              disableDefaultUI={false}
            >
              <DrawingManager
                onComplete={(coords) => handlePolygonComplete(coords)}
                resetTrigger={resetKey}
              />

              <MapGeocoder city={city} />
            </Map>
          </APIProvider>

          {tempCoords.length === 0 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 px-4 py-2 rounded-full shadow-md pointer-events-none border border-blue-100">
              <span className="text-sm font-semibold text-blue-600">
                Drawing Mode Active: Click to start
              </span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setResetKey((prev) => prev + 1)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <RotateCcw size={18} />
            Reset Polygon
          </button>

          <div className="flex items-center gap-3">
            <button

              onClick={onClose}
              className="px-6 py-2 text-sm font-bold text-gray-500 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={tempCoords.length < 3}
              onClick={() => onSubmit(tempCoords)}
              className="flex items-center gap-2 px-8 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg shadow-lg transition-all"
            >
              <Check size={18} />
              Confirm & Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
