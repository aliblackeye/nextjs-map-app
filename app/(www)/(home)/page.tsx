"use client";

import { Box, IconButton } from "@chakra-ui/react";
import { useState } from "react";
import { LocationDrawer } from "./_partials/location-crud";
import { Map } from "@/components/map";
import { Location } from "@/lib/types";
import { MapProvider } from "@/lib/providers/map-provider";
import { useLocationStore } from "@/lib/store/use-location-store";
import { HamburgerIcon } from "@chakra-ui/icons";
import { LOCATION_ICONS } from "@/lib/constants/location";

export default function HomePage() {
  const { locations } = useLocationStore();

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"list" | "edit" | "add">("list");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [route, setRoute] = useState<{
    from: Location | null;
    to: Location | null;
  }>({
    from: null,
    to: null,
  });

  // Haritaya tıklanınca konum ekleme moduna geç
  const handleMapClick = (
    latitude: Location["latitude"],
    longitude: Location["longitude"]
  ) => {
    setDrawerMode("add");
    setDrawerOpen(true);
    setSelectedLocation({
      id: Date.now(),
      name: "",
      latitude,
      longitude,
      markerColor: "#000000",
      icon: LOCATION_ICONS[0], // Varsayılan ikon
    });
  };

  // Konuma tıklayınca düzenleme moduna geç
  const handleLocationClick = (location: Location) => {
    setDrawerMode("edit");
    setSelectedLocation(location);
    setDrawerOpen(true);
  };

  // Kullanıcı konumunu alma
  const getUserLocation = (
    callback: (position: GeolocationPosition) => void
  ) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        callback,
        (error) => {
          console.error("Error getting user location:", error);
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  // Rotayı göster işlevi
  const handleShowRoute = (location: Location) => {
    getUserLocation((position) => {
      const fromLocation = {
        id: 0,
        name: "Current Location",
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        markerColor: "#000",
        icon: LOCATION_ICONS[0],
      };
      setRoute({ from: fromLocation, to: location });
    });
  };

  // Rotayı kapatma işlevi
  const handleRouteClose = () => {
    setRoute({ from: null, to: null });
  };

  return (
    <MapProvider>
      <Box>
        {!isDrawerOpen && (
          <IconButton
            aria-label="Düzenle"
            icon={<HamburgerIcon />}
            position="fixed"
            top="10px"
            right="64px"
            zIndex={1000}
            colorScheme="blue"
            onClick={() => {
              setDrawerOpen(true);
              setSelectedLocation(null);
              setDrawerMode("list");
            }}
          />
        )}

        {/* Harita */}
        <Map
          onMapClick={handleMapClick}
          onLocationClick={handleLocationClick}
          route={route} // Haritaya rota bilgisi gönderiliyor
          onRouteClose={handleRouteClose} // Rotayı kapatma işlevi
        />

        {/* LocationDrawer */}
        <LocationDrawer
          isOpen={isDrawerOpen}
          mode={drawerMode}
          onClose={() => setDrawerOpen(false)}
          selectedLocation={selectedLocation}
          setMode={setDrawerMode}
          locations={locations}
          onShowRoute={handleShowRoute} // Rotayı gösterme işlevi
          onRouteClose={handleRouteClose} // Rotayı kapatma işlevi
          route={route}
        />
      </Box>
    </MapProvider>
  );
}
