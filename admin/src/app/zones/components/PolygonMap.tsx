"use client";

import {
  APIProvider,
  Map,
  useMapsLibrary,
  useMap,
} from "@vis.gl/react-google-maps";
import { useEffect, useState, useMemo } from "react";
import React from "react";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
const mapId = process.env.NEXT_PUBLIC_MAP_ID!;

interface Props {
  coordinates: [number, number][];
  defaultZoom: number;
}

export default function PolygonMap({ coordinates, defaultZoom }: Props) {
  const polygonCoords = useMemo(
    () =>
      coordinates.map((point) => ({
        lat: point[1],
        lng: point[0],
      })),
    [coordinates],
  );

  return (
    <div className="w-full h-full">
      <APIProvider apiKey={API_KEY}>
        <Map
          defaultCenter={polygonCoords[0]}
          defaultZoom={defaultZoom}
          mapId={mapId}
        >
          <Polygon paths={polygonCoords} />
          {/* We handle the auto-centering inside a sub-component to access the map hook */}
          <MapController paths={polygonCoords} />
        </Map>
      </APIProvider>
    </div>
  );
}

// This component handles moving the camera when paths change
function MapController({ paths }: { paths: google.maps.LatLngLiteral[] }) {
  const map = useMap();

  useEffect(() => {
    if (!map || paths.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    paths.forEach((path) => bounds.extend(path));

    // Get the geometric center of the bounding box
    const center = bounds.getCenter();

    // panTo provides a smooth animation to the new center
    map.panTo(center);

    // Optional: Use map.fitBounds(bounds) if you also want the zoom to adjust
    // map.fitBounds(bounds);
  }, [map, paths]);

  return null;
}

function Polygon({ paths }: { paths: google.maps.LatLngLiteral[] }) {
  const maps = useMapsLibrary("maps");
  const map = useMap();
  const [polygon, setPolygon] = useState<google.maps.Polygon | null>(null);

  useEffect(() => {
    if (!maps || !map) return;

    const poly = new google.maps.Polygon({
      strokeColor: "#ff714b",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#ff714b80",
      fillOpacity: 0.35,
    });

    poly.setMap(map);
    setPolygon(poly);

    return () => poly.setMap(null);
  }, [maps, map]);

  useEffect(() => {
    if (polygon) polygon.setPath(paths);
  }, [polygon, paths]);

  return null;
}
