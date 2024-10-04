"use client";

import {
  Drawer as DrawerComponent,
  DrawerBody,
  DrawerHeader,
  DrawerContent,
  Button,
  Box,
  IconButton,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { Location } from "@/lib/types";
import { useLocationStore } from "@/lib/store/use-location-store";
import { LOCATION_ICONS } from "@/lib/constants/location";
import { HamburgerIcon } from "@chakra-ui/icons"; // Rotayı göster butonu için ok işareti
import { ListMode } from "./list-mode";
import { CrudMode } from "./crud-mode";

// Boş bir Location yapısı
const emptyLocation: Location = {
  id: Date.now(),
  name: "",
  latitude: 0,
  longitude: 0,
  markerColor: "#000000", // Varsayılan renk siyah
  icon: LOCATION_ICONS[0],
};

export function LocationDrawer() {
  // Stores
  const {
    mode,
    setMode,
    selectedLocation,
    setSelectedLocation,
    setOpen,
    open,
  } = useLocationStore();

  // States
  const [locationData, setLocationData] = useState<Location>(emptyLocation);

  const handleClickEdit = useCallback(() => {
    setOpen(true);
    setSelectedLocation(null);
    setMode("list");
  }, []);

  // Effects
  useEffect(() => {
    if (selectedLocation) {
      setLocationData(selectedLocation);
    } else {
      setLocationData(emptyLocation);
    }
  }, [selectedLocation]);

  return (
    <Box data-testid="location-drawer">
      <DrawerComponent
        isOpen={open}
        placement="right"
        onClose={() => {
          setOpen(false);
        }}
        blockScrollOnMount={false}
        closeOnOverlayClick={false}
      >
        <DrawerContent
          position="fixed"
          width="400px"
          right="0"
          top="0"
          height="100vh"
          zIndex={1000}
        >
          <DrawerHeader>
            {mode === "add"
              ? "Konum Ekle"
              : mode === "edit"
              ? `Düzenle: ${locationData.name}`
              : "Konum Listesi"}
          </DrawerHeader>

          <DrawerBody>
            {/* Listeleme Modu */}
            {mode === "list" && <ListMode setLocationData={setLocationData} />}
            {/* Düzenleme veya Ekleme Modu */}
            {(mode === "add" || mode === "edit") && (
              <CrudMode
                locationData={locationData}
                setLocationData={setLocationData}
              />
            )}

            {/* Drawer Gizle Butonu */}
            <Box mt={4}>
              <Button
                colorScheme="gray"
                onClick={() => {
                  setOpen(false);
                }}
                width="100%"
              >
                Gizle
              </Button>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </DrawerComponent>
      {!open && (
        <IconButton
          aria-label="Düzenle"
          icon={<HamburgerIcon />}
          position="fixed"
          top="10px"
          right="64px"
          zIndex={1000}
          colorScheme="blue"
          onClick={handleClickEdit}
        />
      )}
    </Box>
  );
}
