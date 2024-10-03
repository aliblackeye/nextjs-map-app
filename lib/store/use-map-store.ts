import { create } from "zustand";

type State = {
  firstName: string;
  lastName: string;
};

type Action = {
  setFirstName: (firstName: State["firstName"]) => void;
  setLastName: (lastName: State["lastName"]) => void;
};

export const useMapStore = create<State & Action>((set) => ({
  firstName: "",
  lastName: "",
  setFirstName: (firstName) => set(() => ({ firstName: firstName })),
  setLastName: (lastName) => set(() => ({ lastName: lastName })),
}));
