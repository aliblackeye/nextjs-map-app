import { LOCATION_ICONS } from "@/lib/constants/location";
import { useLocationStore } from "@/lib/store/use-location-store";
import { Location, LocationIcon } from "@/lib/types";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  List,
  ListItem,
  Select,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import { Field, Form, Formik } from "formik";

interface CrudModeProps {
  locationData: Location;
  setLocationData: Dispatch<SetStateAction<Location>>;
}

export const CrudMode = ({ locationData }: CrudModeProps) => {
  // Stores
  const {
    addLocation,
    updateLocation,
    deleteLocation,
    mode,
    setOpen,
    setRoute,
    route,
  } = useLocationStore();

  const validateName = (value: string) => {
    let error;
    if (!value) {
      error = "Konum adı gereklidir.";
    }
    return error;
  };

  const handleSave = (values: Location) => {
    if (mode === "add") {
      addLocation(values);
    } else if (mode === "edit") {
      updateLocation(values);
    }
    setOpen(false);
  };

  const handleDelete = () => {
    if (locationData && locationData.id) {
      if (
        route.from?.id === locationData.id ||
        route.to?.id === locationData.id
      ) {
        setRoute({ from: null, to: null });
      }
      deleteLocation(locationData.id);
      setOpen(false); // Silmeden sonra drawer kapanmalı
    }
  };

  const handleShowRoute = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const fromLocation = {
        id: 0,
        name: "Mevcut Konum",
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        markerColor: "#000",
        icon: LOCATION_ICONS[0],
      };
      setRoute({ from: fromLocation, to: locationData });
    });
  };

  return (
    <Formik
      initialValues={locationData}
      enableReinitialize={true}
      onSubmit={(values) => handleSave(values)}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <List spacing={3}>
            {/* Konum Adı */}
            <Field name="name" validate={validateName}>
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.name && form.touched.name}>
                  <FormLabel>Konum Adı</FormLabel>
                  <Input {...field} placeholder="Konum Adı" />
                  <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            {/* İkon Seçimi */}
            <FormControl>
              <FormLabel>İkon</FormLabel>
              <Select
                value={values.icon.key || LOCATION_ICONS[0].key}
                onChange={(e) =>
                  setFieldValue(
                    "icon",
                    LOCATION_ICONS.find(
                      (v) => v.key === (e.target.value as LocationIcon["key"])
                    )
                  )
                }
              >
                {LOCATION_ICONS.map((item) => (
                  <option value={item.key} key={item.key}>
                    {item.label}
                  </option>
                ))}
              </Select>
            </FormControl>

            {/* Renk Seçimi */}
            <FormControl>
              <FormLabel>Renk</FormLabel>
              <Input
                type="color"
                value={values.markerColor}
                onChange={(e) => setFieldValue("markerColor", e.target.value)}
              />
            </FormControl>

            {/* Kaydet ve Sil Butonları */}
            <ListItem>
              <Flex mt={4} gap={2}>
                <Button colorScheme="blue" type="submit" width="100%">
                  {mode === "add" ? "Oluştur" : "Kaydet"}
                </Button>
                {mode === "edit" && (
                  <Button colorScheme="red" onClick={handleDelete} width="100%">
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
                  onClick={handleShowRoute}
                  width="100%"
                  leftIcon={<ArrowForwardIcon />}
                >
                  Rotayı Göster
                </Button>
              </ListItem>
            )}
          </List>
        </Form>
      )}
    </Formik>
  );
};
