import { Map } from "@/components/map";
import { MapProvider } from "@/lib/providers/map-provider";

export const LocationMap = () => {
  return (
    <MapProvider>
      <Map />
    </MapProvider>
  );
};
