import {
  Drawer as DrawerComponent,
  DrawerBody,
  DrawerHeader,
  DrawerContent,
  Button,
  Input,
  Select,
  Box,
  Text,
  List,
  ListItem,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { Location, LocationIcon } from "@/lib/types";
import { useLocationStore } from "@/lib/store/use-location-store";
import { LOCATION_ICONS } from "@/lib/constants/location";
import { EditIcon, ArrowForwardIcon } from "@chakra-ui/icons"; // Rotayı göster butonu için ok işareti

// Boş bir Location yapısı
const emptyLocation: Location = {
  id: Date.now(),
  name: "",
  latitude: 0,
  longitude: 0,
  markerColor: "#000000", // Varsayılan renk siyah
  icon: LOCATION_ICONS[0],
};

type DrawerMode = "add" | "list" | "edit";

interface LocationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: DrawerMode;
  selectedLocation: Location | null;
  setMode: (mode: DrawerMode) => void;
  locations: Location[]; // Kayıtlı konumlar
  onShowRoute: (location: Location) => void; // Rotayı göster işlevi
  onRouteClose: () => void; // Rotayı kapatma işlevi
  route: { from: Location | null; to: Location | null }; // Şu anki rota
}

export function LocationDrawer(props: LocationDrawerProps) {
  const {
    isOpen,
    mode,
    onClose,
    selectedLocation,
    locations,
    setMode,
    onShowRoute,
    onRouteClose,
    route,
  } = props;

  // Store'dan add, update ve delete fonksiyonlarını al
  const { addLocation, updateLocation, deleteLocation } = useLocationStore();

  // States (Boş veya seçilen konum)
  const [locationData, setLocationData] = useState<Location>(emptyLocation);

  // Konum değiştiğinde state'i güncelle
  useEffect(() => {
    if (selectedLocation) {
      setLocationData(selectedLocation);
    } else {
      setLocationData(emptyLocation);
    }
  }, [selectedLocation]);

  // Kaydet veya güncelle işlemleri
  const handleSave = () => {
    if (mode === "add") {
      addLocation(locationData);
    } else if (mode === "edit") {
      updateLocation(locationData);
    }
    onClose();
  };

  // Silme işlemi ve rota kontrolü
  const handleDelete = () => {
    if (locationData && locationData.id) {
      // Eğer silinen konum rota üzerinde ise, rotayı kapat
      if (
        route.from?.id === locationData.id ||
        route.to?.id === locationData.id
      ) {
        onRouteClose(); // Rotayı kapatma işlevi
      }

      deleteLocation(locationData.id as number);
      onClose(); // Silmeden sonra drawer kapanmalı
    }
  };

  const debounceTimeoutRef = useRef<number | undefined>(undefined);

  const handleColorInputChange = (color: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = window.setTimeout(() => {
      setLocationData((prev) => ({ ...prev, markerColor: color }));
    }, 300);
  };

  return (
    <DrawerComponent
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
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
          {mode === "list" && (
            <Box>
              {locations.length === 0 ? (
                <Text>Henüz eklenmiş konum yok.</Text>
              ) : (
                <List>
                  {locations.map((location) => (
                    <ListItem
                      key={location.id}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      p={2}
                      bg="gray.100"
                      borderRadius="md"
                      mb={2}
                    >
                      <Box>
                        <Text>{location.name}</Text>
                        <Text fontSize="sm" color="gray.500">
                          Enlem: {location.latitude}, Boylam:{" "}
                          {location.longitude}
                        </Text>
                      </Box>
                      <IconButton
                        aria-label="Düzenle"
                        icon={<EditIcon />}
                        onClick={() => {
                          setLocationData(location);
                          setMode("edit");
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          )}

          {/* Düzenleme veya Ekleme Modu */}
          {(mode === "add" || mode === "edit") && (
            <List spacing={3}>
              <ListItem>
                <Text mb="8px">Konum Adı</Text>
                <Input
                  value={locationData.name || ""}
                  onChange={(e) =>
                    setLocationData({ ...locationData, name: e.target.value })
                  }
                />
              </ListItem>

              <ListItem>
                <Text mb="8px">İkon</Text>
                <Select
                  onChange={(e) =>
                    setLocationData({
                      ...locationData,
                      icon: LOCATION_ICONS.find(
                        (v) => v.key === (e.target.value as LocationIcon["key"])
                      )!,
                    })
                  }
                  value={locationData.icon.key || LOCATION_ICONS[0].key}
                >
                  {LOCATION_ICONS.map((item) => {
                    return (
                      <option value={item.key} key={item.key}>
                        {item.label}
                      </option>
                    );
                  })}
                </Select>
              </ListItem>

              <ListItem>
                <Box mt={4}>
                  <Text mb="8px">Renk</Text>

                  <Input
                    type="color"
                    value={locationData.markerColor}
                    onChange={(e) => handleColorInputChange(e.target.value)}
                  />
                </Box>
              </ListItem>

              <ListItem>
                <Flex mt={4} gap={2}>
                  <Button colorScheme="blue" onClick={handleSave} width="100%">
                    {mode === "add" ? "Oluştur" : "Kaydet"}
                  </Button>
                  {mode === "edit" && (
                    <Button
                      colorScheme="red"
                      onClick={handleDelete}
                      width="100%"
                    >
                      Sil
                    </Button>
                  )}
                </Flex>
              </ListItem>

              {/* Rotayı Göster Butonu */}
              {mode === "edit" && (
                <ListItem>
                  <Button
                    colorScheme="green"
                    onClick={() => onShowRoute(locationData)}
                    width="100%"
                    leftIcon={<ArrowForwardIcon />} // Ok işareti
                  >
                    Rotayı Göster
                  </Button>
                </ListItem>
              )}
            </List>
          )}

          {/* Drawer Gizle Butonu */}
          <Box mt={4}>
            <Button colorScheme="gray" onClick={onClose} width="100%">
              Gizle
            </Button>
          </Box>
        </DrawerBody>
      </DrawerContent>
    </DrawerComponent>
  );
}
