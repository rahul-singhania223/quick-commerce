"use client";

import {
  APIProvider,
  Map,
  useMapsLibrary,
  useMap,
} from "@vis.gl/react-google-maps";
import { useState } from "react";
import React from "react";


const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
const mapId = process.env.NEXT_PUBLIC_MAP_ID!;

interface Props {
  coordinates: [number, number][];
  defaultZoom: number;
}

export default function PolygonMap({ coordinates, defaultZoom }: Props) {
  const polygonCoords = coordinates.map((point) => ({
    lat: point[1],
    lng: point[0],
  }));

  return (
    <div className="w-full h-full">
      <APIProvider apiKey={API_KEY}>
        <Map
          defaultCenter={polygonCoords[0]}
          defaultZoom={defaultZoom}
          mapId={mapId} // Optional, required for advanced markers
        >
          <Polygon paths={polygonCoords} />
        </Map>
      </APIProvider>
    </div>
  );
}

// Custom Polygon Component
function Polygon({ paths }: { paths: google.maps.LatLngLiteral[] }) {
  const maps = useMapsLibrary("maps");
  const [polygon, setPolygon] = useState<google.maps.Polygon | null>(null);

  React.useEffect(() => {
    if (!maps || polygon) return;

    const poly = new google.maps.Polygon({
      paths: paths,
      strokeColor: "#22C55E",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#22C55E",
      fillOpacity: 0.35,
    });

    setPolygon(poly);

    return () => {
      poly.setMap(null);
    };
  }, [maps]);

  // This effect attaches the polygon to the map instance
  const map = useMap();

  React.useEffect(() => {
    if (polygon && map) {
      polygon.setMap(map);
    }
  }, [polygon, map]);

  return null;
}
