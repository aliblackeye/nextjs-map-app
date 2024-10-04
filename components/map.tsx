"use client";

import { useLocationStore } from "@/lib/store/use-location-store";
import { Location } from "@/lib/types";
import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { LOCATION_ICONS } from "@/lib/constants/location";
import { IconType } from "react-icons";
import { renderToStaticMarkup } from "react-dom/server";
import { useEffect, useState } from "react";

// Helper to convert React component (SVG) to a Base64-encoded string
const convertIconToBase64 = (
  IconComponent: IconType | undefined,
  color: string
) => {
  if (!IconComponent) {
    return "";
  }

  const svgString = encodeURIComponent(
    renderToStaticMarkup(<IconComponent color={color} size="20" />)
  );
  return `data:image/svg+xml;charset=UTF-8,${svgString}`;
};

export const Map = () => {
  const { locations, setMode, setSelectedLocation, setOpen, route, setRoute } =
    useLocationStore();
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  // Konuma tıklayınca düzenleme moduna geç
  const onLocationClick = (location: Location) => {
    setMode("edit");
    setSelectedLocation(location);
    setOpen(true);
  };

  // Haritaya tıklanınca konum ekleme moduna geç
  const onMapClick = (
    latitude: Location["latitude"],
    longitude: Location["longitude"]
  ) => {
    setMode("add");
    setOpen(true);
    setSelectedLocation({
      id: Date.now(),
      name: "",
      latitude,
      longitude,
      markerColor: "#000000",
      icon: LOCATION_ICONS[0], // Varsayılan ikon
    });
  };

  useEffect(() => {
    if (route.from && route.to) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: { lat: route.from.latitude, lng: route.from.longitude },
          destination: { lat: route.to.latitude, lng: route.to.longitude },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`Directions request failed due to ${status}`);
          }
        }
      );
    }
  }, [route]);

  return (
    <GoogleMap
      data-testid="map-component"
      onClick={(e) => onMapClick(e?.latLng!.lat(), e?.latLng!.lng())}
      mapContainerStyle={defaultMapContainerStyle}
      center={defaultMapCenter}
      zoom={defaultMapZoom}
      options={defaultMapOptions}
    >
      {locations.map((location) => {
        const IconComponent = LOCATION_ICONS.find(
          (i) => i.key === location.icon.key
        )?.icon;
        const iconUrl = convertIconToBase64(
          IconComponent,
          location.markerColor
        );

        if (!iconUrl) {
          return null;
        }

        return (
          <Marker
            key={location.id}
            position={{ lat: location.latitude, lng: location.longitude }}
            icon={{
              url: iconUrl,
              scaledSize: new google.maps.Size(40, 40),
            }}
            onClick={() => onLocationClick(location)}
          />
        );
      })}

      {/* Directions Renderer */}
      {directions && <DirectionsRenderer directions={directions} />}

      {/* Rotayı kapatmak için bir buton */}
      {directions && (
        <button
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 1000,
            padding: "8px 12px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={() => {
            setDirections(null); // Rotayı kaldır
            setRoute({ from: null, to: null }); // Rotayı kapat
          }}
        >
          Rotayı Kapat
        </button>
      )}
    </GoogleMap>
  );
};

export const defaultMapContainerStyle = {
  width: "100%",
  height: "100vh",
  borderRadius: "15px 0px 0px 15px",
};

export const defaultMapCenter = { lat: 41.0082, lng: 28.9784 };
export const defaultMapZoom = 10;
export const defaultMapOptions = {
  zoomControl: true,
  tilt: 0,
  gestureHandling: "auto",
  mapTypeId: "roadmap",
};
