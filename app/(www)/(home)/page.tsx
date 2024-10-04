import { Box } from "@chakra-ui/react";
import { LocationDrawer } from "./_partials/location-drawer";
import { LocationMap } from "./_partials/location-map";

export default function HomePage() {
  return (
    <Box>
      <LocationMap />

      <LocationDrawer />
    </Box>
  );
}
