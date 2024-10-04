import { useLocationStore } from "@/lib/store/use-location-store";
import { Location } from "@/lib/types";
import { EditIcon } from "@chakra-ui/icons";
import { Box, IconButton, List, ListItem, Text } from "@chakra-ui/react";

interface ListModeProps {
  setLocationData: (location: Location) => void;
}
export const ListMode = ({ setLocationData }: ListModeProps) => {
  // Stores
  const { setMode, locations } = useLocationStore();
  return (
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
                  Enlem: {location.latitude}, Boylam: {location.longitude}
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
  );
};
