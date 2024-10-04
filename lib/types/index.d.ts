export type DrawerMode = "add" | "list" | "edit";

export type LocationIcon = { key: string; label: string; icon: ReactNode };

export type Location = {
  id?: string | number;
  name: string;
  latitude: number;
  longitude: number;
  markerColor: string;
  icon: LocationIcon;
};

export type Route = {
  from: Location | null;
  to: Location | null;
};
