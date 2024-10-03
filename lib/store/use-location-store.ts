import { create } from "zustand";
import { Location } from "@/lib/types";

type State = {
  locations: Location[];
};

type Action = {
  addLocation: (location: Location) => void;
  updateLocation: (location: Location) => void;
  deleteLocation: (id: number) => void;
  loadLocations: () => void; // LocalStorage'dan yükleme fonksiyonu
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

  addLocation: (location) =>
    set((state) => {
      const updatedLocations = [...state.locations, location];
      saveLocationsToLocalStorage(updatedLocations);
      return { locations: updatedLocations };
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
