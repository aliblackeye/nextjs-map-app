import { Map } from "@/components/map";
import { MapProvider } from "@/lib/providers/map-provider";

export const LocationMap = () => {
  return (
    <div data-testid="location-map">
      <MapProvider>
        <Map />
      </MapProvider>
    </div>
  );
};
