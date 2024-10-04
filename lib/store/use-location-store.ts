import { create } from "zustand";
import { DrawerMode, Location, Route } from "@/lib/types";

type State = {
  locations: Location[];
  mode: DrawerMode;
  open: boolean;
  selectedLocation: Location | null;
  route: Route;
};

type Action = {
  setMode: (mode: State["mode"]) => void;
  addLocation: (location: Location) => void;
  updateLocation: (location: Location) => void;
  deleteLocation: (id: number | string) => void;
  loadLocations: () => void; // LocalStorage'dan yükleme fonksiyonu
  setSelectedLocation: (location: Location | null) => void;
  setOpen: (open: State["open"]) => void;
  setRoute: (route: State["route"]) => void;
};

// Helper function to save to localStorage
const saveLocationsToLocalStorage = (locations: Location[]) => {
  localStorage.setItem("locations", JSON.stringify(locations));
};

// Helper function to load from localStorage
const loadLocationsFromLocalStorage = (): Location[] => {
  if (typeof window !== "undefined") {
    const storedLocations = localStorage.getItem("locations");
    return storedLocations ? JSON.parse(storedLocations) : [];
  }
  return [];
};

export const useLocationStore = create<State & Action>((set) => ({
  locations: loadLocationsFromLocalStorage(),
  open: false,
  mode: "list",
  route: {
    from: null,
    to: null,
  },
  selectedLocation: null,
  setMode: (mode) =>
    set(() => {
      return { mode };
    }),
  setOpen: (open) =>
    set(() => {
      return { open };
    }),
  setRoute: (route) =>
    set(() => {
      return { route };
    }),
  setSelectedLocation: (selectedLocation) =>
    set(() => {
      return { selectedLocation };
    }),
  addLocation: (location) =>
    set((state) => {
      const updatedLocations = [...state.locations, location];
      saveLocationsToLocalStorage(updatedLocations);
      return { locations: updatedLocations, mode: "list" };
    }),

  updateLocation: (updatedLocation) =>
    set((state) => {
      const updatedLocations = state.locations.map((location) =>
        location.id === updatedLocation.id ? updatedLocation : location
      );
      saveLocationsToLocalStorage(updatedLocations);
      return { locations: updatedLocations };
    }),

  deleteLocation: (id) =>
    set((state) => {
      const updatedLocations = state.locations.filter(
        (location) => location.id !== id
      );
      saveLocationsToLocalStorage(updatedLocations);
      return { locations: updatedLocations };
    }),

  loadLocations: () =>
    set(() => {
      const loadedLocations = loadLocationsFromLocalStorage();
      return { locations: loadedLocations };
    }),
}));
